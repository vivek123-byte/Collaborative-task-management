import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ZodError } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            message: 'Validation failed',
            errors: err.errors,
        });
        return;
    }

    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
};
