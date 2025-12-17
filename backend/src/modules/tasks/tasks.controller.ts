import { Request, Response, NextFunction } from 'express';
import { TaskService } from './tasks.service';
import { AppError } from '../../errors/AppError';
import { TaskFilterDto } from './tasks.dtos';

export class TaskController {
    private service: TaskService;

    constructor() {
        this.service = new TaskService();
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) throw new AppError('Unauthorized', 401);
            const task = await this.service.createTask(userId, req.body);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    };

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters = TaskFilterDto.parse(req.query);
            const tasks = await this.service.getTasks(filters);
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    };

    findAssignedToMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) throw new AppError('Unauthorized', 401);

            const filters = TaskFilterDto.parse(req.query);
            const tasks = await this.service.getTasksAssignedToUser(userId, filters);
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    };

    findCreatedByMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) throw new AppError('Unauthorized', 401);

            const filters = TaskFilterDto.parse(req.query);
            const tasks = await this.service.getTasksCreatedByUser(userId, filters);
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    };

    findOverdue = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) throw new AppError('Unauthorized', 401);

            const filters = TaskFilterDto.parse(req.query);
            const tasks = await this.service.getOverdueTasks(userId, filters);
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    };

    findOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const task = await this.service.getTask(req.params.id);
            if (!task) throw new AppError('Task not found', 404);
            res.json(task);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) throw new AppError('Unauthorized', 401);
            const task = await this.service.updateTask(req.params.id, req.body, userId);
            res.json(task);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.userId;
            if (!userId) throw new AppError('Unauthorized', 401);
            await this.service.deleteTask(req.params.id, userId);
            res.json({ message: 'Task deleted' });
        } catch (error) {
            next(error);
        }
    };
}
