import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasksAssignedToMe, getTasksCreatedByMe, getOverdueTasks } from '../api/tasks';
import TaskCard from '../components/TaskCard';
import { useSocket } from '../hooks/useSocket';

const DashboardPage: React.FC = () => {
    useSocket(); // Ensure socket is connected and listeners are active

    const { data: assignedTasks, isLoading: loadingAssigned } = useQuery({
        queryKey: ['tasks-assigned'],
        queryFn: () => getTasksAssignedToMe(),
    });

    const { data: createdTasks, isLoading: loadingCreated } = useQuery({
        queryKey: ['tasks-created'],
        queryFn: () => getTasksCreatedByMe(),
    });

    const { data: overdueTasks, isLoading: loadingOverdue } = useQuery({
        queryKey: ['tasks-overdue'],
        queryFn: () => getOverdueTasks(),
    });

    if (loadingAssigned || loadingCreated || loadingOverdue) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>

                {[1, 2, 3].map((section) => (
                    <div key={section} className="space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/5"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 bg-gray-100 rounded-lg border border-gray-200"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>

            <section>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Assigned to Me ({assignedTasks?.length || 0})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignedTasks?.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))}
                    {assignedTasks?.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No active tasks assigned.</p>}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Overdue ({overdueTasks?.length || 0})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {overdueTasks?.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))}
                    {overdueTasks?.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No overdue tasks.</p>}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Created by Me ({createdTasks?.length || 0})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdTasks?.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))}
                    {createdTasks?.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">You haven't created any tasks.</p>}
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
