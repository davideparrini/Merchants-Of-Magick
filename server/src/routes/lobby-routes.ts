import express, { Request, Response, NextFunction } from 'express';
import { LOBBY_STATUS, ERRORS } from '../constants/constants';
import { repositoryLobby } from '../repository/lobby-repository';
import { lobbyService  } from '../service/lobby-service';
import { GameState, Lobby } from '../interface/lobby-interface'
import { getIoInstance } from '../socket';

const router = express.Router();
const io = getIoInstance();


/**
 * Crea una nuova lobby
 */
router.post("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    const lobbyID = await repositoryLobby.createLobby(username);

    res.json(lobbyID);
});

/**
 * Unisciti a una lobby esistente
 */
router.post("/:lobbyID/join", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { username } = req.body;
    const { lobbyID } = req.params; // Impostiamo un valore di default per la dimensione

    try {
        const result = await lobbyService.joinLobby(lobbyID, username);

        if (result.error) {
            return res.status(403).json({ error: result.error });
        }

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

        return res.json(gameInit);
    } catch (error) {
        next(error);  // Passa l'errore al middleware di gestione degli errori
    }

});

/**
 * Kicka un giocatore dalla lobby
 */
router.post("/:lobbyID/kick", (req: Request, res: Response, next: NextFunction): any => {
    const { username, leaderUsername } = req.body;
    const { lobbyID } = req.params;

    const lobby = mapLobbyID_Lobby.get(lobbyID) as Lobby;
    if (!lobby) {
        return res.status(404).json({ error: ERRORS.LOBBY_NOT_FOUND });
    }

    if (lobby.leaderLobby !== leaderUsername) {
        return res.status(403).json({ error: ERRORS.NOT_LOBBY_LEADER });
    }

    const playerIndex = lobby.players.indexOf(username);
    if (playerIndex === -1) {
        return res.status(404).json({ error: ERRORS.PLAYER_NOT_FOUND });
    }

    lobby.players.splice(playerIndex, 1);

    // Se il leader si kicka da solo, il nuovo leader diventa il primo giocatore nella lista
    if (username === lobby.leaderLobby && lobby.players.length > 0) {
        lobby.leaderLobby = lobby.players[0];
    }

    // Se non ci sono più giocatori, elimina la lobby
    if (lobby.players.length === 0) {
        mapLobbyID_Lobby.delete(lobbyID);
    }

    res.json({ message: `Player ${username} has been kicked`, lobby });
});

export default router;
