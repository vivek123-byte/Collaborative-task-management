import { NotificationRepository } from './notifications.repository';

export class NotificationService {
    private repository: NotificationRepository;

    constructor() {
        this.repository = new NotificationRepository();
    }

    async getUserNotifications(userId: string) {
        return this.repository.findByUserId(userId);
    }

    async markAsRead(id: string) {
        return this.repository.markAsRead(id);
    }
}
