import { repositoryLobby } from '../repository/lobby-repository';
import { ERRORS, LOBBY_STATUS } from '../constants/constants';
import { Lobby, LobbyResponse } from '../interface/lobby-interface';
import { emitLobbyUpdate, getIoInstance, isSocketConnected, SOCKET_EVENTS } from '../socket';
import { MAX_CAPACITY_LOBBY } from '../Config/config';
import { repositoryPlayer } from '../repository/player-connection-repository';
import { SocketError } from '../Errors/SocketError';
import { ForbiddenError } from '../Errors/ForbiddenError';
import { NotFoundError } from '../Errors/NotFoundError';
import { gameService } from './game-service';
import { mapper } from '../mapper';


const createLobby = async (username: string): Promise<LobbyResponse> => {
    const player = await repositoryPlayer.getPlayerByUsername(username);
    
    if (!isSocketConnected(player) || !player.socketID) {
        throw new SocketError();
    }

    const lobby = await repositoryLobby.createLobby(player);
    await repositoryPlayer.joinLobby(username, lobby.id);

    const io = getIoInstance();
    const playerSocket = io.sockets.sockets.get(player.socketID);
    if (playerSocket) {
        playerSocket.join(lobby.id);
    }

    return mapper.mapLobbyToLobbyResponse(lobby);
};

const joinLobby = async (lobbyID: string, username: string): Promise<LobbyResponse> => {
    const player = await repositoryPlayer.getPlayerByUsername(username);

    if (!isSocketConnected(player) || !player.socketID) {
        throw new SocketError();
    }

    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.players.length === MAX_CAPACITY_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_FULL);
    }

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_STARTED);
    }

    if (lobby.kickedPlayers.includes(player.username)) {
        throw new ForbiddenError(ERRORS.PLAYER_KICKED);
    }

    const newLobby =  await repositoryLobby.addPlayerToLobby(lobbyID, player);
    await repositoryPlayer.joinLobby(username, lobbyID);

    emitLobbyUpdate(newLobby);
    const io = getIoInstance();
    const playerSocket = io.sockets.sockets.get(player.socketID);
    if (playerSocket) {
        playerSocket.join(lobby.id);
    }

    return mapper.mapLobbyToLobbyResponse(newLobby);
};


const handlePlayerLeave = async(lobbyID: string, username: string): Promise<void> => {
    const lobby = await repositoryLobby.getLobbyNoError(lobbyID);
    if(!lobby){
        return;
    }

    const playerIndex = lobby.players.findIndex((player) => player.username === username);
    if (playerIndex === -1) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
    const playerToLeave = lobby.players[playerIndex];
    const io = getIoInstance();

    if(playerToLeave.socketID){
        const playerSocket = io.sockets.sockets.get(playerToLeave.socketID);
        if (playerSocket) {
            playerSocket.leave(lobby.id);
        }
    }

    
    switch(lobby.status){
        case LOBBY_STATUS.IN_LOBBY:
            const newLobby = await repositoryLobby.leaveLobby(lobbyID, playerToLeave);
            await repositoryPlayer.leaveLobby(username);
            if(newLobby){
                emitLobbyUpdate(newLobby);
            }
            break;
        case LOBBY_STATUS.IN_GAME:
            const newLobby1 = await repositoryLobby.leaveLobby(lobbyID, playerToLeave);
            if(newLobby1){
                gameService.checkAllPlayersFinishTurn(newLobby1);
            }
            break;
        case LOBBY_STATUS.GAME_OVER:
            const newLobby2 =await repositoryLobby.leaveLobby(lobbyID, playerToLeave);
            if(newLobby2){
                gameService.checkAllPlayersEndGame(newLobby2.id, newLobby2.gameState, newLobby2.players.length);
            }
            break;
        default:
            throw new ForbiddenError(ERRORS.GAME_OVER);
    }
    
}

const kickPlayerFromLobby = async (lobbyID: string, username: string, leaderUsername: string) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.leader !== leaderUsername) {
        throw new ForbiddenError(ERRORS.NOT_LOBBY_LEADER);
    }

    const playerIndex = lobby.players.findIndex((player) => player.username === username);
    if (playerIndex === -1) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }

    const newLobby = await repositoryLobby.removePlayerFromLobby(lobbyID, lobby.players[playerIndex]);
    await repositoryPlayer.leaveLobby(username);

    if(newLobby){        
        emitLobbyUpdate(newLobby);
    }
};

const invitePlayer = async (lobbyID: string, usernameToInvite: string, inviterUsername: string) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.players.length === MAX_CAPACITY_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_FULL);
    }

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_STARTED);
    }

    const player = await repositoryPlayer.getPlayerByUsername(usernameToInvite);

    if (player.lobbyID) {
        throw new ForbiddenError(ERRORS.PLAYER_ALREADY_IN_LOBBY);
    }

    if (!isSocketConnected(player) || !player.socketID) {
        throw new SocketError();
    }

    await repositoryLobby.removePlayerFromKicked(lobbyID, player);

    const io = getIoInstance();
    io.to(player.socketID).emit(SOCKET_EVENTS.LOBBY_INVITE, { lobbyID, inviterUsername });
};


export const lobbyService = {
    createLobby,
    joinLobby,
    invitePlayer,
    kickPlayerFromLobby,
    handlePlayerLeave
};
