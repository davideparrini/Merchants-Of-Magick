
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
    }

    function disconnect(){
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

   function leaveLobby(lobbyID,username,cb){
        socket.emit("leave-lobby",lobbyID,username,cb);
        socket.off("lobby-player-joined");
        socket.off("lobby-player-left");
   }

   function updateLobby(lobby){
        socket.on("lobby-player-joined",(username)=> lobby.push(username));
        socket.on("lobby-player-left",(username)=>{
            const indexUsername = lobby.findIndex((u)=> u === username);
            lobby.splice(indexUsername,1);    
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
        updateLobby

    }
}

export const connectionHandlerClient = createSocketConfig();