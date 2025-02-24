import { Server } from 'socket.io';

let io: Server;

export const setIoInstance = (socketInstance: Server) => {
  io = socketInstance;
};

export const getIoInstance = (): Server => {
  if (!io) {
    throw new Error("Socket.io instance is not initialized.");
  }
  return io;
};

export const isSocketConnected = (socketId: string): boolean => {
    if(!io){
        throw new Error("Socket.io instance is not initialized.");
    }
    return io.sockets.sockets.has(socketId);
  };