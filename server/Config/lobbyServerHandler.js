
import { v4 as uuid } from 'uuid';
import { gameLogic } from './gameLogic.js';


function lobbyConnectionHandler(io, socket, lobbies, mapLobbyID_LobbyIndex,mapUsername_Socket, mapUsername_lobbyIndex, mapLobbyID_GameState ) {

    //l'utente crea la lobby assegnando un id random, la cb permette di passare la lobby creata all'utente
    function create(username, cb){
        const lobby = {
            id : uuid(),
            players : [username],
            leaderLobby : username,
            status: 'in-lobby'
        } 
        mapUsername_lobbyIndex.set(username, lobbies.length);
        mapLobbyID_LobbyIndex.set(lobby.id, lobbies.length)
        lobbies.push(lobby);
        socket.join(lobby.id);
        cb(lobby);

    }

    //l'utente joina una lobby tramite ID e con la cb diamo un messaggio di feedback e la lobby joinata
    function join(lobbyID, username,cb){
        const indexLobby = mapLobbyID_LobbyIndex.get(lobbyID);
        if (indexLobby != undefined){
            const lobby = lobbies[indexLobby];
            if(lobby.players.length >= 8){
                cb("FULL",-1);
            }else{
                if(lobby.status !== 'in-game'){
                    lobby.players.push(username);
                    mapUsername_lobbyIndex.set(username,indexLobby);
                    socket.join(lobby.id);
                    //dico alla lobby che si è connesso un utente e gli passo l'username
                    socket.broadcast.to(lobby.id).emit("lobby-player-joined",username);
                    cb("OK",lobby);
                }else{
                    cb("in-game",-1);
                }
                
            }
        }
        else{
            cb("ERROR",-1);
        }
    }

    //permette di invitare un utente tramite l'username, la callback da solo un messaggio di feedback
    function invitePlayer(lobbyID, usernameInvited, cb){
        const userSocket = mapUsername_Socket.get(usernameInvited);
        if(userSocket !== undefined){
            if(mapUsername_lobbyIndex.has(usernameInvited)){
                cb("ALREADY_IN_A_LOBBY");
            }
            else{
                const indexLobby = mapLobbyID_LobbyIndex.get(lobbyID);
                if(indexLobby != undefined){
                    const lobby = lobbies[indexLobby];
                    if(lobby.players.length >= 8){
                        cb("FULL")
                    }else{
                        if(lobby.status !== 'in-game'){
                            lobby.players.push(usernameInvited);

                            mapUsername_lobbyIndex.set(usernameInvited,indexLobby);
                            
                            userSocket.join(lobby.id);
                            //comunico all'utente che fa parte della lobby e gli spedisco la lobby, tramite il namespace registrato all'inizio della connessione
                            // dell' utente
                            io.emit("invite" + userSocket.id, lobby);
                            //comunico alla lobby che si è unito un utente e mando il suo username
                            io.to(lobby.id).emit("lobby-player-joined",usernameInvited);
                            cb("OK")
                        }else{
                            cb('in-game')
                        }
                    }
                }else {
                    cb("ERROR");
                }
            }
        }
    }

    //utente esce dalla lobby
    function leave(username){
        const indexLobby = mapUsername_lobbyIndex.get(username);
        if (indexLobby != undefined){
            const lobby = lobbies[indexLobby];
            const lobbyID = lobby.id;
            const indexUsername = lobby.players.findIndex((u)=> u === username);
            if(indexUsername >= 0){
                lobby.players.splice(indexUsername,1);
                
                lobby.leaderLobby = lobby.players[0];
                mapUsername_lobbyIndex.delete(username);
                
                if(lobby.status === 'in-game'){
                    const gameState = mapLobbyID_GameState.get(lobbyID);
                    gameState.nPlayersEndTurn--;
                    gameState.players.splice(indexUsername,1);

                    if( gameState.nPlayers <= gameState.nPlayersEndTurn ){
                        //Faccio l'update delle carte, ovvero ne creo di nuove, le sostituisco con quelle già giocate/craftate
                        //ed eseguo uno slittamento di una carta al compagno vicino
                        const cardsUpdated = gameLogic.updateCardsTurn(gameState.cards, gameState.players);
    
                        const response = {
                            quest1: gameState.quest1,
                            quest2: gameState.quest2,
                            dices: gameLogic.rollDices(),
                            cards: cardsUpdated,
                            report: gameState.report
                        }
                
                        io.to(lobbyID).emit("game-change-turn", response);
    
                        //Faccio un refresh delle strutture dati che non  contengono dati sono persisenti
                        // (cards, report, nPlayersEndTurn vengo riaggiornati durante il turno di partita)
                        gameState.cards = [];
                        gameState.report = [];
                        gameState.nPlayersEndTurn = 0;
                    }
                }
                if(lobby.players.length < 1){
                    //se l'utente è ultimo membro della lobby, elimino la lobby
                    lobbies.splice(indexLobby,1);
                    mapLobbyID_LobbyIndex.delete(lobbyID);
                    mapLobbyID_GameState.delete(lobbyID);
                }
            }
            
            socket.broadcast.to(lobby.id).emit("lobby-player-left",username);
            socket.leave(lobby.id);
            
        }
    }



    socket.on("create-lobby", create);
    socket.on("join-lobby", join);
    socket.on("leave-lobby", leave);
    socket.on("invite-player", invitePlayer);
}

export const lobbyHandler = lobbyConnectionHandler;