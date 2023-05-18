import { createServer } from "http";
import { Server } from "socket.io";
import { lobbyHandler } from "./Config/lobbyServerHandler.js";
import { gameHandler } from "./Config/gameServerHandler.js";
import { gameLogic } from "./Config/gameLogic.js";

const httpServer = createServer();

const io = new Server(httpServer, {

    cors:{
        //imposto origini da ovunque
        origin:'*',
    }
});

//Array delle lobbies
const lobbies = [];

//Mapping lobbyID_LobbyIndex nell'array di lobbies
const mapLobbyID_LobbyIndex = new Map();

//Mapping username-socket
const mapUsername_socket = new Map();

//Mapping socket.id-username
const mapSocketID_Username = new Map();

//Mapping username-lobby.id
const mapUsername_lobbyIndex = new Map();

const mapLobbyID_GameState = new Map();

io.on("connection", (socket) => {
    console.log("Connected "+ socket.id );
    //Connesso
    socket.on("username",(username)=> {
        //Ricevo l'username dal socket e lo mappo nelle strutture dati
        if(username !== ''){
            mapSocketID_Username.set(socket.id,username);
            mapUsername_socket.set(username,socket);
        }
        

    })
    //lobbyHandler è la funzione che mi permette di gestire le interazioni che ci sono tra l'utente e la lobby con cui andrà ad interagire
    lobbyHandler( io, socket, lobbies,mapLobbyID_LobbyIndex, mapUsername_socket , mapUsername_lobbyIndex, mapLobbyID_GameState );

    gameHandler(io, socket, lobbies, mapLobbyID_LobbyIndex, mapLobbyID_GameState);

    socket.on("disconnect", () => {
        //Disconnesso
        console.log("disconnected", socket.id);
        

        //Recupero l'username e lo elimino dalle strutture dati
        const username = mapSocketID_Username.get(socket.id);

        const indexLobby = mapUsername_lobbyIndex.get(username);
        if (indexLobby != undefined){
            const lobby = lobbies[indexLobby];
            const lobbyID = lobby.id;
            const indexUsername = lobby.players.findIndex((u)=> u === username);
            if(indexUsername >= 0){
                lobby.players.splice(indexUsername,1);
                lobby.leaderLobby = lobby.players[0];
                mapUsername_lobbyIndex.delete(username);
                console.log(username + ' want to left '+ lobby.leaderLobby +'\'s lobby');
                if(lobby.status === 'in-game'){
                    const gameState = mapLobbyID_GameState.get(lobbyID);
                    gameState.nPlayers--;
                    gameState.players.splice(indexUsername,1);
                    console.log(lobby.leaderLobby +'\'s lobby is in game');
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
                        console.log(lobby.leaderLobby +'\'s lobby update turn');
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
            console.log(username + ' left '+ lobby.leaderLobby +'\'s lobby');
            socket.broadcast.to(lobby.id).emit("lobby-player-left",username);
            socket.leave(lobby.id);

            
        }
        
    });
});




httpServer.listen(8888);