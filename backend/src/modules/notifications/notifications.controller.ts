import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notifications.service';

export class NotificationController {
    private service: NotificationService;

    constructor() {
        this.service = new NotificationService();
    }

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) throw new Error('Unauthorized');
            const notifications = await this.service.getUserNotifications(userId);
            res.json(notifications);
        } catch (error) {
            next(error);
        }
    };

    markRead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.service.markAsRead(id);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    };
}
