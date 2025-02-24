import { Card, Report } from './game-interface'

export interface Lobby {
  id: string;
  players: PlayerConnection[];
  leader: string;
  status: string;
  gameState: GameState;
  kickedPlayers: string[];
}

export interface GameState {
    quest1: boolean;
    quest2: boolean;
    nPlayersEndTurn: number;
    cards: Card[];
    reports: Report[];
  }
  
  
  export interface PlayerConnection {
    username: string;
    userID: string;
    socketID?: string;
    lobbyID?: string;
  }