import client from './client';

export interface Notification {
    id: string;
    userId: string;
    taskId: string;
    type: string;
    readAt: string | null;
    createdAt: string;
    task: { title: string };
}

export const getNotifications = async () => {
    const response = await client.get<Notification[]>('/notifications');
    return response.data;
};

export const markNotificationRead = async (id: string) => {
    await client.patch(`/notifications/${id}/read`);
};
