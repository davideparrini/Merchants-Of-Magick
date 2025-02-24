import express, { Request, Response, NextFunction } from 'express';
import { gameService } from '../service/game-service';

const gameRouter = express.Router();


/**
 * Avvia la partita
 */
gameRouter.post("/:lobbyID/start", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { lobbyID } = req.params;
        const { config } = req.body;

        const gameInit = await gameService.startGame(lobbyID, config);
        res.json(gameInit);
    } catch (error) {
        next(error);
    }
});

/**
 * Il giocatore termina il turno
 */
gameRouter.post("/:lobbyID/finish-turn", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lobbyID } = req.params;
        const { playerGameState } = req.body;

        gameService.playerFinishTurn(lobbyID, playerGameState);

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
        const {  playerFinalReport } = req.body;

        gameService.playerEndGame(lobbyID,  playerFinalReport);

    } catch (error) {
        next(error);
    }
});

gameRouter.get("/:lobbyID/archived-game", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lobbyID } = req.params;

        const achivedGame = gameService.getArchivedLobby(lobbyID);
        res.json(achivedGame);
    } catch (error) {
        next(error);
    }
});

export default gameRouter;
