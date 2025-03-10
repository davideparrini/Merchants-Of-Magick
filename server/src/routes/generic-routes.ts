import express, { Request, Response, NextFunction } from 'express';
import { genericService } from '../service/generic-service';
import { getIoInstance } from '../socket';

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

genericRouter.get("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        getIoInstance().emit("serverMessage", "Messaggio a tutti, inclusi i mittenti!")
        res.json({ message: `Username: register to MOM` });
    } catch (error) {
        next(error);
    }
});

export default genericRouter;
