import { BASE_URL_SERVER } from "../Config/constants";
import { getHeaders, handleResponse } from "./api-utils";

const URL_LOBBY = BASE_URL_SERVER + "/api/private/lobby";

// Crea una nuova lobby
async function createLobby(username) {
    try {
        const headers = await getHeaders();
        const response = await fetch(`${URL_LOBBY}/`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username })
        });
        return handleResponse(response);
    } catch(error){
        console.error(error);
        return {statusCode : 500};
    }
}

// Unisciti a una lobby esistente
async function joinLobby(lobbyID, username) {
    try {
        const headers = await getHeaders();
        const response = await fetch(`${URL_LOBBY}/${lobbyID}/join`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username })
        });
        return handleResponse(response);
    } catch(error){
        console.error(error);
        return {statusCode : 500};
    }
}

// Riconnessione a una lobby
async function reconnectLobby(lobbyID, username) {
    try {
        const headers = await getHeaders();
        const response = await fetch(`${URL_LOBBY}/${lobbyID}/reconnect`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username })
        });
        return handleResponse(response);
    } catch(error){
        console.error(error);
        return {statusCode : 500};
    }
}

// Esci da una lobby
async function leaveLobby(lobbyID, username) {
    try {
        const headers = await getHeaders();
        const response = await fetch(`${URL_LOBBY}/${lobbyID}/leave`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username })
        });
        return handleResponse(response);
    } catch(error){
        console.error(error);
        return {statusCode : 500};
    }
}

// Kicka un giocatore dalla lobby
async function kickPlayer(lobbyID, username, leaderUsername) {
    try {
        const headers = await getHeaders();
        const response = await fetch(`${URL_LOBBY}/${lobbyID}/kick`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username, leaderUsername })
        });
        return handleResponse(response);
    } catch(error){
        console.error(error);
        return {statusCode : 500};
    }
}

// Invita un giocatore nella lobby
async function invitePlayer(lobbyID, usernameToInvite, inviterUsername) {
    try {
        const headers = await getHeaders();
        const response = await fetch(`${URL_LOBBY}/${lobbyID}/invite`, {
            method: "POST",
            headers,
            body: JSON.stringify({ usernameToInvite, inviterUsername })
        });
        return handleResponse(response);
    } catch(error){
        console.error(error);
        return {statusCode : 500};
    }
}

export const apiLobby = {
    createLobby,
    leaveLobby,
    reconnectLobby,
    joinLobby,
    kickPlayer,
    invitePlayer
};
