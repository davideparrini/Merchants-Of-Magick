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
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("❌ Fatal uncaught error:", err);
  // Perform cleanup and graceful shutdown
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled promise rejection:", reason);
});

// Initialize Express with security and performance optimizations
const app = express();
const server = http.createServer(app);

// Configure Socket.IO with optimized settings
const io = new SocketIOServer(server, {
  cors: { 
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"]
});

// Setup WebSocket
setIoInstance(io);
setupSocketServer(io);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "*",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});
app.use(limiter);

// Performance middleware
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(logger);

// API routes with authentication
app.use(API_PRIVATE, authenticationHandler);
app.use(`${API_PRIVATE}`, genericRouter);
app.use(`${API_PRIVATE}/lobby`, lobbyRouter);
app.use(`${API_PRIVATE}/game`, gameRouter);

// Error handling middleware
app.use(errorMiddleware);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Start server with proper error handling
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
}).on("error", (err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
