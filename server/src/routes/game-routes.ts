import express, { Request, Response, NextFunction } from 'express';
import { gameService } from '../service/game-service';

const gameRouter = express.Router();

/**
 * Il giocatore termina il turno
 */
gameRouter.post("/:lobbyID/finish-turn",async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lobbyID } = req.params;
        const { username, playerGameState } = req.body;

        gameService.playerFinishTurn(lobbyID, username, playerGameState, (status: string) => {
            if (status === "ERROR") {
                return res.status(400).json({ error: "Invalid game state" });
            }
            return res.json({ message: "Turn finished successfully" });
        });

    } catch (error) {
        next(error);
    }
});

/**
 * Il giocatore termina la partita
 */
gameRouter.post("/:lobbyID/end-game", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lobbyID } = req.params;
        const { username, playerFinalReport } = req.body;

        gameService.playerEndGame(lobbyID, username, playerFinalReport, (status: string) => {
            if (status === "ERROR") {
                return res.status(400).json({ error: "Invalid game state" });
            }
            return res.json({ message: "Game ended successfully" });
        });

    } catch (error) {
        next(error);
    }
});

export default gameRouter;
