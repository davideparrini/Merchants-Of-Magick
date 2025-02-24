import { Card, GameState, SignedReport } from './game-interface'

export interface Lobby {
  id: string;
  players: PlayerConnection[];
  leader: string;
  status: string;
  gameState: GameState;
  kickedPlayers: string[];
}


  
  export interface PlayerConnection {
    username: string;
    userID: string;
    socketID?: string;
    lobbyID?: string;
  }