import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AppError } from '../../errors/AppError';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.register(req.body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user, token } = await this.authService.login(req.body);

            // Set HttpOnly cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.json({ user });
        } catch (error) {
            next(error);
        }
    };

    logout = (req: Request, res: Response) => {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    };

    me = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new AppError('Unauthorized', 401);
            }
            const user = await this.authService.getUser(userId);
            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    updateMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new AppError('Unauthorized', 401);
            }
            const user = await this.authService.updateProfile(userId, req.body);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
}
