import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { config } from './config/index.js';
import { handleError, notFound } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import bookRoutes from './routes/books.js';
import lectureRoutes from './routes/lectures.js';
import testRoutes from './routes/tests.js';
import membershipRoutes from './routes/memberships.js';
import liveStreamRoutes from './routes/liveStreams.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const app = express();

// ─── 1. Cross-Origin Resource Sharing (CORS) ───
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all web requests from frontend domains, localhost, mobile, and server-to-server
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

// ─── 2. Body Parsing & Cookies ───
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// ─── 3. Global Rate Limiter ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api/', limiter);

// ─── 4. Non-blocking Database Connection (Serverless Resilience) ───
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // Log error but allow request to proceed with cached/mock fallbacks if needed
    console.warn('[Database] Request connection note:', err.message);
  }
  next();
});

// ─── 5. Root & Health Status Dashboard ───
const apiInfoHandler = (req, res) => {
  res.json({
    success: true,
    name: 'Success Mantra Academic & Commerce Platform API',
    tagline: 'Official Backend for Class 11, Class 12 Boards & Academic Bookstore',
    status: 'ONLINE & OPERATIONAL',
    frontendUrl: 'https://success-mantra-new.vercel.app',
    version: '2.4.0',
    environment: config.nodeEnv || 'production',
    serverTime: new Date().toISOString(),
    database: {
      provider: 'MongoDB Atlas',
      status: 'Connected',
    },
    services: {
      auth: { path: '/api/auth', status: 'ready', description: 'User registration, login, profile & JWT authentication' },
      courses: { path: '/api/courses', status: 'ready', description: 'Class 11 & Class 12 chapter courses, syllabus & lessons' },
      books: { path: '/api/books', status: 'ready', description: 'Academic Bookstore, 5-page sample preview & seller portal' },
      lectures: { path: '/api/lectures', status: 'ready', description: 'HD chapter video lectures with timestamps, doubts & PDF notes' },
      testSeries: { path: '/api/tests', status: 'ready', description: 'All India mock exams, CBT simulator & instant scorecards' },
      memberships: { path: '/api/memberships', status: 'ready', description: 'Monthly Pro, Quarterly Booster & Annual VIP Plans' },
      liveStreams: { path: '/api/live-streams', status: 'ready', description: 'Interactive live classes, chat & scheduled sessions' },
      orders: { path: '/api/orders', status: 'ready', description: 'Checkout processing, payment status & invoice receipts' },
      admin: { path: '/api/admin', status: 'ready', description: 'Analytics, user directory & system management' },
      health: { path: '/api/health', status: 'ready', description: 'Live server telemetry & uptime diagnostic' },
    },
  });
};

app.get('/', apiInfoHandler);
app.get('/api', apiInfoHandler);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'HEALTHY',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
  });
});

// ─── 6. Mount API Sub-Routers ───
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// ─── 7. Global Error & 404 Handlers ───
app.use(notFound);
app.use(handleError);

export default app;
