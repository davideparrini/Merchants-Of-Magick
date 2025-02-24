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
