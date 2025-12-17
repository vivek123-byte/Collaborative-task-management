import prisma from '../../prisma/client';

export class NotificationRepository {
    async findByUserId(userId: string) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { task: { select: { title: true } } }
        });
    }

    async markAsRead(id: string) {
        return prisma.notification.update({
            where: { id },
            data: { readAt: new Date() }
        });
    }
}
