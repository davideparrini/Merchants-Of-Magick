
import { v4 as uuid } from 'uuid';
import { gameLogic } from './gameLogic.js';


function lobbyConnectionHandler(io, socket, lobbies, mapLobbyID_LobbyIndex,mapUsername_Socket, mapUsername_lobbyIndex, handlePlayerLeftGame ) {

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
        console.log(username+ ' create a new lobby');
    }

    //l'utente joina una lobby tramite ID e con la cb diamo un messaggio di feedback e la lobby joinata
    function join(lobbyID, username,cb){
        const indexLobby = mapLobbyID_LobbyIndex.get(lobbyID);
        if (indexLobby != undefined){
            const lobby = lobbies[indexLobby];
            if(lobby.players.length >= 8){
                cb("FULL",-1);
            }else{
                if(lobby.status === 'in-lobby'){
                    lobby.players.push(username);
                    mapUsername_lobbyIndex.set(username,indexLobby);
                    socket.join(lobby.id);
                    //dico alla lobby che si è connesso un utente e gli passo l'username
                    socket.broadcast.to(lobby.id).emit("lobby-player-joined",username);
                    console.log(username + ' joined '+ lobby.leaderLobby +'\'s lobby');
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
    function requestInvitePlayer(lobbyID, usernameInviter ,usernameInvited, cb){
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
                            //comunico all'utente che fa parte della lobby e gli spedisco la lobby, tramite il namespace registrato all'inizio della connessione
                            // dell' utente
                            io.emit("invite" + userSocket.id, lobbyID, usernameInviter);
                            console.log("Inviter: " + usernameInviter + ' Invited: ' + usernameInvited)
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
    function leave(username,lobbyID){
        handlePlayerLeftGame(username);
        console.log(username + ' left the lobby ' + lobbyID);
        socket.broadcast.to(lobbyID).emit("lobby-player-left",username);
        socket.leave(lobbyID);
    }



    socket.on("create-lobby", create);
    socket.on("join-lobby", join);
    socket.on("leave-lobby", leave);
    socket.on("invite-player", requestInvitePlayer);

}

export const lobbyHandler = lobbyConnectionHandler;