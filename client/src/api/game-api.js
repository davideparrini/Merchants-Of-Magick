import { BASE_URL_SERVER } from "../Config/constants";
import { handleResponse } from "./api-utils";
import { getHeaders } from "./api-utils";

const URL_GAME = BASE_URL_SERVER + "/api/private/game";

// Avvia la partita
async function startGame(lobbyID, config) {
    try{
        const headers = await getHeaders();
        const response = await fetch(`${URL_GAME}/${lobbyID}/start`, {
            method: "POST",
            headers,
            body: JSON.stringify({ config })
        });
        return handleResponse(response);
    }
    catch(error){
        console.error(error);
        return {statusCode : 500};
    }
    
}

// Il giocatore termina il turno
async function finishTurn(lobbyID, playerGameState, backupPlayer) {
    try{
        const headers = await getHeaders();
        const response = await fetch(`${URL_GAME}/${lobbyID}/finish-turn`, {
            method: "POST",
            headers,
            body: JSON.stringify({ playerGameState: playerGameState, backupPlayer: backupPlayer })
        });
        return handleResponse(response);
    }
    catch(error){
        console.error(error);
        return {statusCode : 500};
    }
    
}

// Il giocatore termina il turno
async function reconnectGame(lobbyID, username) {
    try{
        const headers = await getHeaders();
        const response = await fetch(`${URL_GAME}/${lobbyID}/reconnect`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username })
        });
        return handleResponse(response);
    }
    catch(error){
        console.error(error);
        return {statusCode : 500};
    }
    
}
// Il giocatore termina la partita
async function endGame(lobbyID, playerFinalReport) {
    try{
        const headers = await getHeaders();
        const response = await fetch(`${URL_GAME}/${lobbyID}/end-game`, {
            method: "POST",
            headers,
            body: JSON.stringify({ playerFinalReport })
        });
        return handleResponse(response);
    }
    catch(error){
        console.error(error);
        return {statusCode : 500};
    }
    
}

// Recupera i dati di una partita archiviata
async function getArchivedGame(lobbyID) {
    try{
        const headers = await getHeaders();
        const response = await fetch(`${URL_GAME}/${lobbyID}/archived-game`, {
            method: "GET",
            headers
        });
        return handleResponse(response);
    }
    catch(error){
        console.error(error);
        return {statusCode : 500};
    }
    
}

export const apiGame = {
    startGame,
    finishTurn,
    endGame,
    getArchivedGame,
    reconnectGame
};
