
import { io } from "socket.io-client";

const serverPort = 8888;
const serverUrl = "http://localhost:" + serverPort;

function createSocketConfig() {

    const socket = io(serverUrl);
    

    //Metto il socket in ascolto su namespace univoco/privato, per ricevere inviti da altri giocatori
    function registerToInvite(setLobby){
        socket.on("invite" + socket.id,(lobby)=>{
            setLobby(lobby);
        });
    }  
    
    //connetti
    function connect(setStatusOnline){
        socket.on("connect", () => {
            setStatusOnline(true)
            console.log("CONNECTED"); 
          });
        socket.on("disconnect", () => {
            setStatusOnline(false);
            console.log("DISCONNECTED")
        });
    }

    //disconnetti e disiscriviti dal namespace "privato"
    function disconnect(){
        socket.off("invite"+socket.id);
        socket.disconnect();
    }
    
    //invia l'username al server
    function sendUsername(username){
        socket.emit("username",username);
    }

    //crea una nuova lobby
    function createLobby(username,cb){
        socket.emit("create-lobby", username,cb);    

    }

    //joina una lobby tramite ID
    function joinLobby(lobbyID,username,cb){
        socket.emit("join-lobby",lobbyID,username,cb);
    }

   //esci dalla lobby corrente e smetti di ascoltare i "canali" della lobby
    function leaveLobby(username){
        socket.emit("leave-lobby",username);
        socket.off("lobby-player-joined");
        socket.off("lobby-player-left");
        socket.off("countdown-game-start");
        socket.off("game-start");
        socket.off("game-change-turn");
        socket.off("game-end");
    }

   //invita un player tramite username
    function invitePlayer(lobbyID ,usernameToInvite, cb){
        socket.emit("invite-player",lobbyID,usernameToInvite,cb);
    }

    
   //Mi iscrivo ai cambiamenti che succedono nella lobby e passaggio di stato da lobby a game
    function updateLobby(
                    lobby,
                    setLobby,
                    myUsername,
                    setLobbyUpdated, 
                    setGameStart, 
                    setGameInitState, 
                    setGameUpdated, 
                    setGameOnNewTurn,
                    setGameEndState,
                    setGameEnd
                ){
        
        //Aggiorno lobby se ha joinato qualcuno
        socket.on("lobby-player-joined",(username)=>{
            lobby.players.push(username);
            setLobby(lobby);
            setLobbyUpdated(true);
        });

        //Aggiorno lobby se qualche player è uscito dalla lobby
        socket.on("lobby-player-left",(username)=>{
            const indexUsernameLeft = lobby.players.findIndex((u)=> u === username);
            lobby.players.splice(indexUsernameLeft,1);
            lobby.leaderLobby = lobby.players[0]; 
            setLobby(lobby);
            setLobbyUpdated(true); 
        });

        //Mi metto in ascolto ai cambi di stato (Lobby State -> Game State)
        socket.on("game-start",(res)=>{
            setGameInitState(res);
            setGameStart(true);
        })

        //Mi metto in ascolto sui cambiamenti che ci sono stati nel gioco
        socket.on("game-change-turn",(res)=>{
            setGameOnNewTurn(res);
            setGameUpdated(true);
        })

        //Mi metto in ascolto per la fine del gioco
        socket.on("game-end",(res)=>{
            console.log("END STATE"+res)
            setGameEndState(res);
            setGameEnd(true);
        })
    }



    //Manda una richiesta al server di iniziare il game
    function gameStartRequest(lobbyID, config, cb){
        socket.emit("game-start-request",lobbyID, config, cb);
    }


    //Avviso il server che ho finito il turno
    function finishTurn(lobbyID, username,playerGameState, cb){
        socket.emit("player-finish-turn", lobbyID, username, playerGameState, cb);
    }


    function endGame(lobbyID, username,finalReport, cb){
        socket.emit("player-end-game", lobbyID, username, finalReport, cb);
    }

    return{
        connect,
        disconnect,
        sendUsername,
        createLobby,
        joinLobby,
        leaveLobby,
        updateLobby,
        invitePlayer,
        registerToInvite,
        gameStartRequest,
        finishTurn,
        endGame,
        socket
    }
}

export const connectionHandlerClient = createSocketConfig();