

import { repositoryLobby } from '../repository/lobby-repository';
import { ERRORS, LOBBY_STATUS, SocketEvents } from '../constants/constants';
import { GameState, Lobby } from '../interface/lobby-interface';
import { gameService } from './game-service';
import { getIoInstance } from '../socket-utility';

const MAX_CAPACITY_LOBBY = Number(process.env.MAX_CAPACITY_LOBBY) || 8;

const io = getIoInstance();

const joinLobby = async (lobbyID: string, username: string, socketId: string): Promise<{ error?: string; lobby?: Lobby; }> => {

    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (!lobby) {
        throw new NotFoundError(ERRORS.LOBBY_NOT_FOUND);
    }

    if (lobby.players.length === MAX_CAPACITY_LOBBY ) {
        throw new ForbiddenError(ERRORS.LOBBY_FULL);
    }

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_ALREADY_STARTED);
    }
   
    lobby.players.push({username, socketId});
    return { lobby };
};

const startLobbyGame = async (lobbyID: string, config: any) => {

    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (!lobby) {
        throw new NotFoundError(ERRORS.LOBBY_NOT_FOUND);
    }
    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_ALREADY_STARTED);
    }

    
    const gameState: GameState = {
        quest1: false,
        quest2: false,
        nPlayersEndTurn: 0,
        cards: [],
        report: []
    };
    
    // Salva lo stato nel DB
    await repositoryLobby.changeLobbyStatus(lobbyID, LOBBY_STATUS.IN_GAME);
    await repositoryLobby.updateGameState(lobbyID, gameState);

    // Inizializza il gioco
    return gameService.gameInit(lobby.players.map(p => p.username), config);
};


export const kickPlayerFromLobby = async (lobbyID: string, username: string, leaderUsername: string) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (!lobby) {
        throw new NotFoundError(ERRORS.LOBBY_NOT_FOUND);
    }

    if (lobby.leaderLobby !== leaderUsername) {
        throw new ForbiddenError(ERRORS.NOT_LOBBY_LEADER);
    }

    const playerIndex = lobby.players.findIndex((player) => player.username === username);
    if (playerIndex === -1) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }

    await repositoryLobby.removePlayerFromLobby(lobbyID, username);
    
    io.to(lobbyID).emit(SocketEvents.LOBBY_PLAYER_LEFT, username);

};

export const lobbyService = {
    joinLobby,
    startLobbyGame,
    kickPlayerFromLobby
};
