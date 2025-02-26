import { BASE_URL_SERVER } from "../Config/constants";
import { handleResponse } from "./api-utils";

// Cambia con l'URL corretto del tuo backend
const URL_GAME = BASE_URL_SERVER + '/game';



// Avvia la partita
async function startGame(lobbyID, config) {
    const response = await fetch(`${URL_GAME}/${lobbyID}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config })
    });
    return handleResponse(response);
}

// Il giocatore termina il turno
async function finishTurn(lobbyID, playerGameState) {
    const response = await fetch(`${URL_GAME}/${lobbyID}/finish-turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerGameState })
    });
    return handleResponse(response);
}

// Il giocatore termina la partita
async function endGame(lobbyID, playerFinalReport) {
    const response = await fetch(`${URL_GAME}/${lobbyID}/end-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerFinalReport })
    });
    return handleResponse(response);
}

// Recupera i dati di una partita archiviata
async function getArchivedGame(lobbyID) {
    const response = await fetch(`${URL_GAME}/${lobbyID}/archived-game`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    return handleResponse(response);
}

export const apiGame = {
    startGame,
    finishTurn,
    endGame,
    getArchivedGame
};