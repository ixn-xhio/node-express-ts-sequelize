import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ErrorHandler, handleError } from '../../utils/error';

export const validateEmail = (correo: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(correo);
};

export const validatorMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }
    const err = new ErrorHandler(409, 'invalid_field');
    handleError(req, res, err);
};