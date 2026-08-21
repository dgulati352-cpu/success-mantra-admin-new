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
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or any origin
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Serverless DB Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error on request:', err.message);
    // Don't crash - let routes handle or return friendly error
    next();
  }
});

// Root status route
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'Success Mantra Backend API',
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      courses: '/api/courses',
      liveStreams: '/api/live-streams',
      orders: '/api/orders'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Success Mantra API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);
app.use(handleError);

// Socket.io handlers
io.on('connection', (socket) => {
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
      timestamp: new Date()
    });
  });
});

const PORT = config.port;

// Only start standalone listener when not in Vercel serverless environment
if (!process.env.VERCEL) {
  connectDB().then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
    });
  }).catch((err) => {
    console.error('Failed to start server:', err);
  });
}

export default app;
export { app, io };