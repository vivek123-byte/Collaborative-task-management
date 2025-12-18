import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationRead } from '../api/notifications';
import { Bell, ClipboardList, Check, Clock } from 'lucide-react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const NotificationBadge: React.FC = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: notifications, isLoading, isError } = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
    });

    const markReadMutation = useMutation({
        mutationFn: markNotificationRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications?.filter(n => !n.readAt).length || 0;

    const handleMarkRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        markReadMutation.mutate(id);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="fixed left-4 right-4 top-20 z-50 md:absolute md:left-0 md:top-full md:w-96 md:right-auto md:inset-auto bg-white rounded-xl shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5 transition-all">
                    <div className="px-4 py-3 bg-white border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    <div className="max-h-[24rem] overflow-y-auto">
                        {isLoading && (
                            <div className="px-4 py-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mb-2"></div>
                                <p className="text-sm text-gray-500">Loading...</p>
                            </div>
                        )}

                        {isError && (
                            <div className="px-4 py-8 text-center text-red-500 text-sm">
                                Failed to load notifications.
                            </div>
                        )}

                        {!isLoading && !isError && notifications?.length === 0 && (
                            <div className="px-4 py-12 text-center text-gray-400">
                                <Bell size={32} className="mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        )}

                        {!isLoading && !isError && notifications?.map((notification) => (
                            <div
                                key={notification.id}
                                className={clsx(
                                    "group px-4 py-4 border-b border-gray-50 flex items-start space-x-3 transition-colors",
                                    !notification.readAt ? "bg-indigo-50/50 hover:bg-indigo-50" : "hover:bg-gray-50"
                                )}
                            >
                                <div className={clsx(
                                    "p-2 rounded-lg shrink-0",
                                    !notification.readAt ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"
                                )}>
                                    <ClipboardList size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 leading-snug">
                                        Task <span className="font-semibold text-gray-900">{notification.task.title}</span> assigned to you
                                    </p>
                                    <div className="flex items-center mt-1 space-x-2">
                                        <Clock size={12} className="text-gray-400" />
                                        <p className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                {!notification.readAt && (
                                    <button
                                        onClick={(e) => handleMarkRead(notification.id, e)}
                                        className="text-indigo-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-100 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Mark as read"
                                    >
                                        <Check size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
                        {/* Placeholder for "View All" if page existed */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBadge;
