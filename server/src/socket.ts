import { Server } from 'socket.io';
import { PlayerConnection } from './interface/lobby-interface';

let io: Server;


export const setupSocketServer = (io: Server) => {
  io.on("connection", (socket) => {
    
    

    socket.on("disconnect", () => {
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