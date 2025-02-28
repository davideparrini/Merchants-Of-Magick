import express, { Request, Response, NextFunction } from 'express';
import { genericService } from '../service/generic-service';

const genericRouter = express.Router();



genericRouter.post("/username", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, socketID } = req.body;

        await genericService.saveUsername(username, socketID);
        res.json({ message: `Username: ${username} register to MOM` });
    } catch (error) {
        next(error);
    }
});

export default genericRouter;
