import { TaskService } from '../modules/tasks/tasks.service';
import { TaskRepository } from '../modules/tasks/tasks.repository';
import { AppError } from '../errors/AppError';
import * as socketModule from '../socket';

jest.mock('../modules/tasks/tasks.repository');
jest.mock('../socket');

const MockRepo = TaskRepository as jest.MockedClass<typeof TaskRepository>;

describe('TaskService', () => {
    let service: TaskService;
    let repo: jest.Mocked<TaskRepository>;
    const ioEmit = jest.fn();
    const ioToEmit = jest.fn();
    const ioTo = jest.fn(() => ({ emit: ioToEmit }));

    beforeEach(() => {
        repo = new MockRepo() as any;
        service = new TaskService();
        service['repository'] = repo;

        (socketModule.getSocketIO as jest.Mock).mockReturnValue({
            emit: ioEmit,
            to: ioTo,
        } as any);

        ioEmit.mockClear();
        ioTo.mockClear();
        ioToEmit.mockClear();
    });

    it('updateTask throws 404 when task not found', async () => {
        repo.findById.mockResolvedValue(null as any);

        await expect(
            service.updateTask('missing-id', {}, 'user-1')
        ).rejects.toEqual(new AppError('Task not found', 404));
    });

    it('updateTask emits task.updated via Socket.io', async () => {
        const mockTask = { id: 'task-1', title: 'Old Title', assignedToId: 'user-2' };
        const updatedTask = { ...mockTask, title: 'New Title' };

        repo.findById.mockResolvedValue(mockTask as any);
        repo.update.mockResolvedValue(updatedTask as any);

        await service.updateTask('task-1', { title: 'New Title' }, 'user-1');

        expect(ioEmit).toHaveBeenCalledWith('task.updated', updatedTask);
    });

    it('updateTask calls notifyAssignment when assignedToId changes', async () => {
        const mockTask = { id: 'task-1', title: 'Title', assignedToId: 'user-2' };

        repo.findById.mockResolvedValue(mockTask as any);
        repo.update.mockResolvedValue(mockTask as any);

        await service.updateTask('task-1', { assignedToId: 'user-3' }, 'user-1');

        expect(repo.createNotification).toHaveBeenCalledWith('user-3', 'task-1', 'TASK_ASSIGNED');
        expect(ioTo).toHaveBeenCalledWith('user:user-3');
    });
});
