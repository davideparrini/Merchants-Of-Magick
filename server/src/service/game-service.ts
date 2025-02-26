import { ERRORS, LOBBY_STATUS } from "../constants/constants";
import { ForbiddenError } from "../Errors/ForbiddenError";
import { NotFoundError } from "../Errors/NotFoundError";
import { SignedFinalReport, PlayerGame } from "../interface/game-interface";
import { Lobby } from "../interface/lobby-interface";
import { repositoryLobby } from "../repository/lobby-repository";
import { getIoInstance, SOCKET_EVENTS } from "../socket";
import { gameLogicService } from "./game-logic-service";



const checkPlayerInLobby = (lobby: Lobby, playerUsername: string) => {
    if (!lobby.players.some(player => player.username === playerUsername)) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
};


const startGame = async (lobbyID: string, config: any): Promise<any> => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_NOT_IN_LOBBY);
    }

    await repositoryLobby.changeLobbyStatus(lobbyID, LOBBY_STATUS.IN_GAME);
    const gameInit = gameLogicService.gameInit(lobby.players.map(p => p.username), config, lobbyID);
    
    const io = getIoInstance();
    io.to(lobbyID).emit(SOCKET_EVENTS.GAME_START, gameInit);
    return gameInit;
};

const playerFinishTurn = async (lobbyID: string, playerGameState: PlayerGame) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED);
    }
    checkPlayerInLobby(lobby,playerGameState.username);


    const gameState = await repositoryLobby.getGameState(lobbyID);
    gameState.nPlayersEndTurn++;
    gameState.quest1 ||= playerGameState.report.quest1;
    gameState.quest2 ||= playerGameState.report.quest2;
    gameState.cards.push({
        username: playerGameState.username,
        card1: playerGameState.card1,
        card2: playerGameState.card2,
        card3: playerGameState.card3
    });
    gameState.reports.push({
        username: playerGameState.username,
        report: playerGameState.report
    });
    
    await repositoryLobby.updateGameState(lobbyID, gameState);

    checkAllPlayersFinishTurn(lobby);
};

const checkAllPlayersFinishTurn = async (lobby: Lobby) => {
    if (lobby.gameState.nPlayersEndTurn === lobby.players.length) {
        lobby.gameState.cards = gameLogicService.updateCardsTurn(lobby.gameState.cards, lobby.players.map(p => p.username),lobby.gameState.decks);
        const response = {
            quest1: lobby.gameState.quest1,
            quest2: lobby.gameState.quest2,
            dices: gameLogicService.rollDices(),
            cards: lobby.gameState.cards,
            reports: lobby.gameState.reports
        };
        
        const io = getIoInstance();
        io.to(lobby.id).emit(SOCKET_EVENTS.GAME_CHANGE_TURN, response);
        Object.assign(lobby.gameState, { nPlayersEndTurn: 0, cards: [], reports: [] });
        await repositoryLobby.updateGameState(lobby.id, lobby.gameState);
    }
}

const playerEndGame = async (lobbyID: string, playerFinalReport: SignedFinalReport) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED);
    }

    checkPlayerInLobby(lobby,playerFinalReport.username);

    const gameState = await repositoryLobby.getGameState(lobbyID);
    gameState.nPlayersEndTurn++;
    gameState.finalReports.push(playerFinalReport);
    
    await repositoryLobby.updateGameState(lobbyID, gameState);
    checkAllPlayersEndGame(lobby);
};

const checkAllPlayersEndGame = async (lobby: Lobby) => {
    if (lobby.gameState.nPlayersEndTurn === lobby.players.length) {
        await repositoryLobby.changeLobbyStatus(lobby.id, LOBBY_STATUS.GAME_OVER);
        const winnerResolution = gameLogicService.winnerResolution(lobby.gameState.finalReports);
        const io = getIoInstance();
        io.to(lobby.id).emit(SOCKET_EVENTS.GAME_END, winnerResolution);
    }
}

const getArchivedLobby = async (lobbyID: string) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.GAME_OVER) {
        throw new ForbiddenError(ERRORS.GAME_NOT_OVER);
    }
    return {
        finalReports: lobby.gameState.finalReports,
        winnerResolution: gameLogicService.winnerResolution(lobby.gameState.finalReports)
    };
};

export const gameService = {
    startGame,
    playerFinishTurn,
    checkAllPlayersFinishTurn,
    playerEndGame,
    checkAllPlayersEndGame,
    getArchivedLobby
};
