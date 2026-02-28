import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
    constructor() {
        super("User unauthorized",401);
    }
}