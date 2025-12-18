import React from 'react';
import type { Task } from '../api/tasks';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import clsx from 'clsx';

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
    onDelete?: (id: string) => void;
    onViewDetails?: (task: Task) => void;
    isDeleting?: boolean;
}

const priorityColors = {
    LOW: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    MEDIUM: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    HIGH: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    URGENT: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const statusColors = {
    TODO: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300',
    IN_PROGRESS: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    REVIEW: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onViewDetails, isDeleting }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all flex flex-col gap-3 group">
            {/* Top Row: Title and Badges */}
            <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {task.title}
                </h3>
                <div className="flex flex-col sm:flex-row gap-2 shrink-0 items-end">
                    <span className={clsx('uppercase px-2 py-0.5 text-[10px] tracking-wider font-bold rounded shadow-sm', statusColors[task.status])}>
                        {task.status.replace('_', ' ')}
                    </span>
                    <span className={clsx('uppercase px-2 py-0.5 text-[10px] tracking-wider font-bold rounded shadow-sm', priorityColors[task.priority])}>
                        {task.priority}
                    </span>
                </div>
            </div>

            {/* Middle Row: Description */}
            <div className="min-h-[20px] relative">
                {task.description ? (
                    <p className="text-gray-600 dark:text-gray-300 text-sm truncate pr-16" title={task.description}>
                        {task.description}
                    </p>
                ) : (
                    <p className="text-gray-400 dark:text-slate-500 text-sm italic">No description</p>
                )}
                {onViewDetails && (
                    <button
                        onClick={() => onViewDetails(task)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline bg-white dark:bg-slate-800 pl-2"
                    >
                        View details
                    </button>
                )}
            </div>

            {/* Bottom Row: Metadata and Actions */}
            <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-slate-700/50 gap-y-2">
                {/* Left: Due Date */}
                <div className="flex items-center space-x-1 min-w-[100px]">
                    <Calendar size={14} className="text-indigo-400 dark:text-indigo-300" />
                    <span>{format(new Date(task.dueDate), 'PPP')}</span>
                </div>

                {/* Center: Assigned To */}
                <div className="flex items-center justify-center grow px-2 text-center">
                    <span className="text-gray-400 dark:text-slate-500 mr-1">Assigned to:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                        {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                    </span>
                </div>

                {/* Right: Created By and Actions */}
                <div className="flex items-center gap-4 justify-end min-w-[fit-content]">
                    <div className="hidden sm:block text-right">
                        <span className="text-gray-400 dark:text-slate-500 mr-1">Created by:</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {task.creator?.name || 'Unknown'}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2 border-l pl-4 border-gray-200 dark:border-slate-600">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(task)}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors"
                                disabled={isDeleting}
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(task.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold transition-colors disabled:opacity-50"
                                disabled={isDeleting}
                            >
                                {isDeleting ? '...' : 'Delete'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
