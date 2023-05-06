import express from 'express';
import { Request } from 'express';
import { Response } from 'express';
import cors from 'cors';

import { createServer } from "http";
import { Server } from "socket.io";

var cors = require('cors');
const httpServer = createServer();
const io = new Server(httpServer, {
  cors:{
    origin:'*',
  }
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(8888);