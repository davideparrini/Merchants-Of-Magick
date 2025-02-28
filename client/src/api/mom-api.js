import { BASE_URL_SERVER } from "../Config/constants";
import { getHeaders, handleResponse } from "./api-utils";

// Cambia con l'URL corretto del tuo backend
const URL_GAME = BASE_URL_SERVER + '/api/private';



// Invia il nome utente con autenticazione
async function sendUsername(username, socketID) {
    try{
        const headers = await getHeaders();
        const response = await fetch(`${URL_GAME}/username`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username, socketID })
        });
        return handleResponse(response);
    } catch(error){
        console.error(error);
        return {statusCode : 500};
    }
}


export const apiMOM = {
    sendUsername
}
