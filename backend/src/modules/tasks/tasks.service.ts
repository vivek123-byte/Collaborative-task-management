import { TaskRepository } from './tasks.repository';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from './tasks.dtos';
import { getSocketIO } from '../../socket';
import { AppError } from '../../errors/AppError';

export class TaskService {
    private repository: TaskRepository;

    constructor() {
        this.repository = new TaskRepository();
    }

    /**
     * Creates a new task and broadcasts it to everyone using Socket.io.
     * If someone else is assigned, we also trigger a specific notification for them.
     */
    async createTask(userId: string, data: CreateTaskInput) {
        const task = await this.repository.create({ ...data, creatorId: userId });

        const io = getSocketIO();
        io.emit('task.updated', task);

        if (task.assignedToId && task.assignedToId !== userId) {
            await this.notifyAssignment(task.assignedToId, task.id);
        }

        return task;
    }

    /**
     * Fetch all tasks matching the given filters (status, priority).
     * Used for the main task list view.
     */
    async getTasks(filters: TaskFilterInput) {
        return this.repository.findAll(filters);
    }

    /**
     * Gets tasks specifically assigned to the current user.
     * Useful for the "Assigned to Me" section in the dashboard.
     */
    async getTasksAssignedToUser(userId: string, filters: TaskFilterInput) {
        return this.repository.findAssignedToUser(userId, filters);
    }

    /**
     * Helper to find tasks the user actually created themselves.
     */
    async getTasksCreatedByUser(userId: string, filters: TaskFilterInput) {
        return this.repository.findCreatedByUser(userId, filters);
    }

    /**
     * Finds tasks that are past their due date and not yet completed.
     * Checks both created by and assigned to the user.
     */
    async getOverdueTasks(userId: string, filters: TaskFilterInput) {
        return this.repository.findOverdueForUser(userId, filters);
    }

    async getTask(id: string) {
        return this.repository.findById(id);
    }

    /**
     * Updates an existing task and notifies everyone of the change.
     * If the assignee changes, we send a targeted notification to the new person.
     */
    async updateTask(id: string, data: UpdateTaskInput, userId: string) {
        const oldTask = await this.repository.findById(id);
        if (!oldTask) throw new AppError('Task not found', 404);

        const updatedTask = await this.repository.update(id, data);

        const io = getSocketIO();
        io.emit('task.updated', updatedTask);

        if (data.status && data.status !== oldTask.status) {
            await this.repository.createAuditLog({
                userId,
                taskId: id,
                action: 'STATUS_UPDATE',
                details: `Status changed from ${oldTask.status} to ${data.status}`
            });
        }

        if (data.assignedToId && data.assignedToId !== oldTask.assignedToId && data.assignedToId !== userId) {
            await this.notifyAssignment(data.assignedToId, id);
        }

        return updatedTask;
    }

    /**
     * Deletes a task. Only the original creator is allowed to do this.
     * Also cleans up any related notifications to keep the DB clean.
     */
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
