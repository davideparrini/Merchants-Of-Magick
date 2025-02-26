import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { setIoInstance, setupSocketServer } from "./socket";
import { errorMiddleware } from "./middlewares/errors-handler";
import { logger } from "./middlewares/logger";
import lobbyRouter from "./routes/lobby-routes";
import gameRouter from "./routes/game-routes";
import { PORT } from "./Config/config";


// Inizializzazione Express
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" }
});
// Setup WebSocket
setIoInstance(io);
setupSocketServer(io);

// Middleware
app.use(logger);
app.use(cors());
app.use(express.json());

// Router
app.use("/lobby", lobbyRouter);
app.use("/game", gameRouter);

// Middleware gestione errori
app.use(errorMiddleware);



// Avvia il server
server.listen(PORT, () => {
  console.log(`Server in ascolto su ${PORT}`);
});
