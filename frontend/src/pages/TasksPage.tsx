import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import type { CreateTaskInput, Task } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { Plus, Filter } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

const TasksPage: React.FC = () => {
    useSocket(); // Initialize socket connection
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [viewingTask, setViewingTask] = useState<Task | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterPriority, setFilterPriority] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Fetch all tasks (no server-side filtering)
    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'], // Remove filters from query key to cache all tasks
        queryFn: () => getTasks({}),
    });

    // Client-side filtering and sorting
    const processedTasks = React.useMemo(() => {
        if (!tasks) return [];

        let result = [...tasks];

        // 1. Filter
        if (filterStatus) {
            result = result.filter(task => task.status === filterStatus);
        }
        if (filterPriority) {
            result = result.filter(task => task.priority === filterPriority);
        }

        // 2. Sort by Due Date
        result.sort((a, b) => {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [tasks, filterStatus, filterPriority, sortOrder]);

    const createMutation = useMutation({
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setIsCreating(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string, data: any }) => updateTask(data.id, data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setEditingTask(null);
            // Also update the viewing task if it's the one being edited
            if (viewingTask) {
                const updatedTask = tasks?.find(t => t.id === viewingTask.id);
                if (updatedTask) setViewingTask(updatedTask);
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            if (viewingTask) {
                setViewingTask(null);
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to delete task';
            alert(message);
        },
    });

    const handleCreate = async (data: CreateTaskInput) => {
        await createMutation.mutateAsync(data);
    };

    const handleUpdate = async (data: CreateTaskInput) => {
        if (editingTask) {
            await updateMutation.mutateAsync({ id: editingTask.id, data });
        }
    };

    if (isLoading) return <div className="p-8"><div className="animate-pulse h-4 bg-gray-200 w-1/4 mb-4"></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>)}</div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks</h1>
                <button onClick={() => setIsCreating(true)} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    <Plus size={20} />
                    <span>New Task</span>
                </button>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600 items-center">
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Filter size={18} />
                    <span className="font-medium">Filters:</span>
                </div>

                <div className="flex flex-wrap gap-4 flex-1">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    >
                        <option value="">All Statuses</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="REVIEW">Review</option>
                        <option value="COMPLETED">Completed</option>
                    </select>

                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 dark:text-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>

                    <div className="flex items-center gap-2 border-l pl-4 dark:border-slate-600">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Sort by:</span>
                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
                        >
                            Due Date {sortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={setEditingTask}
                        onViewDetails={setViewingTask}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        isDeleting={deleteMutation.isPending}
                    />
                ))}
                {processedTasks.length === 0 && <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-8">No tasks found matching your filters.</p>}
            </div>

            {/* Modals */}
            {(isCreating || editingTask) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{isCreating ? 'Create Task' : 'Edit Task'}</h2>
                        <TaskForm
                            initialData={editingTask || undefined}
                            onSubmit={isCreating ? handleCreate : handleUpdate}
                            onCancel={() => { setIsCreating(false); setEditingTask(null); }}
                        />
                    </div>
                </div>
            )}

            {viewingTask && (
                <TaskDetailsModal
                    task={viewingTask}
                    onClose={() => setViewingTask(null)}
                />
            )}
        </div>
    );
};

export default TasksPage;
