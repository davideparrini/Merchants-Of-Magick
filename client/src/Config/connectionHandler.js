
import { io } from "socket.io-client";

const serverPort = 8888;
const serverUrl = "http://localhost:" + serverPort;

function createSocketConfig() {

    const socket = io(serverUrl, {
        autoConnect: false
    });
    
    function checkConnection(){
        return socket.connected;
    }

    function connect(){
        socket.connect();
        socket.join(socket.id);
    }

    function disconnect(){
        socket.leave(socket.id);
        socket.disconnect();
    }
    
    function sendUsername(username){
        socket.emit("username",username);
    }

    function createLobby(username,cb){
        socket.emit("create-lobby", username,cb);    

    }

   function joinLobby(lobbyID,username,cb){
        socket.emit("join-lobby",lobbyID,username,cb);
   }

   function leaveLobby(username,cb){
        socket.emit("leave-lobby",username,cb);
        socket.off("lobby-player-joined");
        socket.off("lobby-player-left");
   }

   function invitePlayer(lobbyID ,usernameToInvite, cb){
        socket.emit("invite-player",lobbyID,usernameToInvite,cb);
   }

   function updateLobby(lobby){
        socket.on("lobby-player-joined",(username)=> lobby.push(username));
        socket.on("lobby-player-left",(username)=>{
            const indexUsernameLeft = lobby.findIndex((u)=> u === username);
            lobby.splice(indexUsernameLeft,1);    
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
        invitePlayer

    }
}

export const connectionHandlerClient = createSocketConfig();