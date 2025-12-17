import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = payload.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
