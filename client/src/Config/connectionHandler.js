
import { io } from "socket.io-client";

const serverPort = 8888;
const serverUrl = "http://localhost:" + serverPort;

function createSocketConfig() {

    const socket = io(serverUrl, {
        autoConnect: false
    });
    
    //equivalente di isConnected(), connesso -> true, non connesso -> false
    function checkConnection(){
        return socket.connected;
    }

    //Metto il socket in ascolto su namespace univoco/privato, per ricevere inviti da altri giocatori
    function registerToInvite(setLobby){
        socket.on("invite" + socket.id,(lobby)=>{
            setLobby(lobby);
        });
    }  
    
    //connetti
    function connect(){
        socket.connect();
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
    function leaveLobby(username,cb){
        socket.emit("leave-lobby",username,cb);
        socket.off("lobby-player-joined");
        socket.off("lobby-player-left");
        socket.off("countdown-game-start");
        socket.off("game-start");
    }

   //invita un player tramite username
    function invitePlayer(lobbyID ,usernameToInvite, cb){
        socket.emit("invite-player",lobbyID,usernameToInvite,cb);
    }

    
    //Mi iscrivo ai cambiamenti riguardanti i player della lobby,
    // come "nuovo membro si è unito alla lobby"
   //oppure "un membro ha lasciato la lobby", aggiornando la lobby corrente
    function updatePlayersLobby(lobby,setLobby,setLeaderLobby,myUsername){
        socket.on("lobby-player-joined",(username)=>{
            lobby.players.push(username);
            setLobby(lobby);
        });
        socket.on("lobby-player-left",(username)=>{
            const indexUsernameLeft = lobby.players.findIndex((u)=> u === username);
            lobby.players.splice(indexUsernameLeft,1);
            lobby.leaderLobby = lobby.players[0]; 
            if(myUsername === lobby.players[0]){
                setLeaderLobby(true);
            }
            setLobby(lobby)    
        });
    }

   //Mi iscrivo ai cambiamenti che succedono nella lobby, come "nuovo membro si è unito alla lobby"
   //oppure "un membro ha lasciato la lobby", aggiornando la lobby corrente
    function updateLobby(lobby,setLobby,myUsername,setLeaderLobby){
        updatePlayersLobby(lobby,setLobby,setLeaderLobby,myUsername);

    }



    //Manda una richiesta al server di iniziare il game, e quidni di darmi i dati necessari per farlo
    function gameStartRequest(lobbyID, setGameState,setGameUpdated,cb){
        socket.emit("game-start-request",lobbyID,cb);
        subscribeUpdateGameTurn(setGameState,setGameUpdated);
        socket.on("game-start",(res)=>{
            setGameState(res);
            setGameUpdated(true);
        })
    }

    //Mi iscrivo agli update del game (quindi ogni volta che viene eseguito un turno)
    function subscribeUpdateGameTurn(setGameState,setGameUpdated){
        socket.on("game-change-turn",(res)=>{
            setGameState(res);
            setGameUpdated(true);
        })
    }

    //Avviso il server che ho finito il turno
    function finishTurn(lobbyID, username,playerGameState, cb){
        socket.emit("player-finish-turn", lobbyID, username, playerGameState, cb);
    }

    return{
        connect,
        disconnect,
        checkConnection,
        sendUsername,
        createLobby,
        joinLobby,
        leaveLobby,
        updateLobby,
        invitePlayer,
        registerToInvite,
        gameStartRequest,
        subscribeUpdateGameTurn,
        finishTurn

    }
}

export const connectionHandlerClient = createSocketConfig();