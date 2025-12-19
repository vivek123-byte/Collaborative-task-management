import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setSocketIO } from './socket';

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

setSocketIO(io);

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on('disconnect', () => {
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
