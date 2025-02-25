import { Server } from 'socket.io';
import { PlayerConnection } from './interface/lobby-interface';
import { repositoryPlayer } from './repository/player-connection-repository';

let io: Server;


export const setupSocketServer = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("Connected "+ socket.id );
    
    socket.on("username",(username)=> {
      //Ricevo l'username dal socket e lo mappo nelle strutture dati
      if(username !== ''){
        repositoryPlayer.loginPlayerSocketID(username, socket.id)
      }
    })
    socket.on("disconnect", () => {
      repositoryPlayer.logoutPlayerSocketID(socket.id);
      console.log("Utente disconnesso:", socket.id);
    });
  });
};


export const setIoInstance = (socketInstance: Server) => {
  io = socketInstance;
};

export const getIoInstance = (): Server => {
  if (!io) {
    throw new Error("Socket.io instance is not initialized.");
  }
  return io;
};

export const isSocketConnected = (player: PlayerConnection): boolean => {
    if(!io){
        throw new Error("Socket.io instance is not initialized.");
    }
    if(!player.socketID)
      return false;
    
    return io.sockets.sockets.has(player.socketID);
  };