import { ERRORS, LOBBY_STATUS, SocketEvents } from "../constants/constants";
import { SignedFinalReport, PlayerGame, GameState } from "../interface/game-interface";

import { repositoryLobby } from "../repository/lobby-repository";
import { getIoInstance } from "../socket";
import { gameLogicService } from "./game-logic-service";

const io = getIoInstance();

const startGame = async (lobbyID: string, config: any) :Promise<any>=> {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_ALREADY_STARTED);
    }

    await repositoryLobby.changeLobbyStatus(lobbyID, LOBBY_STATUS.IN_GAME);

    const gameInit = gameLogicService.gameInit(lobby.players.map((p) => p.username), config);

    io.to(lobbyID).emit(SocketEvents.GAME_START, gameInit);

    return gameInit;
};

const playerFinishTurn = async (lobbyID: string, playerGameState: PlayerGame) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if ( lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED)
    }

    const gameState = await repositoryLobby.getGameState(lobbyID);

    gameState.nPlayersEndTurn++;
    if (playerGameState.quest1) gameState.quest1 = true;
    if (playerGameState.quest2) gameState.quest2 = true;

    gameState.cards.push({
        username: playerGameState.username,
        card1: playerGameState.cards.card1,
        card2: playerGameState.cards.card2,
        card3: playerGameState.cards.card3
    });

    gameState.reports.push({
        username: playerGameState.username,
        report: playerGameState.report
    });

    await repositoryLobby.updateGameState(lobbyID, gameState);

    if (gameState.nPlayersEndTurn === lobby.players.length) {
        const updatedCards = gameLogicService.updateCardsTurn(gameState.cards, lobby.players.map(p=>p.username));
        const response = {
            quest1: gameState.quest1,
            quest2: gameState.quest2,
            dices: gameLogicService.rollDices(),
            cards: updatedCards,
            report: gameState.reports
        };

        io.to(lobbyID).emit(SocketEvents.GAME_CHANGE_TURN, response);
        gameState.cards = [];
        gameState.reports = [];
        gameState.nPlayersEndTurn = 0;
        await repositoryLobby.updateGameState(lobbyID, gameState);
    }

};



const playerEndGame = async (lobbyID: string, playerFinalReport: SignedFinalReport) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if ( lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED)
    }

    const gameState = await repositoryLobby.getGameState(lobbyID);

    gameState.nPlayersEndTurn++;
    gameState.finalReports.push(playerFinalReport);

    await repositoryLobby.updateGameState(lobbyID, gameState);

    if (gameState.nPlayersEndTurn === lobby.players.length) {
        lobby.status = LOBBY_STATUS.GAME_OVER;
        await repositoryLobby.changeLobbyStatus(lobbyID, LOBBY_STATUS.GAME_OVER);
        const winnerResolution = gameLogicService.winnerResolution(gameState.finalReports);
        io.to(lobbyID).emit(SocketEvents.GAME_END, winnerResolution);
    }
};


const getArchivedLobby = async (lobbyID: string) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if ( lobby.status !== LOBBY_STATUS.GAME_OVER) {
        throw new ForbiddenError(ERRORS.GAME_NOT_OVER);
    }
    const winnerResolution = gameLogicService.winnerResolution(lobby.gameState.finalReports);
    return {finalReports: lobby.gameState.finalReports, winnerResolution: winnerResolution}
}


export const gameService = {
    startGame,
    playerFinishTurn,
    playerEndGame,
    getArchivedLobby
};
