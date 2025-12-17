import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

export const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/tasks/tasks.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import userRoutes from './modules/users/users.routes';
import { errorHandler } from './middlewares/errorHandler';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorHandler);
