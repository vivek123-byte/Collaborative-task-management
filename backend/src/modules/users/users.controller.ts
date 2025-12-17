import { Request, Response, NextFunction } from 'express';
import { UserService } from './users.service';

export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.service.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    };
}
