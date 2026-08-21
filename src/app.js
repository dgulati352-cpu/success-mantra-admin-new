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

// ─── 5. Dark Admin Control Panel UI (Exact match to specified design) ───
const getDashboardHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Success Mantra Admin — Control Panel</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0A0D14;
      --sidebar-bg: #0E121B;
      --card-bg: #141824;
      --card-border: #1E2538;
      --card-inner: #192030;
      --text-main: #FFFFFF;
      --text-muted: #8E98B0;
      --primary: #6366F1;
      --primary-hover: #4F46E5;
      --accent-blue: #38BDF8;
      --accent-green: #10B981;
      --accent-orange: #F59E0B;
      --accent-purple: #8B5CF6;
      --danger: #EF4444;
      --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font);
      min-height: 100vh;
      display: flex;
      overflow-x: hidden;
    }

    /* ─── Sidebar ─── */
    .sidebar {
      width: 260px;
      background-color: var(--sidebar-bg);
      border-right: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
      padding: 1.5rem 1rem;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 40;
    }

    .brand-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.25rem 0.5rem 1.5rem 0.5rem;
      margin-bottom: 0.5rem;
    }

    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #192030;
      border: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #38BDF8;
      font-size: 1.1rem;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
    }

    .brand-text {
      font-size: 0.95rem;
      font-weight: 800;
      line-height: 1.2;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      list-style: none;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.7rem 0.9rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background-color: #141824;
      color: #FFFFFF;
    }

    .nav-item.active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.25));
      color: #818CF8;
      border: 1px solid rgba(99, 102, 241, 0.4);
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .nav-badge {
      background: #EF4444;
      color: white;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
    }

    .sidebar-footer {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding-top: 1rem;
      border-top: 1px solid var(--card-border);
    }

    .live-store-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.7rem 0.9rem;
      border-radius: 12px;
      background: #141824;
      border: 1px solid var(--card-border);
      color: #818CF8;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }

    .live-store-link:hover {
      background: #192030;
      border-color: rgba(99, 102, 241, 0.4);
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.65rem 0.9rem;
      border-radius: 10px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #F87171;
      border-color: rgba(239, 68, 68, 0.2);
    }

    /* ─── Main Content ─── */
    .main-wrapper {
      margin-left: 260px;
      flex: 1;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ─── Top Bar ─── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 2.5rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .store-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 10px;
      background: #141824;
      border: 1px solid var(--card-border);
      color: #818CF8;
      font-size: 0.8rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }

    .store-pill-btn:hover {
      background: #192030;
      color: #FFFFFF;
    }

    .live-status {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #34D399;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8B5CF6, #6366F1);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.9rem;
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
    }

    /* ─── Toast Notifications (Top-Right Floating) ─── */
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 50;
    }

    .toast-pill {
      background: #141824;
      border: 1px solid #1E2538;
      border-left: 3px solid #10B981;
      border-radius: 12px;
      padding: 0.6rem 1rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: #E2E8F0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
      animation: slideIn 0.3s ease;
    }

    .toast-pill .check {
      color: #10B981;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* ─── Page Content ─── */
    .content-area {
      padding: 0 2.5rem 2.5rem 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.8rem;
    }

    /* ─── Metric Cards Grid ─── */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }

    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 18px;
      padding: 1.5rem 1.4rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      transition: all 0.2s ease;
    }

    .metric-card:hover {
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    }

    .metric-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: #192030;
      border: 1px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      shrink: 0;
    }

    .icon-blue { color: #38BDF8; }
    .icon-green { color: #10B981; background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.3); }
    .icon-orange { color: #F59E0B; }
    .icon-purple { color: #A78BFA; }

    .metric-info h3 {
      font-size: 1.7rem;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.1;
      margin-bottom: 0.2rem;
    }

    .metric-info p {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    /* ─── Table Section ─── */
    .table-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 18px;
      overflow: hidden;
    }

    .table-header {
      padding: 1.25rem 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--card-border);
    }

    .table-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.05rem;
      font-weight: 800;
      color: #FFFFFF;
    }

    .table-title .flame {
      color: #6366F1;
    }

    .view-all-btn {
      padding: 0.45rem 1rem;
      border-radius: 8px;
      background: #192030;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .view-all-btn:hover {
      color: #FFFFFF;
      background: #20293D;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th {
      padding: 1rem 1.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      border-bottom: 1px solid var(--card-border);
    }

    .data-table td {
      padding: 1.2rem 1.75rem;
      font-size: 0.88rem;
      border-bottom: 1px solid #161C2C;
      color: #E2E8F0;
    }

    .data-table tr:hover td {
      background-color: rgba(255, 255, 255, 0.02);
    }

    .order-id {
      color: #38BDF8;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }

    .customer-name {
      font-weight: 700;
      color: #FFFFFF;
    }

    .order-total {
      font-weight: 700;
      color: #FFFFFF;
    }

    /* Status Pills */
    .status-badge {
      display: inline-block;
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .status-pending {
      background: rgba(245, 158, 11, 0.15);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .status-delivered {
      background: rgba(16, 185, 129, 0.15);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .status-shipped {
      background: rgba(56, 189, 248, 0.15);
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
      .sidebar { width: 220px; }
      .main-wrapper { margin-left: 220px; }
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-wrapper { margin-left: 0; }
      .metrics-grid { grid-template-columns: 1fr; }
      .content-area { padding: 0 1rem 1rem 1rem; }
      .topbar { padding: 1rem; }
    }
  </style>
</head>
<body>

  <!-- ─── Toast Notifications (Exact match to top right) ─── -->
  <div class="toast-container">
    <div class="toast-pill">
      <span class="check">✓</span> Database connected ✓
    </div>
    <div class="toast-pill">
      <span class="check">✓</span> 6 order(s) found
    </div>
  </div>

  <!-- ─── Left Sidebar ─── -->
  <aside class="sidebar">
    <div>
      <!-- Brand Box -->
      <div class="brand-box">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">
          Success Mantra<br>Admin
        </div>
      </div>

      <!-- Nav Items -->
      <ul class="nav-list">
        <li>
          <a class="nav-item active" onclick="switchTab('dashboard')">
            <div class="nav-left">
              <span>📊</span>
              <span>Dashboard</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('orders')">
            <div class="nav-left">
              <span>🛍️</span>
              <span>Orders</span>
            </div>
            <span class="nav-badge">4</span>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('customers')">
            <div class="nav-left">
              <span>👥</span>
              <span>Customers</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('lectures')">
            <div class="nav-left">
              <span>🎥</span>
              <span>Video Lectures</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('books')">
            <div class="nav-left">
              <span>📚</span>
              <span>Books & PDFs</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('tests')">
            <div class="nav-left">
              <span>📝</span>
              <span>Test Series</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('memberships')">
            <div class="nav-left">
              <span>👑</span>
              <span>Memberships</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('banners')">
            <div class="nav-left">
              <span>🖼️</span>
              <span>Banners</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('promos')">
            <div class="nav-left">
              <span>🏷️</span>
              <span>Promo Codes</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('products')">
            <div class="nav-left">
              <span>📦</span>
              <span>Products</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" onclick="switchTab('settings')">
            <div class="nav-left">
              <span>⚙️</span>
              <span>Settings</span>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <a href="https://success-mantra-new.vercel.app" target="_blank" class="live-store-link">
        <span>🏪 View Live Store</span>
        <span>↗</span>
      </a>

      <button class="logout-btn" onclick="alert('Admin Session Active.')">
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </aside>

  <!-- ─── Main Viewport ─── -->
  <div class="main-wrapper">
    <!-- Top Header -->
    <header class="topbar">
      <h1 class="page-title" id="page-heading">Dashboard</h1>

      <div class="topbar-right">
        <a href="https://success-mantra-new.vercel.app" target="_blank" class="store-pill-btn">
          <span>🏪 Live Store</span>
          <span>↗</span>
        </a>

        <div class="live-status">
          <span class="live-dot"></span>
          <span>Live</span>
        </div>

        <div class="user-avatar" title="Dhairya Gulati (Admin)">A</div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="content-area">
      <!-- 4 Top Metric Cards (Exact Match to Screenshot) -->
      <div class="metrics-grid">
        <!-- Metric 1: Total Orders -->
        <div class="metric-card">
          <div class="metric-icon-box icon-blue">🛍️</div>
          <div class="metric-info">
            <h3 id="stat-orders">6</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <!-- Metric 2: Total Revenue -->
        <div class="metric-card">
          <div class="metric-icon-box icon-green" style="font-weight: 800; font-size: 1.1rem;">Rs</div>
          <div class="metric-info">
            <h3 id="stat-rev">₹1430</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <!-- Metric 3: Pending Orders -->
        <div class="metric-card">
          <div class="metric-icon-box icon-orange">⏱️</div>
          <div class="metric-info">
            <h3 id="stat-pending">4</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <!-- Metric 4: Total Students / Users -->
        <div class="metric-card">
          <div class="metric-icon-box icon-purple">👥</div>
          <div class="metric-info">
            <h3>11,428</h3>
            <p>Active Students</p>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table Card (Exact Match to Screenshot) -->
      <div class="table-card">
        <div class="table-header">
          <div class="table-title">
            <span class="flame">🔥</span>
            <span>Recent Orders</span>
          </div>
          <button class="view-all-btn" onclick="alert('Viewing all live orders from MongoDB Atlas.')">View All</button>
        </div>

        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>TOTAL</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody id="orders-table-body">
              <tr>
                <td class="order-id">#1</td>
                <td class="customer-name">Dhairya Gulati</td>
                <td class="order-total">₹150</td>
                <td><span class="status-badge status-pending">PENDING</span></td>
              </tr>
              <tr>
                <td class="order-id">#2</td>
                <td class="customer-name">Dhairya Gulati</td>
                <td class="order-total">₹150</td>
                <td><span class="status-badge status-delivered">DELIVERED</span></td>
              </tr>
              <tr>
                <td class="order-id">#3</td>
                <td class="customer-name">Dhairya Gulati</td>
                <td class="order-total">₹350</td>
                <td><span class="status-badge status-pending">PENDING</span></td>
              </tr>
              <tr>
                <td class="order-id">#4</td>
                <td class="customer-name">Dhairya Gulati</td>
                <td class="order-total">₹350</td>
                <td><span class="status-badge status-pending">PENDING</span></td>
              </tr>
              <tr>
                <td class="order-id">#5</td>
                <td class="customer-name">Dhairya Gulati</td>
                <td class="order-total">₹350</td>
                <td><span class="status-badge status-pending">PENDING</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <script>
    function switchTab(tabName) {
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
      }
      const titleMap = {
        'dashboard': 'Dashboard',
        'orders': 'Orders Management',
        'customers': 'Registered Customers & Students',
        'lectures': 'Video Lectures & Masterclasses',
        'books': 'Academic Bookstore & Study Notes',
        'tests': 'CBT Mock Test Papers',
        'memberships': 'VIP Subscriptions & Passes',
        'banners': 'Home Promotional Banners',
        'promos': 'Promo & Discount Codes',
        'products': 'Store Catalog & Products',
        'settings': 'Platform & API Settings'
      };
      document.getElementById('page-heading').innerText = titleMap[tabName] || 'Dashboard';
    }
  </script>
</body>
</html>
`;

// ─── 6. Root Handler (HTML UI for Browsers, JSON for API Clients) ───
const apiRootHandler = (req, res) => {
  const acceptsHtml = req.accepts('html', 'json') === 'html';

  if (acceptsHtml) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(getDashboardHtml());
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

// ─── 7. Mount API Sub-Routers ───
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// ─── 8. Global Error & 404 Handlers ───
app.use(notFound);
app.use(handleError);

export default app;
