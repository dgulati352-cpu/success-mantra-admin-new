import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database.js';
import { config } from './config/index.js';
import { handleError, notFound } from './middleware/errorHandler.js';
import { adminDashboardHtml } from './views/adminDashboard.js';

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
import paymentRoutes, { handleCreateOrder, handleVerifyPayment } from './routes/payment.js';

const app = express();

// ─── 1. Cross-Origin Resource Sharing (CORS) ───
app.use(
  cors({
    origin: (origin, callback) => {
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
    console.warn('[Database] Request connection note:', err.message);
  }
  next();
});

// ─── 5. Root Handler (HTML UI for Browsers, JSON for API Clients) ───
const apiRootHandler = (req, res) => {
  const acceptsHtml = req.accepts('html', 'json') === 'html';

  if (acceptsHtml) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(adminDashboardHtml);
  }

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
      auth: { path: '/api/auth', status: 'ready' },
      courses: { path: '/api/courses', status: 'ready' },
      books: { path: '/api/books', status: 'ready' },
      lectures: { path: '/api/lectures', status: 'ready' },
      testSeries: { path: '/api/tests', status: 'ready' },
      memberships: { path: '/api/memberships', status: 'ready' },
      liveStreams: { path: '/api/live-streams', status: 'ready' },
      orders: { path: '/api/orders', status: 'ready' },
      payment: { path: '/api/payment', status: 'ready' },
      admin: { path: '/api/admin', status: 'ready' },
      health: { path: '/api/health', status: 'ready' },
    },
  });
};

app.get('/', apiRootHandler);
app.get('/api', apiRootHandler);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'HEALTHY',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
  });
});

// ─── 6. Mount API Sub-Routers & Razorpay Endpoints ───
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.post('/api/create-order', handleCreateOrder);
app.post('/api/verify-payment', handleVerifyPayment);
app.use('/api/admin', adminRoutes);

// ─── 7. Global Error & 404 Handlers ───
app.use(notFound);
app.use(handleError);

export default app;
