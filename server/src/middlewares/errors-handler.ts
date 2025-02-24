import { Request, Response, NextFunction } from "express";



// Middleware per la gestione degli errori
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log dell'errore per debugging

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
};


