import { z } from 'zod';

/**
 * Validates the input for creating a new task.
 * Enforces title length, required due date, and proper enums.
 */
export const CreateTaskDto = z.object({
    title: z.string().min(1).max(100),
    description: z.string(),
    dueDate: z.string().min(1, 'Due date is required'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
    assignedToId: z.string().optional().nullable().transform(val => val === '' ? null : val),
});

/**
 * Validates task updates.
 * All fields are optional since we support partial updates.
 */
export const UpdateTaskDto = CreateTaskDto.partial();

/**
 * Filter options for finding tasks.
 * Allows filtering by status and priority.
 */
export const TaskFilterDto = z.object({
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    sortBy: z.enum(['dueDate']).optional(), // Can be extended to createdAt etc.
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
export type TaskFilterInput = z.infer<typeof TaskFilterDto>;
