class GenericError extends AppError {
    constructor(message: string) {
        super(message,500);
    }
}