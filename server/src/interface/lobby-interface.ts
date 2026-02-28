import { BackupPlayer, Card, GameState, GameStateBackup, SignedReport } from './game-interface'

export interface Lobby {
  id: string;
  players: PlayerConnection[];
  leader: string;
  status: string;
  gameState: GameState;
  backupGameState: GameStateBackup;
  kickedPlayers: string[];
  backupPlayers: SignedBackupPlayerGameState[];
}

export interface LobbyResponse {
  id: string;
  players: string[];
  leader: string;
}

  
  export interface PlayerConnection {
    username: string;
    userID: string;
    socketID?: string;
    lobbyID?: string;
  }

export interface SignedBackupPlayerGameState{
  username: string;
  backup: BackupPlayer;
}