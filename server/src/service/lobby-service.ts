

import { repositoryLobby } from '../repository/lobby-repository';
import { ERRORS, LOBBY_STATUS, SocketEvents } from '../constants/constants';
import { GameState, Lobby, PlayerConnection } from '../interface/lobby-interface';
import { gameService } from './game-service';
import { getIoInstance, isSocketConnected } from '../socket';
import { MAX_CAPACITY_LOBBY } from '../Config/config';
import { repositoryPlayer } from '../repository/player-connection-repository';



const io = getIoInstance();


const createLobby = async (username: string) : Promise<Lobby> => {
    
    const player = await repositoryPlayer.getPlayerByUsername(username);
    
        
    if(!isSocketConnected(player) || !player.socketID){
        throw new SocketError();
    }
    
    const lobby = await repositoryLobby.createLobby(player);
    
    await repositoryPlayer.joinLobby(username,lobby.id);
    
    io.sockets.sockets.get(player.socketID)?.join(lobby.id);
    
    return lobby;
}



const joinLobby = async (lobbyID: string, username: string) : Promise<Lobby> => {

    const player = await repositoryPlayer.getPlayerByUsername(username);

    if(!isSocketConnected(player) || !player.socketID){
        throw new SocketError();
    }
    
    const lobby = await repositoryLobby.getLobbyById(lobbyID);


    if (lobby.players.length === MAX_CAPACITY_LOBBY ) {
        throw new ForbiddenError(ERRORS.LOBBY_FULL);
    }

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_ALREADY_STARTED);
    }

    if(lobby.kickedPlayers.includes(player.username)){
        throw new ForbiddenError(ERRORS.PLAYER_KICKED);
    }
    
    await repositoryLobby.addPlayerToLobby(lobbyID, player);

    await repositoryPlayer.joinLobby(username,lobbyID);

    io.to(lobbyID).emit(SocketEvents.LOBBY_PLAYER_JOINED, username);

    io.sockets.sockets.get(player.socketID)?.join(lobbyID);
    

    return lobby;
};



export const kickPlayerFromLobby = async (lobbyID: string, username: string, leaderUsername: string) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.leader !== leaderUsername) {
        throw new ForbiddenError(ERRORS.NOT_LOBBY_LEADER);
    }

    const playerIndex = lobby.players.findIndex((player) => player.username === username);
    if (playerIndex === -1) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
    
    await repositoryLobby.removePlayerFromLobby(lobbyID, lobby.players[playerIndex]);
    await repositoryPlayer.leaveLobby(username);

    io.to(lobbyID).emit(SocketEvents.LOBBY_PLAYER_LEFT, username);

};


const invitePlayer = async (lobbyID: string, usernameToInvite: string, inviterUsername: string) => {

    const lobby = await repositoryLobby.getLobbyById(lobbyID);


    if (lobby.players.length === MAX_CAPACITY_LOBBY ) {
        throw new ForbiddenError(ERRORS.LOBBY_FULL);
    }

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_ALREADY_STARTED);
    }
     
    const player = await repositoryPlayer.getPlayerByUsername(usernameToInvite);
    
    if(player.lobbyID){
        throw new ForbiddenError(ERRORS.PLAYER_ALREADY_IN_LOBBY);
    }

    if(!isSocketConnected(player) || !player.socketID){
        throw new SocketError();
    }
    
    await repositoryLobby.removePlayerFromKicked(lobbyID, player)

    io.to(player.socketID).emit(SocketEvents.LOBBY_INVITE,{lobbyID, inviterUsername});
    
};

const startLobbyGame = async (lobbyID: string, config: any) => {

    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_ALREADY_STARTED);
    }
    
    const gameState: GameState = {
        quest1: false,
        quest2: false,
        nPlayersEndTurn: 0,
        cards: [],
        reports: []
    };
    
    // Salva lo stato nel DB
    await repositoryLobby.changeLobbyStatus(lobbyID, LOBBY_STATUS.IN_GAME);
    await repositoryLobby.updateGameState(lobbyID, gameState);

    const gameInit = gameService.gameInit(lobby.players.map(p => p.username), config)

    io.to(lobbyID).emit(SocketEvents.GAME_START, gameInit);
    // Inizializza il gioco
    return gameInit;
};

export const lobbyService = {
    createLobby,
    joinLobby,
    invitePlayer,
    startLobbyGame,
    kickPlayerFromLobby
};
