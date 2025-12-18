import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export const useSocket = () => {
    const { user } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (user && !socketRef.current) {
            const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
                withCredentials: true,
                transports: ['websocket'],
            });

            socket.on('connect', () => {
                socket.emit('join', user.id);
            });

            socket.on('task.updated', () => {
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
                queryClient.invalidateQueries({ queryKey: ['tasks-assigned'] });
                queryClient.invalidateQueries({ queryKey: ['tasks-created'] });
                queryClient.invalidateQueries({ queryKey: ['tasks-overdue'] });
            });

            socket.on('task.deleted', () => {
                queryClient.invalidateQueries({ queryKey: ['tasks'] });
                queryClient.invalidateQueries({ queryKey: ['tasks-assigned'] });
                queryClient.invalidateQueries({ queryKey: ['tasks-created'] });
                queryClient.invalidateQueries({ queryKey: ['tasks-overdue'] });
            });

            socket.on('notification.new', () => {
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
            });

            socketRef.current = socket;
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user, queryClient]);

    return socketRef.current;
};
