

import { repositoryLobby } from '../repository/lobby-repository';
import { ERRORS, LOBBY_STATUS } from '../constants/constants';
import { GameState, Lobby } from '../interface/lobby-interface';
import { gameService } from './game-service';

const MAX_CAPACITY_LOBBY = Number(process.env.MAX_CAPACITY_LOBBY) || 8;


const joinLobby = async (lobbyID: string, username: string): Promise<{ error?: string; lobby?: Lobby; }> => {

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
   
    lobby.players.push(username);
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
    return gameService.gameInit(lobby.players, config);
};


export const lobbyService = {
    joinLobby,
    startLobbyGame
};
