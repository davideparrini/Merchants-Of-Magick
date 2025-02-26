import { BASE_URL_SERVER } from "../Config/constants";
import { handleResponse } from "./api-utils";

// Cambia con l'URL corretto del tuo backend
const URL_LOBBY = BASE_URL_SERVER + '/lobby';

// Crea una nuova lobby
async function createLobby(username) {
    const response = await fetch(`${URL_LOBBY}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    });
    return handleResponse(response);
}

// Unisciti a una lobby esistente
async function joinLobby(lobbyID, username) {
    const response = await fetch(`${URL_LOBBY}/${lobbyID}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    });
    return handleResponse(response);
}

// Esci da una lobby
async function leaveLobby(lobbyID, username) {
    const response = await fetch(`${URL_LOBBY}/${lobbyID}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    });
    return handleResponse(response);
}

// Kicka un giocatore dalla lobby
async function kickPlayer(lobbyID, username, leaderUsername) {
    const response = await fetch(`${URL_LOBBY}/${lobbyID}/kick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, leaderUsername })
    });
    return handleResponse(response);
}

// Invita un giocatore nella lobby
async function invitePlayer(lobbyID, usernameToInvite, inviterUsername) {
    const response = await fetch(`${URL_LOBBY}/${lobbyID}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameToInvite, inviterUsername })
    });
    return handleResponse(response);
}

export const apiLobby = {
    createLobby,
    leaveLobby,
    joinLobby,
    kickPlayer,
    invitePlayer
};
