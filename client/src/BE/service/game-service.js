import { ERRORS, LOBBY_STATUS } from "../constants/constants";
import { ForbiddenError } from "../Errors/ForbiddenError";
import { NotFoundError } from "../Errors/NotFoundError";
import { mapper } from "../mapper";
import { repositoryArchivedGame } from "../repository/archived-game-repository";
import { repositoryLobby } from "../repository/lobby-repository";
import { repositoryUsers } from "../repository/users-repository.js";
import { gameLogicService } from "./game-logic-service";

// SOLUZIONE NON IDONEA SE VENGONO USATE PIU ISTANZE DEL SERVER (SOLUZIONE ALTERNATIVA E MIGLIORE CON UNA MEMORIA CENTRALIZZATA TIPO REDIS)





const checkPlayerInLobby = (lobby, playerUsername) => {
    if (!lobby.players.some(player => player === playerUsername)) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
};

const startGame = async (lobbyID, config) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_STARTED);
    }
    
    const gameInit = await gameLogicService.gameInit(lobby.players, config, lobbyID);
    
    const backupGameState = {
        lastGameState: {
            quest1: false,  
            quest2: false,
            cards: mapper.mapPlayersGameStartToSignedDecks(gameInit.players),
            reports: [],
            finalReports: [],
            decks: lobby.gameState.decks,
            orderPlayers: gameInit.players
        },
        lastTurnPlayed: 0,
        lastDiceRolls: gameInit.dices
    };
    
    await repositoryLobby.updateLobby(lobbyID, { status: LOBBY_STATUS.IN_GAME, backupGameState });
    
    return gameInit;
};

const playerFinishTurn = async (lobbyID, playerGameState, backupPlayer, setGameOnNewTurn, setGameUpdated) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED);
    }
    checkPlayerInLobby(lobby, playerGameState.username);

    const gameState = await repositoryLobby.getGameState(lobbyID);
    gameState.quest1 ||= playerGameState.report.quest1;
    gameState.quest2 ||= playerGameState.report.quest2;
    gameState.nPlayerFinishTurn++;
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
    const lobbyUpdated = await repositoryLobby.updateBackupGameState(lobbyID, backupPlayer);
    checkAllPlayersFinishTurn(lobbyUpdated, setGameOnNewTurn, setGameUpdated, lobbyUpdated.leader);
};

const reconnect = async (lobbyID, username, userID) => {
    
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED);
    }
    if(!lobby.disconnectedPlayers.includes(username)){
        throw ForbiddenError(ERRORS.PLAYER_NOT_JOINED_LOBBY);
    }

    let playerBackup;
    const backupGameState = lobby.backupGameState;

    if (lobby.backupGameState.lastTurnPlayed !== 0) {
        const indexPlayerBackup = lobby.backupPlayers.findIndex(b => b.username === username);
        if (indexPlayerBackup === -1) {
            throw new ForbiddenError(ERRORS.PLAYER_NOT_JOINED_LOBBY);
        }
        playerBackup = lobby.backupPlayers[indexPlayerBackup].backup;
    } else {
        playerBackup = {
            nTurn: 0,
            currentGold: 0,
            nPotion: backupGameState.initConfig.nPotion,
            shop: [],
            skillsTree: new Map(),
            skillsGained: [],
            freeUpgrade: 0,
            adventurerQuestDone: false,
            nAttributeGained_QuestCrafting: 0,
            nAttributeGained_QuestMagicResearch: 0,
            quest1Done: false,
            quest2Done: false,
            extraDiceUsed: {
                ed1: false,
                ed2: false,
                ed3: false,
                ed4: false,
                ed5: false,
                ed6: false
            }
        };
    }

    if (playerBackup.nTurn !== backupGameState.lastTurnPlayed) {
        throw new ForbiddenError(ERRORS.GAME_CONTINUED);
    }
    
    await repositoryLobby.addPlayerToLobby(lobbyID, username);
    await repositoryUsers.joinLobby(userID, lobbyID);


    playerBackup.nTurn++;
    const res = {
        backupPlayer: playerBackup,
        backupGameState: backupGameState,
        gameInitState: lobby.gameInitState
    };
    
    return res;
};

const checkAllPlayersFinishTurn = async (lobby, setGameOnNewTurn, setGameUpdated, lobbyLeader) => {
    const gameState = lobby.gameState;
    const playersName = lobby.players.map(p => p.username);

    if (gameState.nPlayerFinishTurn >= playersName.length) {
        gameState.cards = gameLogicService.updateCardsTurn(gameState.cards, playersName, gameState.decks, lobby.gameState.orderPlayers);
        const rolledDices = gameLogicService.rollDices();
        const response = {
            quest1: gameState.quest1,
            quest2: gameState.quest2,
            dices: rolledDices,
            cards: gameState.cards,
            reports: gameState.reports
        };
        
        setGameOnNewTurn(response);
        setGameUpdated(true);
        
        if(lobbyLeader){
            const backupGameState = lobby.backupGameState;
        
            Object.assign(gameState, { nPlayerFinishTurn:0 , cards: [], reports: [] });
            Object.assign(backupGameState, { 
                lastGameState: gameState, 
                lastTurnPlayed: backupGameState.lastTurnPlayed + 1,
                lastDiceRolls: rolledDices
            });
            await repositoryLobby.updateLobby(lobby.id, { gameState, backupGameState });
        }
        
    }
};

const playerEndGame = async (lobbyID, playerFinalReport, username, setGameEndState, setGameEnd) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED);
    }

    checkPlayerInLobby(lobby, playerFinalReport.username);

    const gameState = await repositoryLobby.getGameState(lobbyID);
    gameState.finalReports.push(playerFinalReport);
    gameState.nPlayerFinishTurn++;
    await repositoryLobby.updateGameState(lobbyID, gameState);
    
    checkAllPlayersEndGame(lobbyID, gameState, lobby.players.length, lobby.leader === username, setGameEndState, setGameEnd);
};

const checkAllPlayersEndGame = async (lobbyID, gameState, nPlayers, lobbyLeader, setGameEndState, setGameEnd) => {
    if (gameState.nPlayerFinishTurn >= nPlayers) {
        const winnerResolution = gameLogicService.winnerResolution(gameState.finalReports);
        setGameEndState(winnerResolution);
        setGameEnd(true);
        if(lobbyLeader){
            await repositoryArchivedGame.insertArchivedGame(lobbyID, winnerResolution);
            repositoryLobby.deleteLobby(lobbyID);
        }
    }
};

const getArchivedLobby = async (lobbyID) => {
    const archivedGame = await repositoryArchivedGame.getArchivedGame(lobbyID);
    return archivedGame.finalReports;
};

export const gameService = {
    startGame,
    playerFinishTurn,
    checkAllPlayersFinishTurn,
    playerEndGame,
    checkAllPlayersEndGame,
    getArchivedLobby,
    reconnect
};
