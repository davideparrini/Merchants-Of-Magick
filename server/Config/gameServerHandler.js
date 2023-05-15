import { gameLogic } from "./gameLogic.js";



function createGameHandler(io, socket, lobbies, mapLobbyID_LobbyIndex, mapLobbyID_GameState){


    function gameStartRequest(lobbyID,config,cb){
        
        const indexLobby = mapLobbyID_LobbyIndex.get(lobbyID);
        if (indexLobby != undefined){
            const lobby = lobbies[indexLobby];
            const gameState = {
                players: [...lobby.players],
                nPlayers : lobby.players.length,
                quest1: false,
                quest2: false,
                nPlayersEndTurn: 0,
                cards: [],
                report: []
            }
            lobby.status = 'in-game';
            mapLobbyID_GameState.set(lobbyID,gameState);
            const gameInit = gameLogic.gameInit(lobby.players, config);
            io.to(lobbyID).emit("game-start",gameInit);
            cb("OK");
            console.log("ok")
        }else{
            cb("ERROR")
            console.log("err")
        }
    }


    function playerFinishTurn(lobbyID, username, playerGameState, cb){
        const gameState = mapLobbyID_GameState.get(lobbyID);
        if (gameState != undefined){
            gameState.nPlayersEndTurn++;
            
            //Check quests
            if(playerGameState.quest1){
                gameState.quest1 = true;
            }
            if(playerGameState.quest2){
                gameState.quest2 = true;
            }

            //Aggiungo le carte del player alle carte della lobby
            const cardsToSend = {
                username: username,
                card1: playerGameState.cards.card1,
                card2: playerGameState.cards.card2,
                card3: playerGameState.cards.card3
            }
            
            gameState.cards.push(cardsToSend); 

            const reportToSend = {
                username: username,
                report: playerGameState.report
            }
            //Aggiungo il report di fine turno
            gameState.report.push(reportToSend);

            if(gameState.nPlayersEndTurn === gameState.nPlayers){

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
            cb("OK");
        }else{
            cb("ERROR")
        }
    }



    function playerEndGame(lobbyID, username, playerFinalReport, cb){
        const gameState = mapLobbyID_GameState.get(lobbyID);
        if (gameState != undefined){
            gameState.nPlayersEndTurn++;

            const reportToSend = {
                username: username,
                position:-1,
                report: playerFinalReport
            }
            //Aggiungo il report di fine turno
            gameState.report.push(reportToSend);

            if(gameState.nPlayersEndTurn === gameState.nPlayers){
                const winnerResolution  = gameLogic.winnerResolution(gameState.report);
                io.to(lobbyID).emit("game-end",winnerResolution);
            }
            cb("OK");
        }else{
            cb("ERROR")
        }
    }

    socket.on("game-start-request", gameStartRequest);
    socket.on("player-finish-turn", playerFinishTurn);
    socket.on("player-end-game", playerEndGame);
} 




export const gameHandler = createGameHandler;