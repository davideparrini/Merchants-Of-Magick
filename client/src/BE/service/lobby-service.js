import { repositoryLobby } from '../repository/lobby-repository';
import { ERRORS, LOBBY_STATUS } from '../constants/constants';
import { ForbiddenError } from '../Errors/ForbiddenError';
import { NotFoundError } from '../Errors/NotFoundError';
import { repositoryUsers } from '../repository/users-repository.js';

const MAX_CAPACITY_LOBBY = 8;

const createLobby = async (username, userID) => {
    const lobby = await repositoryLobby.createLobby(username);
    await repositoryUsers.joinLobby(userID, lobby.id);

    return lobby;
};

const joinLobby = async (lobbyID, username, userID) => {
    
    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.players.length === MAX_CAPACITY_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_FULL);
    }

    if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
        throw new ForbiddenError(ERRORS.LOBBY_STARTED);
    }

    if (lobby.kickedPlayers.includes(username)) {
        throw new ForbiddenError(ERRORS.PLAYER_KICKED);
    }

    const newLobby = await repositoryLobby.addPlayerToLobby(lobbyID, username);
    await repositoryUsers.joinLobby(userID, lobbyID);

    return newLobby;
};

const handlePlayerLeave = async (lobbyID, username, userID) => {
    const lobby = await repositoryLobby.getLobbyNoError(lobbyID);
    if (!lobby) {
        return;
    }

    const playerIndex = lobby.players.findIndex(player => player === username);
    if (playerIndex === -1) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
    const playerToLeave = lobby.players[playerIndex];

    switch (lobby.status) {
        case LOBBY_STATUS.IN_LOBBY:
            await repositoryLobby.leaveLobby(lobbyID, playerToLeave);
            await repositoryUsers.leaveLobby(username, userID);
            break;
        case LOBBY_STATUS.IN_GAME:
        case LOBBY_STATUS.GAME_OVER:
            await repositoryLobby.disconnectPlayerFromLobby(lobbyID, playerToLeave);
            break;
        default:
            throw new ForbiddenError(ERRORS.GAME_OVER);
    }
};

const kickPlayerFromLobby = async (lobbyID, username, leaderUsername) => {
    const lobby = await repositoryLobby.getLobbyById(lobbyID);

    if (lobby.leader !== leaderUsername) {
        throw new ForbiddenError(ERRORS.NOT_LOBBY_LEADER);
    }

    const playerIndex = lobby.players.findIndex(player => player === username);
    if (playerIndex === -1) {
        throw new NotFoundError(ERRORS.PLAYER_NOT_FOUND);
    }
    const user = await repositoryUsers.getUserDataFromUsername(username);
    await repositoryLobby.removePlayerFromLobby(lobbyID, lobby.players[playerIndex]);
    await repositoryUsers.leaveLobby(user.id);

};

// const invitePlayer = async (lobbyID, usernameToInvite, inviterUsername) => {
//     const lobby = await repositoryLobby.getLobbyById(lobbyID);

//     if (lobby.players.length === MAX_CAPACITY_LOBBY) {
//         throw new ForbiddenError(ERRORS.LOBBY_FULL);
//     }

//     if (lobby.status !== LOBBY_STATUS.IN_LOBBY) {
//         throw new ForbiddenError(ERRORS.LOBBY_STARTED);
//     }

//     await repositoryLobby.removePlayerFromKicked(lobbyID, usernameToInvite);
//     const userToInvite = await repositoryUsers.getUserDataFromUsername(usernameToInvite);
//     if(userToInvite.online){
//         await repositoryUsers.addInvite(userToInvite.id, lobbyID, inviterUsername);
//         return true;
//     }
//     else{
//         return false;
//     }
// };




export const lobbyService = {
    createLobby,
    joinLobby,
    // invitePlayer,
    kickPlayerFromLobby,
    handlePlayerLeave
};


