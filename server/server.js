
const { createServer } = require("http");
const { Server } = require("socket.io");
const { lobbyHandler } = require("./src/Config/lobbyServerHandler.js");
const { gameHandler } = require("./src/Config/gameServerHandler.js");
const { gameLogic } = require("./src/Config/gameLogic.js");


const PORT = 8888;
const httpServer = createServer();

const io = new Server(httpServer, {

    cors:{
        //imposto origini da ovunque
        origin:'*',
    }
});

//Mapping lobbyID_Lobby 
const mapLobbyID_Lobby = new Map();

//Mapping username-socket
const mapUsername_socket = new Map();

//Mapping socket.id-username
const mapSocketID_Username = new Map();

//Mapping username-lobby.id
const mapUsername_lobbyID = new Map();

const mapLobbyID_GameState = new Map();


function handlePlayerLeftGame(username){

    const lobbyID = mapUsername_lobbyID.get(username);

    if (lobbyID === undefined){
        return;
    }
//Recupero la lobby dell'utente che sta lasciando la lobby
    const lobby = mapLobbyID_Lobby.get(lobbyID);

    
    if(lobby === undefined || lobby.players === undefined){
        return;
    }
    //Cerco l'index dell'utente tra frai players della lobby
    const indexUsername = lobby.players.findIndex((u)=> u === username);

    if(indexUsername < 0){
        return;
    }
    //elimino il player dalla lobby
    lobby.players.splice(indexUsername,1);

    //setto il leader al giocatore di index 0
    lobby.leaderLobby = lobby.players[0];

    //elimino l'utente dalla map username-lobbyIndex
    mapUsername_lobbyID.delete(username);

    console.log(username + ' wants to leave '+ lobby.leaderLobby +'\'s lobby');

    //Check sullo stato della lobby

    switch(lobby.status){
        case 'in-game':
            const gameState_inGame = mapLobbyID_GameState.get(lobbyID);
            gameState_inGame.nPlayers--;
            gameState_inGame.players.splice(indexUsername,1);
            console.log(lobby.leaderLobby +'\'s lobby is in game');

            //Se tutti i giocatori rimanenti hanno finito il turno, aggiorno il turno
            if( gameState_inGame.nPlayers === gameState_inGame.nPlayersEndTurn ){

                //Faccio l'update delle carte, ovvero ne creo di nuove, le sostituisco con quelle già giocate/craftate
                //ed eseguo uno slittamento di una carta al compagno vicino
                const cardsUpdated = gameLogic.updateCardsTurn(gameState_inGame.cards, gameState_inGame.players);
                const response = {
                    quest1: gameState_inGame.quest1,
                    quest2: gameState_inGame.quest2,
                    dices: gameLogic.rollDices(),
                    cards: cardsUpdated,
                    report: gameState_inGame.report
                }
                console.log(lobby.leaderLobby +'\'s lobby update turn');
                io.to(lobbyID).emit("game-change-turn", response);

                //Faccio un refresh delle strutture dati che non  contengono dati sono persisenti
                // (cards, report, nPlayersEndTurn vengo riaggiornati durante il turno di partita)
                gameState_inGame.cards = [];
                gameState_inGame.report = [];
                gameState_inGame.nPlayersEndTurn = 0;
            }
            break;
        case 'end-game':
            const gameState_endGame = mapLobbyID_GameState.get(lobbyID);
            gameState_endGame.nPlayers--;
            gameState_endGame.players.splice(indexUsername,1);
            console.log(lobby.leaderLobby +'\'s lobby is ending the game');

            if(gameState_endGame.nPlayersEndTurn === gameState_endGame.nPlayers){
                const winnerResolution  = gameLogic.winnerResolution(gameState_endGame.report);
                lobby.status = 'game-over';
                io.to(lobbyID).emit("game-end",winnerResolution);
            }
        break;
        default: break;

    }
   
    //se l'utente era l'ultimo rimasto elimino la lobby
    if(lobby.players.length < 1){   
        //se l'utente è ultimo membro della lobby, elimino la lobby
        mapLobbyID_Lobby.delete(lobbyID);
        mapLobbyID_GameState.delete(lobbyID);
    }

        
}

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
    lobbyHandler( io, socket, mapLobbyID_Lobby, mapUsername_socket , mapUsername_lobbyID, handlePlayerLeftGame );

    gameHandler(io, socket,mapLobbyID_Lobby, mapLobbyID_GameState);

    socket.on("disconnect", () => {
        //Disconnesso
        console.log("disconnected", socket.id);
        
        //Recupero l'username e lo elimino dalle strutture dati
        const username = mapSocketID_Username.get(socket.id);
        
        const lobbyID = mapUsername_lobbyID.get(username);
        
        if(lobbyID !== undefined){
            const lobby = mapLobbyID_Lobby.get(lobbyID);
            if(lobby !== undefined){
                handlePlayerLeftGame(username);
                console.log(username + ' left the lobby');
                socket.broadcast.to(lobbyID).emit("lobby-player-left",username);
                socket.leave(lobbyID);
            }
        }
        
    });
});




httpServer.listen(PORT);