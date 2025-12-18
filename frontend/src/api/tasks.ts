import client from './client';
import { z } from 'zod';

/**
 * Zod schema defining the structure of a Task.
 * This should match what the backend returns.
 */
export const TaskSchema = z.object({
    id: z.string(),
    title: z.string().min(1).max(100),
    description: z.string(),
    dueDate: z.string(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
    creatorId: z.string(),
    assignedToId: z.string().nullable().optional(),
    assignedTo: z.object({ id: z.string(), name: z.string() }).optional().nullable(),
    creator: z.object({ id: z.string(), name: z.string() }).optional(),
});


export const CreateTaskSchema = TaskSchema.pick({
    title: true,
    priority: true,
    status: true,
}).extend({
    description: z.string().optional(),
    dueDate: z.string().min(1, 'Due date is required'),
    assignedToId: z.string().optional().nullable(),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = Partial<CreateTaskInput>;


export interface TaskFilters {
    status?: string;
    priority?: string;
}

export const getTasks = async (filters?: TaskFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);

    const response = await client.get<Task[]>(`/tasks?${params.toString()}`);
    return response.data;
};

/**
 * Sends a POST request to create a new task.
 */
export const createTask = async (data: CreateTaskInput) => {
    const response = await client.post<Task>('/tasks', data);
    return response.data;
};

/**
 * Updates an ongoing task with new data (partial update).
 */
export const updateTask = async (id: string, data: UpdateTaskInput) => {
    const response = await client.patch<Task>(`/tasks/${id}`, data);
    return response.data;
};

/**
 * Permanently deletes a task.
 */
export const deleteTask = async (id: string) => {
    await client.delete(`/tasks/${id}`);
};

/**
 * Gets the tasks specifically assigned to the current logged-in user.
 */
export const getTasksAssignedToMe = async (filters?: { status?: string; priority?: string }) => {
    const res = await client.get<Task[]>('/tasks/assigned/me', { params: filters });
    return res.data;
};

export const getTasksCreatedByMe = async (filters?: { status?: string; priority?: string }) => {
    const res = await client.get<Task[]>('/tasks/created/me', { params: filters });
    return res.data;
};

export const getOverdueTasks = async (filters?: { status?: string; priority?: string }) => {
    const res = await client.get<Task[]>('/tasks/overdue/me', { params: filters });
    return res.data;
};
