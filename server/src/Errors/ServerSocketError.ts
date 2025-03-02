import { AppError } from "./AppError";

export class ServerSocketError extends AppError {
    constructor() {
        super("Error from server socket",503);
    }
}