import { repositoryLobby } from '../repository/lobby-repository';
import { ERRORS, LOBBY_STATUS, SocketEvents } from '../constants/constants';
import { Lobby } from '../interface/lobby-interface';
import { getIoInstance, isSocketConnected } from '../socket';
import { MAX_CAPACITY_LOBBY } from '../Config/config';
import { repositoryPlayer } from '../repository/player-connection-repository';
import { SocketError } from '../Errors/SocketError';
import { ForbiddenError } from '../Errors/ForbiddenError';
import { NotFoundError } from '../Errors/NotFoundError';



const createLobby = async (username: string): Promise<Lobby> => {
    const player = await repositoryPlayer.getPlayerByUsername(username);
    
    if (!isSocketConnected(player) || !player.socketID) {
        throw new SocketError();
    }

    const lobby = await repositoryLobby.createLobby(player);
    await repositoryPlayer.joinLobby(username, lobby.id);

    const io = getIoInstance();
    io.sockets.sockets.get(player.socketID)?.join(lobby.id);

    return lobby;
};

const joinLobby = async (lobbyID: string, username: string): Promise<Lobby> => {
    const player = await repositoryPlayer.getPlayerByUsername(username);

    if (!isSocketConnected(player) || !player.socketID) {
        throw new SocketError();
    }

    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.players.length === MAX_CAPACITY_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_FULL);
    }

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_NOT_IN_LOBBY);
    }

    if (lobby.kickedPlayers.includes(player.username)) {
        throw new ForbiddenError(ERRORS.PLAYER_KICKED);
    }

    const newLobby =  await repositoryLobby.addPlayerToLobby(lobbyID, player);
    await repositoryPlayer.joinLobby(username, lobbyID);

    const io = getIoInstance();
    io.to(lobbyID).emit(SocketEvents.LOBBY_UPDATE, newLobby);
    io.sockets.sockets.get(player.socketID)?.join(lobbyID);

    return lobby;
};

/**
 * Permette a un giocatore di uscire volontariamente dalla lobby
 */
const leaveLobby = async (lobbyID: string, username: string): Promise<void> => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    const playerIndex = lobby.players.findIndex((player) => player.username === username);
    if (playerIndex === -1) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }

    const newLobby = await repositoryLobby.leaveLobby(lobbyID, lobby.players[playerIndex]);
    await repositoryPlayer.leaveLobby(username);

    const io = getIoInstance();
    io.to(lobbyID).emit(SocketEvents.LOBBY_UPDATE, newLobby);
};

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

    const io = getIoInstance();
    io.to(lobbyID).emit(SocketEvents.LOBBY_UPDATE, newLobby);
};

const invitePlayer = async (lobbyID: string, usernameToInvite: string, inviterUsername: string) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.players.length === MAX_CAPACITY_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_FULL);
    }

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.GAME_NOT_IN_LOBBY);
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
    io.to(player.socketID).emit(SocketEvents.LOBBY_INVITE, { lobbyID, inviterUsername });
};


export const lobbyService = {
    createLobby,
    joinLobby,
    leaveLobby, 
    invitePlayer,
    kickPlayerFromLobby
};
