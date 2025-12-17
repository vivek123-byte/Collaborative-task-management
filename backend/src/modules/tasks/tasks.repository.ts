import prisma from '../../prisma/client';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from './tasks.dtos';

export class TaskRepository {
    async create(data: CreateTaskInput & { creatorId: string }) {
        const prismaData = {
            ...data,
            dueDate: new Date(data.dueDate),
            assignedToId: data.assignedToId || null,
        };


        return prisma.task.create({
            data: prismaData,
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
            }
        });
    }

    async findAll(filters: TaskFilterInput) {
        return prisma.task.findMany({
            where: filters,
            orderBy: { dueDate: 'asc' },
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
            }
        });
    }

    async findById(id: string) {
        return prisma.task.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
            }
        });
    }

    async update(id: string, data: UpdateTaskInput) {
        const updateData: any = { ...data };
        if (updateData.dueDate) {
            updateData.dueDate = new Date(updateData.dueDate);
        }
        if (updateData.assignedToId !== undefined) {
            updateData.assignedToId = updateData.assignedToId || null;
        }

        return prisma.task.update({
            where: { id },
            data: updateData,
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
            }
        });
    }

    async delete(id: string) {
        return prisma.task.delete({
            where: { id },
        });
    }

    async findAssignedToUser(userId: string, filters: TaskFilterInput) {
        return prisma.task.findMany({
            where: {
                assignedToId: userId,
                ...filters
            },
            orderBy: { dueDate: 'asc' },
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
            }
        });
    }

    async findCreatedByUser(userId: string, filters: TaskFilterInput) {
        return prisma.task.findMany({
            where: {
                creatorId: userId,
                ...filters
            },
            orderBy: { dueDate: 'asc' },
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
            }
        });
    }

    async findOverdueForUser(userId: string, filters: TaskFilterInput) {
        return prisma.task.findMany({
            where: {
                OR: [
                    { assignedToId: userId },
                    { creatorId: userId }
                ],
                dueDate: { lt: new Date() },
                status: { not: 'COMPLETED' },
                ...filters
            },
            orderBy: { dueDate: 'asc' },
            include: {
                creator: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
            }
        });
    }

    async createNotification(userId: string, taskId: string, type: string) {
        return prisma.notification.create({
            data: {
                userId,
                taskId,
                type
            }
        });
    }

    async deleteNotificationsByTaskId(taskId: string) {
        return prisma.notification.deleteMany({
            where: { taskId }
        });
    }
}
