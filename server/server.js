import { createServer } from "http";
import { Server } from "socket.io";
import { lobbyHandler } from "./Config/lobbyServerHandler.js";
import { gameHandler } from "./Config/gameServerHandler.js";

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
        mapSocketID_Username.delete(socket.id);
        mapUsername_socket.delete(username);

        //cerco l'username tra le lobby per eliminarlo
        const indexLobby = mapUsername_lobbyIndex.get(username);
 
        if(indexLobby >= 0){
            const lobby = lobbies[indexLobby];
            const indexUser =  lobby.players.findIndex((u)=> u === username);

            if(indexUser >= 0){
                //elimino l'utente dalla lobby
                lobby.players.splice(indexUser,1); 
                mapUsername_lobbyIndex.delete(username);

                if(lobby.players.length < 1){
                    //se è l'ultimo utente nella lobby, cancello la lobby
                    lobbies.splice(indexLobby,1);
                }
            }
        }
        
    });
});




httpServer.listen(8888);