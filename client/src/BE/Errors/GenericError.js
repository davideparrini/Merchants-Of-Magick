import { AppError } from "./AppError";

export class GenericError extends AppError  {
    constructor(message: string) {
        super(message,500);
    }
}