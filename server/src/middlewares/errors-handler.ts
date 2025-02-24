import { Request, Response, NextFunction } from "express";



// Middleware per la gestione degli errori
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) :any=> {
    
    console.error(`[${new Date().toISOString()}] method: ${req.method}, url: ${req.url}, headers: ${JSON.stringify(req.headers)}, body: ${JSON.stringify(req.body)}, responseStatusCode: ${res.statusCode}, error: ${err}`);
      
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
};


