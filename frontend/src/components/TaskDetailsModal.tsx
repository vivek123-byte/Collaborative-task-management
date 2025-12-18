import React from 'react';
import { format } from 'date-fns';
import { Calendar, X, User } from 'lucide-react';
import type { Task } from '../api/tasks';
import clsx from 'clsx';

interface TaskDetailsModalProps {
    task: Task;
    onClose: () => void;
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

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-start">
                    <div className="pr-4">
                        <div className="flex gap-2 mb-3">
                            <span className={clsx('uppercase px-2.5 py-1 text-xs font-bold rounded-md', statusColors[task.status])}>
                                {task.status.replace('_', ' ')}
                            </span>
                            <span className={clsx('uppercase px-2.5 py-1 text-xs font-bold rounded-md', priorityColors[task.priority])}>
                                {task.priority}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
                            {task.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="prose dark:prose-invert max-w-none mb-8">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                            {task.description || <span className="italic text-gray-400">No description provided.</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-500">Due Date</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">{format(new Date(task.dueDate), 'PPP')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">People</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-500">Assigned To</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">
                                            {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-slate-500">Created By</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-200">
                                            {task.creator?.name || 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
