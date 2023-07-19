import { Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';

export class ErrorHandler extends Error {
    statusCode = 0;
    constructor(statusCode: number, message: string) {
        super();
        if(message.includes('empty')) {
            this.statusCode = 409
        } else {
            this.statusCode = statusCode
        } 
        this.message = message;
    }
}

export const handleError = (req: Request, res: Response, err: ErrorHandler) => {
    const { message, statusCode } = err;
    const errors = validationResult(req);
    const errorsArray: ValidationError[] = errors.array();
    return res.status(statusCode).json({
        success: false,
        message: !errors.isEmpty() ? errorsArray[0].msg : message
    });
};