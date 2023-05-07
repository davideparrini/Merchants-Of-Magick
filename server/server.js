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
const mapUsername_socket = new Map()
const mapSocketID_Username = new Map();
const mapUsername_lobbyIndex = new Map();


io.on("connection", (socket) => {
    console.log("Connected "+ socket.id );
    socket.on("username",(username)=> {
        mapSocketID_Username.set(socket.id,username);
        mapUsername_socket.set(username,socket);
    })
    lobbyHandler( io, socket, lobbies, mapUsername_socket , mapUsername_lobbyIndex );
    socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
        const username = mapSocketID_Username.get(socket.id);
        mapSocketID_Username.delete(socket.id);
        const indexLobby = mapUsername_lobbyIndex.get(username);
        if(indexLobby >= 0){
            const lobby = lobbies[indexLobby];
            const indexUser =  lobby.players.findIndex((u)=> u === username);
            if(indexUser >= 0){
                lobby.players.splice(indexUser,1); 
                mapUsername_lobbyIndex.delete(username);
                if(lobby.players.length === 0){
                    lobbies.splice(indexLobby,1);
                }
            }
        }
        
    });
});




httpServer.listen(8888);