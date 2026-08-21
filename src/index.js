import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/database.js';
import { config } from './config/index.js';

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

// ─── Socket.IO Real-time Events ───
io.on('connection', (socket) => {
  console.log('Client connected to Socket.IO:', socket.id);

  socket.on('join:stream', (streamId) => {
    socket.join(`stream:${streamId}`);
  });

  socket.on('leave:stream', (streamId) => {
    socket.leave(`stream:${streamId}`);
  });

  socket.on('chat:message', (data) => {
    io.to(`stream:${data.streamId}`).emit('chat:message', {
      userId: data.userId,
      userName: data.userName,
      message: data.message,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = config.port;

// ─── Boot Server ───
const start = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export { httpServer, io, app };
