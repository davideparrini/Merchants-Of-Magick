import express, { Request, Response, NextFunction } from 'express';
import { lobbyService } from '../service/lobby-service';

const lobbyRouter = express.Router();

/**
 * Crea una nuova lobby
 */
lobbyRouter.post("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const lobbyID = await lobbyService.createLobby(username);
        res.json(lobbyID);
    } catch (error) {
        next(error);
    }
});


/**
 * Unisciti a una lobby esistente
 */
lobbyRouter.post("/:lobbyID/join", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username } = req.body;
        const { lobbyID } = req.params;

        const lobby = await lobbyService.joinLobby(lobbyID, username);
        res.json(lobby);
    } catch (error) {
        next(error);
    }
});

/**
 * Esci da una lobby
 */
lobbyRouter.post("/:lobbyID/leave", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username } = req.body;
        const { lobbyID } = req.params;

        await lobbyService.handlePlayerLeave(lobbyID, username);
        res.json({ message: `Player ${username} has left the lobby` });
    } catch (error) {
        next(error);
    }
});

/**
 * Kicka un giocatore dalla lobby
 */
lobbyRouter.post("/:lobbyID/kick", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { username, leaderUsername } = req.body;
        const { lobbyID } = req.params;

        await lobbyService.kickPlayerFromLobby(lobbyID, username, leaderUsername);
        res.json({ message: `Player ${username} has been kicked` });
    } catch (error) {
        next(error);
    }
});

/**
 * Invita un giocatore a partecipare alla lobby
 */
lobbyRouter.post("/:lobbyID/invite", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { usernameToInvite, inviterUsername } = req.body;
        const { lobbyID } = req.params;

        await lobbyService.invitePlayer(lobbyID, usernameToInvite, inviterUsername);
        res.json({ message: `Invitation sent to ${usernameToInvite}` });
    } catch (error) {
        next(error);
    }
});



export default lobbyRouter;
