import { AppError } from "./AppError";

export class SocketError extends AppError {
    constructor() {
        super("Error from socket",500);
    }
}