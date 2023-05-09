
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
    function registerToInvite(cb){
        socket.on("invite" + socket.id,(lobby)=>{
            cb(lobby);
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
   }

   //invita un player tramite username
   function invitePlayer(lobbyID ,usernameToInvite, cb){
        socket.emit("invite-player",lobbyID,usernameToInvite,cb);
   }

   //iscriviti ai cambiamenti che succedono nella lobby, come "nuovo membro si è unito alla lobby"
   //oppure "un membro ha lasciato la lobby", aggiornando la lobby corrente
   function updateLobby(lobby,setLobby){
        socket.on("lobby-player-joined",(username)=>{
            lobby.players.push(username);
            setLobby(()=>lobby);
        });
        socket.on("lobby-player-left",(username)=>{
            const indexUsernameLeft = lobby.players.findIndex((u)=> u === username);
            lobby.players.splice(indexUsernameLeft,1);
            if(username === lobby.leaveLobby){
                lobby.leaderLobby = lobby.players[0];
            }
            setLobby(()=>lobby)    
        });
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
        registerToInvite

    }
}

export const connectionHandlerClient = createSocketConfig();