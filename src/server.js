import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database.js';
import { config } from './config/index.js';
import { handleError, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import liveStreamRoutes from './routes/liveStreams.js';
import orderRoutes from './routes/orders.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.nodeEnv === 'development' ? 5000 : 100,
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Success Mantra API is running', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(handleError);

const PORT = config.port;

const startServer = async () => {
  try {
    await connectDB();

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join:stream', (streamId) => {
        socket.join(`stream:${streamId}`);
        console.log(`Socket ${socket.id} joined stream:${streamId}`);
      });

      socket.on('leave:stream', (streamId) => {
        socket.leave(`stream:${streamId}`);
        console.log(`Socket ${socket.id} left stream:${streamId}`);
      });

      socket.on('chat:message', (data) => {
        io.to(`stream:${data.streamId}`).emit('chat:message', {
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          timestamp: new Date()
        });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };