import { createServer } from "http";
import { Server } from "socket.io";
import { lobbyHandler } from "./LobbyHandler.js";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors:{
        origin:'*',
    }
});

const lobbies = [];
const mapUsernames_socketID = new Map();
const mapUsernames_lobbyIndex = new Map();


io.on("connection", (socket) => {
    console.log("Connected "+ socket.id );
    socket.on("username",(username)=> mapUsernames_socketID.set(socket.id,username))
    lobbyHandler(io,socket,lobbies,mapUsernames_lobbyIndex);
    socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
        const username = mapUsernames_socketID.get(socket.id);
        mapUsernames_socketID.delete(socket.id);
        const indexLobby = mapUsernames_lobbyIndex.get(username);
        if(indexLobby >= 0){
            const lobby = lobbies[indexLobby];
            const indexUser =  lobby.players.findIndex((u)=> u === username);
            if(indexUser >= 0){
                lobby.players.splice(indexUser,1); 
                mapUsernames_lobbyIndex.delete(username);
                if(lobby.players.length === 0){
                    lobbies.splice(indexLobby,1);
                }
            }
        }
        
    });
});




httpServer.listen(8888);