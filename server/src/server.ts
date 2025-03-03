import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { setIoInstance, setupSocketServer } from "./socket";
import { errorMiddleware } from "./middlewares/errors-handler";
import { logger } from "./middlewares/logger";
import lobbyRouter from "./routes/lobby-routes";
import gameRouter from "./routes/game-routes";
import { API_PRIVATE, PORT } from "./Config/config";
import { authenticationHandler } from "./middlewares/authentication-handler";
import genericRouter from "./routes/generic-routes";


process.on("uncaughtException", (err) => {
  console.error("❌ Errore fatale non catturato:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Promise rifiutata senza gestione:", reason);
});


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
app.use(API_PRIVATE, authenticationHandler);

// Router
app.use(`${API_PRIVATE}`, genericRouter);
app.use(`${API_PRIVATE}/lobby`, lobbyRouter);
app.use(`${API_PRIVATE}/game`, gameRouter);

// Middleware gestione errori
app.use(errorMiddleware);



// Avvia il server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server in ascolto su ${PORT}`);
});
