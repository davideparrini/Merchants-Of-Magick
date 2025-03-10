import { Server } from 'socket.io';
import { Lobby, PlayerConnection } from './interface/lobby-interface';
import { repositoryPlayer } from './repository/player-connection-repository';
import { mapper } from './mapper';
import { ServerSocketError } from './Errors/ServerSocketError';

let io: Server;


// Funzione per generare dati casuali
const generateRandomData = () => {
  // Genera un codice azione casuale (es. A1, A2, A3, etc.)
  const codice = `A${Math.floor(Math.random() * 100) + 1}`;
  // Genera un prezzo casuale (tra 100 e 1000)
  const prezzo = (Math.random() * (1000 - 100) + 100).toFixed(2);

  return { codice, prezzo: parseFloat(prezzo) };
};

// Funzione per emettere i dati al client
const emitData = () => {
  // Crea dei dati casuali
  const data = generateRandomData();

  // Invia i dati a tutti i client connessi
  console.log("mandato")
  io.emit('serverMessage', data);
};
export const setupSocketServer = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Connected "+ socket.id );
    const intervalId = setInterval(emitData, 100);
    socket.on("disconnect", () => {
      // repositoryPlayer.logoutPlayerSocketID(socket.id);
      clearInterval(intervalId);
      console.log("Utente disconnesso:", socket.id);
    });
  });
};


export const setIoInstance = (socketInstance: Server) => {
  io = socketInstance;
};

export const getIoInstance = (): Server => {
  if (!io) {
    throw new ServerSocketError();
  }
  return io;
};

export const isSocketConnected = (player: PlayerConnection): boolean => {
    if(!io){
        throw new ServerSocketError();
    }
    if(!player.socketID)
      return false;
    
    return io.sockets.sockets.has(player.socketID);
  };



export const emitLobbyUpdate = (lobby: Lobby) =>{
  io.to(lobby.id).emit(SOCKET_EVENTS.LOBBY_UPDATE, mapper.mapLobbyToLobbyResponse(lobby));
}

export const emitLobbyInvite = (lobby: Lobby) =>{
  io.to(lobby.id).emit(SOCKET_EVENTS.LOBBY_UPDATE, mapper.mapLobbyToLobbyResponse(lobby));
}


export const SOCKET_EVENTS = {
  // Events for the lobby
  LOBBY_UPDATE: "update-lobby",
  LOBBY_INVITE: "invite-player",

  // Events for the game
  GAME_START: "game-start",
  GAME_CHANGE_TURN: "game-change-turn",
  GAME_END: "game-end"

};