import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../Config/db-config';
import { UnauthorizedError } from '../Errors/UnauthorizedError';

// Middleware per la verifica del token
export const authenticationHandler = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];  // Estrarre il token dal header Authorization
    try {
        if (!token) {
            throw new UnauthorizedError();
        }
        await verifyToken(token); 
        next();  
    } catch (error) {
        next(error)
    }
};
