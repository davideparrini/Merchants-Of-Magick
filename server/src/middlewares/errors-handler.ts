import { Request, Response, NextFunction } from "express";
import { AppError } from "../Errors/AppError";


export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): any => {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
};
