import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { config } from './config/index.js';
import { handleError, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import liveStreamRoutes from './routes/liveStreams.js';
import orderRoutes from './routes/orders.js';

const app = express();

// ─── Middleware ───
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins or direct server-to-server requests
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Rate Limiter ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// ─── Ensure DB Connection for Each Request (Serverless-Safe) ───
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error on request:', err.message);
    next();
  }
});

// ─── Root Status Endpoint ───
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
      orders: '/api/orders',
    },
  });
});

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Success Mantra API is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// ─── Error Handling ───
app.use(notFound);
app.use(handleError);

export default app;
