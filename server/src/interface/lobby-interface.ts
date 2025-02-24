import { Card, Report } from './game-interface'

export interface GameState {
    quest1: boolean;
    quest2: boolean;
    nPlayersEndTurn: number;
    cards: Card[];
    report: Report[];
  }
  
  export interface Lobby {
    id: string;
    players: Player[];
    leaderLobby: string;
    status: string;
    gameState: GameState;
  }
  
  export interface Player {
    username: string;
    socketId: string;
  }