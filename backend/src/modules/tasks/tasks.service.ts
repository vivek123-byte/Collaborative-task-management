import { TaskRepository } from './tasks.repository';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from './tasks.dtos';
import { getSocketIO } from '../../socket';
import { AppError } from '../../errors/AppError';

export class TaskService {
    private repository: TaskRepository;

    constructor() {
        this.repository = new TaskRepository();
    }

    async createTask(userId: string, data: CreateTaskInput) {
        const task = await this.repository.create({ ...data, creatorId: userId });

        const io = getSocketIO();
        io.emit('task.updated', task);

        if (task.assignedToId && task.assignedToId !== userId) {
            await this.notifyAssignment(task.assignedToId, task.id);
        }

        return task;
    }

    async getTasks(filters: TaskFilterInput) {
        return this.repository.findAll(filters);
    }

    async getTasksAssignedToUser(userId: string, filters: TaskFilterInput) {
        return this.repository.findAssignedToUser(userId, filters);
    }

    async getTasksCreatedByUser(userId: string, filters: TaskFilterInput) {
        return this.repository.findCreatedByUser(userId, filters);
    }

    async getOverdueTasks(userId: string, filters: TaskFilterInput) {
        return this.repository.findOverdueForUser(userId, filters);
    }

    async getTask(id: string) {
        return this.repository.findById(id);
    }

    async updateTask(id: string, data: UpdateTaskInput, userId: string) {
        const oldTask = await this.repository.findById(id);
        if (!oldTask) throw new AppError('Task not found', 404);

        const updatedTask = await this.repository.update(id, data);

        const io = getSocketIO();
        io.emit('task.updated', updatedTask);

        if (data.assignedToId && data.assignedToId !== oldTask.assignedToId && data.assignedToId !== userId) {
            await this.notifyAssignment(data.assignedToId, id);
        }

        return updatedTask;
    }

    async deleteTask(id: string, userId: string) {
        const task = await this.repository.findById(id);
        if (!task) throw new AppError('Task not found', 404);

        if (task.creatorId !== userId) {
            throw new AppError('You are not authorized to delete this task', 403);
        }

        await this.repository.deleteNotificationsByTaskId(id);

        await this.repository.delete(id);
        const io = getSocketIO();
        io.emit('task.deleted', { id });
    }

    private async notifyAssignment(userId: string, taskId: string) {
        const notification = await this.repository.createNotification(userId, taskId, 'TASK_ASSIGNED');
        const io = getSocketIO();
        io.to(`user:${userId}`).emit('notification.new', notification);
    }
}
