import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import * as classValidator from 'class-validator';
import httpStatus = require('http-status');

export const isLogged = (req: Request, res: Response, next: NextFunction) => {
    return next();
};

export function validateMiddleware(type: any, where: 'body' | 'query' | 'params' = 'body') {
    return async (req: Request, res: Response, next: NextFunction) => {
        const parsedBody = plainToClass(type, req[where]);
        const errors = await classValidator.validate(parsedBody);
        if (errors.length !== 0) {
            const message = errors.join('');
            console.log('Validation error: ', message);
            return res.status(httpStatus.BAD_REQUEST).send(message);
        }
        req.body = parsedBody;
        return next();
    };
}

