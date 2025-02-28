import { ERRORS, LOBBY_STATUS } from "../constants/constants";
import { ForbiddenError } from "../Errors/ForbiddenError";
import { NotFoundError } from "../Errors/NotFoundError";
import { SocketError } from "../Errors/SocketError";
import { SignedFinalReport, PlayerGame, GameState, BackupPlayer, GameInitConfig, GameStateBackup, BackupResponse } from "../interface/game-interface";
import { Lobby, SignedBackupPlayerGameState } from "../interface/lobby-interface";
import { repositoryLobby } from "../repository/lobby-repository";
import { repositoryPlayer } from "../repository/player-connection-repository";
import { getIoInstance, isSocketConnected, SOCKET_EVENTS } from "../socket";
import { gameLogicService } from "./game-logic-service";


//SOLUZIONE NON IDONEA SE VENGONO USATE PIU ISTANZE DEL SERVER (SOLUZIONE ALTERNATIVA E MIGLIORE CON UNA MEMORIA CENTRALIZZATA TIPO REDIS)
const gameCounter: Map<string, Set<string>> = new Map();

const incrementGameCount = (lobbyId: string, username: string) => {
    // Se la lobby non esiste, crea una nuova Set e aggiungi l'username
    if (!gameCounter.has(lobbyId)) {
        gameCounter.set(lobbyId, new Set([username]));
    } else {
        // Se la lobby esiste, recupera il Set e aggiungi l'username
        gameCounter.get(lobbyId)?.add(username);
    }
};

const resetGameCount = (lobbyId: string): void => {
    gameCounter.set(lobbyId, new Set());
};

const getGameCount = (lobbyId: string): number => {
    return gameCounter.get(lobbyId)?.size || 0;
};

const checkPlayerInLobby = (lobby: Lobby, playerUsername: string) => {
    if (!lobby.players.some(player => player.username === playerUsername)) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
};

const startGame = async (lobbyID: string, config: GameInitConfig): Promise<any> => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_STARTED);
    }
    
    // Inizializzazione del gioco
    const gameInit = await gameLogicService.gameInit(lobby.players.map(p => p.username), config, lobbyID);
    resetGameCount(lobby.id);
    
    // Creazione del backupGameState
    const backupGameState: GameStateBackup = {
        lastGameState: {
            quest1: false,  
            quest2: false,
            cards: [],
            reports: [],
            finalReports: [],
            decks: lobby.gameState.decks,
            orderPlayers: gameInit.players.map(p => p.username)
        },
        lastTurnPlayed: 0,
        lastDiceRolls: gameInit.dices,
        quest1: gameInit.quest1,
        quest2: gameInit.quest2,
        initConfig: config
    };
    
    await repositoryLobby.updateLobby(lobbyID, { status: LOBBY_STATUS.IN_GAME, backupGameState });
    
    // Emissione dell'evento di inizio gioco
    const io = getIoInstance();
    io.to(lobbyID).emit(SOCKET_EVENTS.GAME_START, gameInit);
    
    return gameInit;
};

const playerFinishTurn = async (lobbyID: string, playerGameState: PlayerGame, backupPlayer: SignedBackupPlayerGameState) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED);
    }
    checkPlayerInLobby(lobby,playerGameState.username);


    const gameState = await repositoryLobby.getGameState(lobbyID);
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
    await repositoryLobby.updateBackupGameState(lobbyID, backupPlayer);
    incrementGameCount(lobbyID, playerGameState.username);
    checkAllPlayersFinishTurn(lobby);
};

const reconnect = async (lobbyID: string, username: string) : Promise<BackupResponse> => {

    const player = await repositoryPlayer.getPlayerByUsername(username);

    if (!isSocketConnected(player) || !player.socketID) {
        throw new SocketError();
    }

    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED);
    }
    const indexPlayerBackup = lobby.backupPlayers.findIndex(b => b.username === username);
    if(indexPlayerBackup === -1){
        throw new ForbiddenError(ERRORS.PLAYER_NOT_JOINED_LOBBY);
    }

    const playerBackup = lobby.backupPlayers[indexPlayerBackup];
    const backupGameState = lobby.backupGameState;

    if(playerBackup.backup.nTurn !== backupGameState.lastTurnPlayed){
        throw new ForbiddenError(ERRORS.GAME_CONTINUED);
    }
    
    await repositoryLobby.addPlayerToLobby(lobbyID, player);
    await repositoryPlayer.joinLobby(username, lobbyID);
    
    const res : BackupResponse = {
        backupPlayer : playerBackup.backup,
        backupGameState : backupGameState
    }
    return res;
}

const checkAllPlayersFinishTurn = async (lobby: Lobby) => {

    const playersEndTurn = getGameCount(lobby.id);
    const gameState = lobby.gameState;
    const playersName = lobby.players.map(p=>p.username);

    if (playersEndTurn === playersName.length) {
        gameState.cards = gameLogicService.updateCardsTurn(gameState.cards, playersName, gameState.decks, lobby.gameState.orderPlayers);
        const rolledDices = gameLogicService.rollDices();
        const response = {
            quest1: gameState.quest1,
            quest2: gameState.quest2,
            dices: rolledDices,
            cards: gameState.cards,
            reports: gameState.reports
        };
        
        resetGameCount(lobby.id);
        const io = getIoInstance();
        io.to(lobby.id).emit(SOCKET_EVENTS.GAME_CHANGE_TURN, response);
        
        const backupGameState = lobby.backupGameState;
        
        Object.assign(gameState, { cards: [], reports: [] });
        Object.assign(backupGameState, { 
            lastGameState: gameState, 
            lastTurnPlayed: backupGameState.lastTurnPlayed+1,
            lastDiceRolls: rolledDices
        });
        await repositoryLobby.updateLobby(lobby.id, { gameState, backupGameState });
    }
}

const playerEndGame = async (lobbyID: string, playerFinalReport: SignedFinalReport) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);
    if (lobby.status !== LOBBY_STATUS.IN_GAME) {
        throw new ForbiddenError(ERRORS.GAME_NOT_STARTED);
    }

    checkPlayerInLobby(lobby,playerFinalReport.username);

    const gameState = await repositoryLobby.getGameState(lobbyID);
    gameState.finalReports.push(playerFinalReport);
    
    await repositoryLobby.updateGameState(lobbyID, gameState);
    incrementGameCount(lobbyID,playerFinalReport.username);
    checkAllPlayersEndGame(lobbyID, gameState, lobby.players.length);
};

const checkAllPlayersEndGame = async (lobbyID: string, gameState: GameState, nPlayers:number) => {
    if (getGameCount(lobbyID)  === nPlayers) {
        await repositoryLobby.changeLobbyStatus(lobbyID, LOBBY_STATUS.GAME_OVER);
        const winnerResolution = gameLogicService.winnerResolution(gameState.finalReports);
        gameCounter.delete(lobbyID);
        const io = getIoInstance();
        io.to(lobbyID).emit(SOCKET_EVENTS.GAME_END, winnerResolution);
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
    getArchivedLobby,
    reconnect
};

