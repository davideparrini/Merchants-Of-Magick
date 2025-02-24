import express, { Request, Response, NextFunction } from 'express';
import { LOBBY_STATUS, ERRORS, SocketEvents } from '../constants/constants';
import { repositoryLobby } from '../repository/lobby-repository';
import { lobbyService  } from '../service/lobby-service';
import { GameState, Lobby } from '../interface/lobby-interface'
import { getIoInstance, isSocketConnected } from '../socket-utility';

const router = express.Router();
const io = getIoInstance();


/**
 * Crea una nuova lobby
 */
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username, socketId } = req.body;

    if (!username || !socketId) {
        return res.status(400).json({ error: "Username is required" });
    }
    
    if(!isSocketConnected(socketId)){
        return res.status(500).json({ error: "Socket not connected for socketID" });
    }
    
    const lobbyID = await repositoryLobby.createLobby(username, socketId);

    res.json(lobbyID);
});

/**
 * Unisciti a una lobby esistente
 */
router.post("/:lobbyID/join", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username, socketId} = req.body;
    const { lobbyID } = req.params; // Impostiamo un valore di default per la dimensione

    try {
        const result = await lobbyService.joinLobby(lobbyID, username, socketId);

        if (result.error) {
            return res.status(403).json({ error: result.error });
        }

        io.to(lobbyID).emit(SocketEvents.LOBBY_PLAYER_JOINED, username);
        io.sockets.sockets.get(socketId)?.join(lobbyID);

        res.json({ message: "Joined lobby", lobby: result.lobby });

    } catch (err) {
        console.error('Error joining lobby:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * Avvia la partita
 */
router.post("/:lobbyID/start", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { lobbyID } = req.params;
        const { config } = req.body;

        const gameInit = await lobbyService.startLobbyGame(lobbyID, config);
        
        io.to(lobbyID).emit(SocketEvents.GAME_START, gameInit);

        return res.json(gameInit);
    } catch (error) {
        next(error);  // Passa l'errore al middleware di gestione degli errori
    }

});

/**
 * Kicka un giocatore dalla lobby
 */
router.post("/:lobbyID/kick", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, leaderUsername } = req.body;
        const { lobbyID } = req.params;

        await lobbyService.kickPlayerFromLobby(lobbyID, username, leaderUsername);

        // Restituisci la risposta con la lobby aggiornata
        res.json({ message: `Player ${username} has been kicked` });
    
    } catch (error) {   
        next(error); // Passa l'errore al middleware di gestione degli errori
    }
});


export default router;
