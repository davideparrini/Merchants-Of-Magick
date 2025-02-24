import dotenv from "dotenv";

// Carica le variabili di ambiente dal file .env
dotenv.config();


export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const NODE_ENV= process.env.NODE_ENV || "dev"
export const MAX_CAPACITY_LOBBY = Number(process.env.MAX_CAPACITY_LOBBY) || 8;