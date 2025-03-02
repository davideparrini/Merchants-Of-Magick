import { AppError } from "./AppError";

export class SocketError extends AppError {
    constructor() {
        super("Error from client socket",408);
    }
}