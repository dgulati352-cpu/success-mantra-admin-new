export const adminDashboardHtml = `<!DOCTYPE html>
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

    * { box-sizing: border-box; margin: 0; padding: 0; }

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
      overflow-y: auto;
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

    .nav-item:hover { background-color: #141824; color: #FFFFFF; }

    .nav-item.active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.25));
      color: #818CF8;
      border: 1px solid rgba(99, 102, 241, 0.4);
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
    }

    .nav-left { display: flex; align-items: center; gap: 0.75rem; }

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

    .store-pill-btn:hover { background: #192030; color: #FFFFFF; }

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

    /* ─── Toast Notifications ─── */
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

    .toast-pill .check { color: #10B981; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .content-area {
      padding: 0 2.5rem 2.5rem 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.8rem;
    }

    /* ─── Metric Cards ─── */
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
      flex-shrink: 0;
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
      gap: 1rem;
      flex-wrap: wrap;
    }

    .table-title {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.05rem;
      font-weight: 800;
      color: #FFFFFF;
    }

    .table-title .flame { color: #6366F1; }

    .header-actions { display: flex; align-items: center; gap: 0.75rem; }

    .btn-primary {
      padding: 0.5rem 1.1rem;
      border-radius: 8px;
      background: var(--primary);
      color: white;
      font-size: 0.8rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover { background: var(--primary-hover); }

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

    .view-all-btn:hover { color: #FFFFFF; background: #20293D; }

    .data-table { width: 100%; border-collapse: collapse; text-align: left; }

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

    .data-table tr:hover td { background-color: rgba(255, 255, 255, 0.02); }

    .order-id { color: #38BDF8; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
    .customer-name { font-weight: 700; color: #FFFFFF; }
    .order-total { font-weight: 700; color: #FFFFFF; }

    /* Status Pills */
    .status-badge {
      display: inline-block;
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;
    }

    .status-badge:hover { filter: brightness(1.2); transform: scale(1.04); }

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

    /* Modal Form Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-box {
      background: #141824;
      border: 1px solid var(--card-border);
      border-radius: 20px;
      max-width: 650px;
      width: 100%;
      padding: 1.75rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      max-height: 92vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 0.85rem;
    }

    .modal-title { font-size: 1.15rem; font-weight: 800; color: white; }
    .close-btn { background: transparent; border: none; color: var(--text-muted); font-size: 1.3rem; cursor: pointer; }
    .form-group { margin-bottom: 1rem; }
    .form-label { display: block; font-size: 0.8rem; font-weight: 700; color: #CBD5E1; margin-bottom: 0.4rem; }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      background: #0E121B;
      border: 1px solid var(--card-border);
      border-radius: 10px;
      padding: 0.65rem 0.9rem;
      color: white;
      font-family: var(--font);
      font-size: 0.85rem;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--primary);
    }

    .q-type-btn {
      padding: 0.5rem 0.75rem;
      border-radius: 10px;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--card-border);
      background: #0E121B;
      color: var(--text-muted);
      transition: all 0.2s;
    }

    .q-type-btn.active {
      background: #6366F1;
      color: white;
      border-color: #6366F1;
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }

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

  <!-- Toast Notification Container (Dynamic only on user actions) -->
  <div class="toast-container" id="toast-box"></div>

  <!-- Left Sidebar -->
  <aside class="sidebar">
    <div>
      <div class="brand-box">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">
          Success Mantra<br>Admin
        </div>
      </div>

      <ul class="nav-list">
        <li>
          <a class="nav-item active" id="nav-dashboard" onclick="switchTab('dashboard')">
            <div class="nav-left">
              <span>📊</span>
              <span>Dashboard</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-orders" onclick="switchTab('orders')">
            <div class="nav-left">
              <span>🛍️</span>
              <span>Orders</span>
            </div>
            <span class="nav-badge" id="pending-badge">4</span>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-customers" onclick="switchTab('customers')">
            <div class="nav-left">
              <span>👥</span>
              <span>Customers</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-lectures" onclick="switchTab('lectures')">
            <div class="nav-left">
              <span>🎥</span>
              <span>Video Lectures</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-books" onclick="switchTab('books')">
            <div class="nav-left">
              <span>📚</span>
              <span>Books & PDFs</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-tests" onclick="switchTab('tests')">
            <div class="nav-left">
              <span>📝</span>
              <span>Test Series</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-memberships" onclick="switchTab('memberships')">
            <div class="nav-left">
              <span>👑</span>
              <span>Memberships</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-banners" onclick="switchTab('banners')">
            <div class="nav-left">
              <span>🖼️</span>
              <span>Banners</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-promos" onclick="switchTab('promos')">
            <div class="nav-left">
              <span>🏷️</span>
              <span>Promo Codes</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-products" onclick="switchTab('products')">
            <div class="nav-left">
              <span>📦</span>
              <span>Products</span>
            </div>
          </a>
        </li>

        <li>
          <a class="nav-item" id="nav-settings" onclick="switchTab('settings')">
            <div class="nav-left">
              <span>⚙️</span>
              <span>Settings</span>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <div class="sidebar-footer">
      <a href="https://success-mantra-new.vercel.app" target="_blank" class="live-store-link">
        <span>🏪 View Live Store</span>
        <span>↗</span>
      </a>

      <button class="logout-btn" onclick="showToast('Admin Session: dgulati352@gmail.com is Active')">
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </aside>

  <!-- Main Viewport -->
  <div class="main-wrapper">
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

    <main class="content-area" id="dynamic-content">
      <!-- Injected via renderCurrentTab() -->
    </main>
  </div>

  <!-- Universal Action Modal -->
  <div class="modal-overlay" id="action-modal">
    <div class="modal-box" id="modal-box-content">
      <!-- Injected dynamically -->
    </div>
  </div>

  <script>
    let currentTab = 'dashboard';
    let activeVideoSourceMode = 'youtube';
    let selectedVideoFileName = '';
    let selectedPdfFileName = '';
    let currentTestQType = 'mcq';
    let draftTestQuestions = [];

    let orders = [
      { id: '#1', customer: 'Dhairya Gulati', email: 'dgulati352@gmail.com', total: 150, status: 'PENDING', date: '2026-08-21', item: 'Accountancy Formula eBook' },
      { id: '#2', customer: 'Dhairya Gulati', email: 'dgulati352@gmail.com', total: 150, status: 'DELIVERED', date: '2026-08-21', item: 'Class 12 Macro Sample Paper' },
      { id: '#3', customer: 'Dhairya Gulati', email: 'dgulati352@gmail.com', total: 350, status: 'PENDING', date: '2026-08-20', item: 'Business Studies Case Study Kit' },
      { id: '#4', customer: 'Dhairya Gulati', email: 'dgulati352@gmail.com', total: 350, status: 'PENDING', date: '2026-08-20', item: 'Partnership Fundamentals Video' },
      { id: '#5', customer: 'Dhairya Gulati', email: 'dgulati352@gmail.com', total: 350, status: 'PENDING', date: '2026-08-19', item: 'Class 12 All India Mock Test 1' },
      { id: '#6', customer: 'Priya Sharma', email: 'priya.s@example.com', total: 80, status: 'DELIVERED', date: '2026-08-18', item: 'Economics Flashcards' },
    ];

    let customers = [
      { id: 'CUST-01', name: 'Dhairya Gulati', email: 'dgulati352@gmail.com', grade: 'Class 12', orders: 5, spent: '₹1,350', status: 'Active', plan: 'Annual VIP' },
      { id: 'CUST-02', name: 'Priya Sharma', email: 'priya.s@example.com', grade: 'Class 12', orders: 2, spent: '₹499', status: 'Active', plan: 'VIP Member' },
      { id: 'CUST-03', name: 'Rahul Verma', email: 'rahul.v@example.com', grade: 'Class 11', orders: 1, spent: '₹999', status: 'Active', plan: 'Monthly Pro' },
      { id: 'CUST-04', name: 'Ananya Patel', email: 'ananya.p@example.com', grade: 'Class 12', orders: 3, spent: '₹1,120', status: 'Active', plan: 'Free Preview' },
    ];

    let lectures = [
      { id: 'LEC-01', title: 'Partnership: Profit & Loss Appropriation', grade: 'Class 12', subject: 'Accountancy', instructor: 'Prof. S. K. Sharma', duration: '52 mins', isFree: true, views: '28.4K' },
      { id: 'LEC-02', title: 'Admission of a Partner: Revaluation & Goodwill', grade: 'Class 12', subject: 'Accountancy', instructor: 'Prof. S. K. Sharma', duration: '64 mins', isFree: false, views: '22.1K' },
      { id: 'LEC-03', title: 'Principles of Management: Fayol 14 Principles', grade: 'Class 12', subject: 'Business Studies', instructor: 'Dr. Neha Verma', duration: '45 mins', isFree: true, views: '35.6K' },
      { id: 'LEC-04', title: 'National Income: Value Added & Income Methods', grade: 'Class 12', subject: 'Macroeconomics', instructor: 'Prof. R. C. Gupta', duration: '62 mins', isFree: false, views: '41.2K' },
    ];

    let books = [
      { id: 'BK-01', title: 'Class 12 Accountancy Board Master Guide 2026', author: 'Prof. S. K. Sharma', price: 499, sales: 1450, format: 'Paperback + eBook', pages: 420 },
      { id: 'BK-02', title: 'Business Studies Toppers Handwritten Case Studies', author: 'Dr. Neha Verma', price: 399, sales: 1120, format: 'Handwritten Notes', pages: 280 },
      { id: 'BK-03', title: 'Macroeconomics & Indian Development Scanner', author: 'Prof. R. C. Gupta', price: 449, sales: 1340, format: 'Paperback', pages: 360 },
    ];

    let tests = [
      { id: 'TS-01', title: 'Class 12 Accountancy All India Board Mock 1', marks: 80, duration: '180 mins', qCount: 34, attempts: 3420, avgScore: '82%', isFree: true },
      { id: 'TS-02', title: 'Class 12 Business Studies Full Case Studies Mock', marks: 80, duration: '180 mins', qCount: 34, attempts: 2890, avgScore: '79%', isFree: true },
      { id: 'TS-03', title: 'Class 12 Macroeconomics & IED Comprehensive Mock', marks: 80, duration: '180 mins', qCount: 34, attempts: 2150, avgScore: '76%', isFree: false },
    ];

    let promos = [
      { code: 'TOPPER20', discount: '20% OFF', usage: '280 uses', status: 'ACTIVE' },
      { code: 'VIP100', discount: '₹100 FLAT', usage: '410 uses', status: 'ACTIVE' },
      { code: 'FREESHIP', discount: 'Free Delivery', usage: '120 uses', status: 'EXPIRED' },
    ];

    let banners = [
      { id: 'BN-01', title: 'Class 12 CBSE Board 100/100 Mission Batch', status: 'LIVE', link: '/courses' },
      { id: 'BN-02', title: 'Annual VIP Pass 50% Early Bird Discount', status: 'LIVE', link: '/membership' },
      { id: 'BN-03', title: 'Commerce Handwritten Notes Book Fair', status: 'PAUSED', link: '/books' },
    ];

    function showToast(msg) {
      const box = document.getElementById('toast-box');
      const toast = document.createElement('div');
      toast.className = 'toast-pill';
      toast.innerHTML = '<span class="check">✓</span> ' + msg;
      box.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 4000);
    }

    function toggleOrderStatus(orderId) {
      const ord = orders.find(function(o) { return o.id === orderId; });
      if (ord) {
        ord.status = ord.status === 'PENDING' ? 'DELIVERED' : 'PENDING';
        showToast('Order ' + orderId + ' status updated to ' + ord.status);
        renderCurrentTab();
      }
    }

    function toggleLectureLock(lecId) {
      const lec = lectures.find(function(l) { return l.id === lecId; });
      if (lec) {
        lec.isFree = !lec.isFree;
        showToast(lec.title + ' is now ' + (lec.isFree ? 'Free Preview Demo' : 'VIP Locked'));
        renderCurrentTab();
      }
    }

    function toggleCustomerStatus(custId) {
      const c = customers.find(function(x) { return x.id === custId; });
      if (c) {
        c.status = c.status === 'Active' ? 'Blocked' : 'Active';
        showToast('Customer ' + c.name + ' is now ' + c.status);
        renderCurrentTab();
      }
    }

    function setVideoSourceMode(mode) {
      activeVideoSourceMode = mode;
      const tabYt = document.getElementById('tab-yt');
      const tabFile = document.getElementById('tab-file');
      const tabCloud = document.getElementById('tab-cloud');
      const ytGroup = document.getElementById('yt-url-group');
      const fileGroup = document.getElementById('file-upload-group');

      if (tabYt && tabFile && tabCloud) {
        tabYt.className = mode === 'youtube' ? 'btn-primary' : 'view-all-btn';
        tabYt.style.background = mode === 'youtube' ? '#DC2626' : '';
        tabFile.className = mode === 'file' ? 'btn-primary' : 'view-all-btn';
        tabFile.style.background = mode === 'file' ? '#9333EA' : '';
        tabCloud.className = mode === 'cloud' ? 'btn-primary' : 'view-all-btn';
        tabCloud.style.background = mode === 'cloud' ? '#2563EB' : '';
      }

      if (ytGroup && fileGroup) {
        if (mode === 'youtube' || mode === 'cloud') {
          ytGroup.style.display = 'block';
          fileGroup.style.display = 'none';
        } else {
          ytGroup.style.display = 'none';
          fileGroup.style.display = 'block';
        }
      }
    }

    function handleLocalVideoSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (file) {
        selectedVideoFileName = file.name;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        const nameEl = document.getElementById('file-chosen-name');
        if (nameEl) {
          nameEl.innerHTML = '✓ Selected: ' + file.name + ' (' + sizeMb + ' MB)';
          nameEl.style.color = '#34D399';
        }
        showToast('Recorded video loaded: ' + file.name);
      }
    }

    function handleLocalPdfSelected(e) {
      const file = e.target.files && e.target.files[0];
      if (file) {
        selectedPdfFileName = file.name;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        const nameEl = document.getElementById('pdf-chosen-name');
        if (nameEl) {
          nameEl.innerHTML = '✓ Attached: ' + file.name + ' (' + sizeMb + ' MB)';
          nameEl.style.color = '#34D399';
        }
        showToast('PDF Attached: ' + file.name);
      }
    }

    function setQuestionBuilderType(type) {
      currentTestQType = type;
      document.querySelectorAll('.q-type-btn').forEach(function(b) { b.classList.remove('active'); });
      const activeBtn = document.getElementById('qb-btn-' + type);
      if (activeBtn) activeBtn.classList.add('active');

      const box = document.getElementById('q-dynamic-fields');
      if (!box) return;

      if (type === 'mcq') {
        box.innerHTML = '<div class="form-group"><label class="form-label">MCQ Question Statement</label><textarea id="q-mcq-text" rows="2" class="form-textarea" placeholder="e.g. In the absence of partnership deed, interest on partner loan is provided at what rate?"></textarea></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;"><input type="text" id="q-mcq-a" class="form-input" placeholder="Option A: 6% p.a."><input type="text" id="q-mcq-b" class="form-input" placeholder="Option B: 10% p.a."><input type="text" id="q-mcq-c" class="form-input" placeholder="Option C: 12% p.a."><input type="text" id="q-mcq-d" class="form-input" placeholder="Option D: No interest"></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.75rem;"><div class="form-group"><label class="form-label">Correct Option</label><select id="q-mcq-ans" class="form-select"><option value="A">Option A</option><option value="B">Option B</option><option value="C">Option C</option><option value="D">Option D</option></select></div><div class="form-group"><label class="form-label">Marks</label><input type="number" id="q-marks" class="form-input" value="1"></div></div>';
      } else if (type === 'tf') {
        box.innerHTML = '<div class="form-group"><label class="form-label">True / False Statement</label><textarea id="q-tf-text" rows="2" class="form-textarea" placeholder="e.g. Principles of management are rigid prescriptions like pure scientific principles."></textarea></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;"><div class="form-group"><label class="form-label">Correct Answer</label><select id="q-tf-ans" class="form-select"><option value="True">✓ TRUE</option><option value="False">✕ FALSE</option></select></div><div class="form-group"><label class="form-label">Marks</label><input type="number" id="q-marks" class="form-input" value="1"></div></div>';
      } else if (type === 'ar') {
        box.innerHTML = '<div class="form-group"><label class="form-label">Assertion Statement (A)</label><textarea id="q-ar-a" rows="2" class="form-textarea" placeholder="e.g. Depreciation on fixed assets is added back in Cash Flow Operating Activities."></textarea></div><div class="form-group"><label class="form-label">Reason Statement (R)</label><textarea id="q-ar-r" rows="2" class="form-textarea" placeholder="e.g. Depreciation is a non-cash expense and does not involve cash outflow."></textarea></div><div class="form-group"><label class="form-label">Correct Standard Choice</label><select id="q-ar-ans" class="form-select"><option value="both_true_correct_explanation">(a) Both (A) and (R) are true and (R) is correct explanation of (A)</option><option value="both_true_not_correct_explanation">(b) Both (A) and (R) are true but (R) is NOT correct explanation</option><option value="a_true_r_false">(c) Assertion (A) is true but Reason (R) is false</option><option value="a_false_r_true">(d) Assertion (A) is false but Reason (R) is true</option></select></div>';
      } else if (type === 'match') {
        box.innerHTML = '<div class="form-group"><label class="form-label">Matching Question Title</label><input type="text" id="q-match-text" class="form-input" placeholder="Match Column I with Column II definitions:"></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;"><input type="text" id="q-m-a" class="form-input" placeholder="Col I: (A) Planning"><input type="text" id="q-m-1" class="form-input" placeholder="Col II: (i) Goal Setting"><input type="text" id="q-m-b" class="form-input" placeholder="Col I: (B) Organising"><input type="text" id="q-m-2" class="form-input" placeholder="Col II: (ii) Grouping Activities"><input type="text" id="q-m-c" class="form-input" placeholder="Col I: (C) Directing"><input type="text" id="q-m-3" class="form-input" placeholder="Col II: (iii) Leading & Motivating"><input type="text" id="q-m-d" class="form-input" placeholder="Col I: (D) Controlling"><input type="text" id="q-m-4" class="form-input" placeholder="Col II: (iv) Performance Comparison"></div><div class="form-group" style="margin-top:0.75rem;"><label class="form-label">Correct Match Sequence Code</label><input type="text" id="q-match-code" class="form-input" value="A-i, B-ii, C-iii, D-iv" placeholder="e.g. A-i, B-ii, C-iii, D-iv"></div>';
      }
    }

    function addDraftQuestion() {
      let qObj = { type: currentTestQType, marks: 1 };
      if (currentTestQType === 'mcq') {
        const text = document.getElementById('q-mcq-text') ? document.getElementById('q-mcq-text').value : '';
        if (!text) { alert('Please enter question statement'); return; }
        qObj.statement = text;
        qObj.ans = document.getElementById('q-mcq-ans') ? document.getElementById('q-mcq-ans').value : 'A';
      } else if (currentTestQType === 'tf') {
        const text = document.getElementById('q-tf-text') ? document.getElementById('q-tf-text').value : '';
        if (!text) { alert('Please enter statement'); return; }
        qObj.statement = text;
        qObj.ans = document.getElementById('q-tf-ans') ? document.getElementById('q-tf-ans').value : 'True';
      } else if (currentTestQType === 'ar') {
        const a = document.getElementById('q-ar-a') ? document.getElementById('q-ar-a').value : '';
        const r = document.getElementById('q-ar-r') ? document.getElementById('q-ar-r').value : '';
        if (!a || !r) { alert('Please enter both Assertion and Reason statements'); return; }
        qObj.statement = '(A) ' + a + ' | (R) ' + r;
        qObj.ans = 'CBSE Standard Choice';
      } else if (currentTestQType === 'match') {
        const m = document.getElementById('q-match-text') ? document.getElementById('q-match-text').value : 'Match Columns';
        qObj.statement = m;
        qObj.ans = document.getElementById('q-match-code') ? document.getElementById('q-match-code').value : 'A-i, B-ii';
      }

      draftTestQuestions.push(qObj);
      showToast('Added ' + currentTestQType.toUpperCase() + ' question (Total: ' + draftTestQuestions.length + ')');
      renderDraftQuestionsList();
    }

    function renderDraftQuestionsList() {
      const listEl = document.getElementById('draft-questions-list');
      const countEl = document.getElementById('q-counter-badge');
      if (countEl) countEl.innerText = draftTestQuestions.length + ' Questions Added';
      if (!listEl) return;

      if (draftTestQuestions.length === 0) {
        listEl.innerHTML = '<div style="color:var(--text-muted); font-size:0.75rem; text-align:center; padding:0.75rem;">No questions added yet.</div>';
        return;
      }

      let html = '';
      for (let i = 0; i < draftTestQuestions.length; i++) {
        const q = draftTestQuestions[i];
        html += '<div style="display:flex; justify-content:space-between; align-items:center; background:#0E121B; padding:0.5rem 0.75rem; border-radius:8px; margin-bottom:0.35rem; border:1px solid var(--card-border); font-size:0.75rem;"><div><span style="color:#818CF8; font-weight:800; text-transform:uppercase;">[' + q.type + ']</span> <span style="color:#E2E8F0;">' + (q.statement.slice(0, 45)) + '...</span></div><button type="button" onclick="removeDraftQ(' + i + ')" style="background:transparent; border:none; color:#EF4444; cursor:pointer; font-weight:700;">✕</button></div>';
      }
      listEl.innerHTML = html;
    }

    function removeDraftQ(idx) {
      draftTestQuestions.splice(idx, 1);
      renderDraftQuestionsList();
    }

    function loadSampleQuestions() {
      draftTestQuestions = [
        { type: 'mcq', statement: 'Interest on partner loan in absence of deed?', ans: '6% p.a.', marks: 1 },
        { type: 'tf', statement: 'Management principles are rigid prescriptions.', ans: 'False', marks: 1 },
        { type: 'ar', statement: 'Assertion: Depreciation is added back. Reason: Non-cash expense.', ans: 'Both True', marks: 1 },
        { type: 'match', statement: 'Match Functions of Management (Planning, Organising, Directing, Controlling)', ans: 'A-i, B-ii, C-iii, D-iv', marks: 2 }
      ];
      renderDraftQuestionsList();
      showToast('Loaded 4 Sample Board Questions!');
    }

    function openModal(type) {
      const modal = document.getElementById('action-modal');
      const content = document.getElementById('modal-box-content');
      modal.style.display = 'flex';

      if (type === 'add-order') {
        content.innerHTML = '<div class="modal-header"><h3 class="modal-title">Create Manual Order</h3><button class="close-btn" onclick="closeModal()">✕</button></div><form onsubmit="submitNewOrder(event)"><div class="form-group"><label class="form-label">Customer Name</label><input type="text" id="new-ord-cust" class="form-input" required placeholder="e.g. Dhairya Gulati"></div><div class="form-group"><label class="form-label">Item / Material</label><input type="text" id="new-ord-item" class="form-input" required placeholder="e.g. Class 12 Accountancy Guide"></div><div class="form-group"><label class="form-label">Total Amount (₹)</label><input type="number" id="new-ord-total" class="form-input" required value="350"></div><button type="submit" class="btn-primary" style="width:100%; padding:0.75rem;">Create Order</button></form>';
      } else if (type === 'add-lecture') {
        content.innerHTML = '<div class="modal-header"><h3 class="modal-title">Upload Video Lecture</h3><button class="close-btn" onclick="closeModal()">✕</button></div><form onsubmit="submitNewLecture(event)"><div class="form-group"><label class="form-label">Video Source Type</label><div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem;"><button type="button" id="tab-yt" class="btn-primary" style="background:#DC2626; padding:0.45rem; font-size:0.75rem;" onclick="setVideoSourceMode(\\'youtube\\')">🔴 YouTube / Vimeo</button><button type="button" id="tab-file" class="view-all-btn" style="padding:0.45rem; font-size:0.75rem;" onclick="setVideoSourceMode(\\'file\\')">📁 Recorded Video File</button><button type="button" id="tab-cloud" class="view-all-btn" style="padding:0.45rem; font-size:0.75rem;" onclick="setVideoSourceMode(\\'cloud\\')">☁️ Cloud / AWS S3</button></div></div><div class="form-group" id="yt-url-group"><label class="form-label">YouTube / Vimeo Embed URL</label><input type="text" id="new-lec-url" class="form-input" placeholder="https://www.youtube.com/watch?v=... or embed URL" value="https://www.youtube.com/embed/dQw4w9WgXcQ"><span style="font-size:0.7rem; color:var(--text-muted); margin-top:0.25rem; display:block;">Auto-converts standard watch URLs into responsive embeds.</span></div><div class="form-group" id="file-upload-group" style="display:none;"><label class="form-label">Choose Recorded Video File (.mp4, .mov, .webm, .mkv)</label><div style="border:2px dashed var(--card-border); border-radius:12px; padding:1.2rem; text-align:center; background:#0E121B;"><div style="font-size:1.5rem; margin-bottom:0.3rem;">🎥</div><div id="file-chosen-name" style="font-size:0.8rem; font-weight:700; color:#818CF8; margin-bottom:0.4rem;">Select local video recording</div><input type="file" id="local-video-input" accept="video/*" style="display:none;" onchange="handleLocalVideoSelected(event)"><label for="local-video-input" class="btn-primary" style="cursor:pointer; display:inline-block; font-size:0.75rem;">Browse Recorded Video</label></div></div><div class="form-group"><label class="form-label">Lecture Topic / Title</label><input type="text" id="new-lec-title" class="form-input" required placeholder="e.g. Partnership Appropriation Account"></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;"><div class="form-group"><label class="form-label">Subject</label><select id="new-lec-sub" class="form-select"><option>Accountancy</option><option>Business Studies</option><option>Macroeconomics</option><option>Commercial Law</option></select></div><div class="form-group"><label class="form-label">Duration</label><input type="text" id="new-lec-dur" class="form-input" placeholder="e.g. 52 mins" value="50 mins"></div></div><div class="form-group" style="background:#0E121B; padding:0.75rem; border-radius:10px; border:1px solid var(--card-border);"><label style="display:flex; align-items:center; gap:0.5rem; font-size:0.8rem; font-weight:700; color:white; cursor:pointer;"><input type="checkbox" id="new-lec-free" checked><span>Free Preview Demo (Unlocked for all students)</span></label></div><button type="submit" class="btn-primary" style="width:100%; padding:0.75rem;">Publish Video Lecture</button></form>';
      } else if (type === 'add-book') {
        content.innerHTML = '<div class="modal-header"><h3 class="modal-title">Upload & Publish Book / PDF</h3><button class="close-btn" onclick="closeModal()">✕</button></div><form onsubmit="submitNewBook(event)"><div class="form-group"><label class="form-label">Book / Study Material Title</label><input type="text" id="new-bk-title" class="form-input" required placeholder="e.g. Class 12 Accountancy Board Master Guide 2026"></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;"><div class="form-group"><label class="form-label">Author / Faculty</label><input type="text" id="new-bk-author" class="form-input" required value="Prof. S. K. Sharma"></div><div class="form-group"><label class="form-label">Subject</label><select id="new-bk-subject" class="form-select"><option>Accountancy</option><option>Business Studies</option><option>Economics</option><option>Commercial Law</option></select></div></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;"><div class="form-group"><label class="form-label">Selling Price (₹)</label><input type="number" id="new-bk-price" class="form-input" required value="449"></div><div class="form-group"><label class="form-label">Format & Total Pages</label><input type="text" id="new-bk-format" class="form-input" value="Paperback + eBook (350 pages)"></div></div><div class="form-group"><label class="form-label">Attach PDF Document</label><div style="border:2px dashed var(--card-border); border-radius:12px; padding:1rem; text-align:center; background:#0E121B;"><div id="pdf-chosen-name" style="font-size:0.8rem; font-weight:700; color:#818CF8; margin-bottom:0.3rem;">Choose PDF Document (.pdf)</div><input type="file" id="local-pdf-input" accept=".pdf" style="display:none;" onchange="handleLocalPdfSelected(event)"><label for="local-pdf-input" class="btn-primary" style="cursor:pointer; display:inline-block; font-size:0.75rem;">Browse PDF File</label></div></div><div class="form-group" style="background:#0E121B; padding:0.75rem; border-radius:10px; border:1px solid rgba(16, 185, 129, 0.3);"><span style="color:#34D399; font-size:0.75rem; font-weight:700;">✓ 5-Page Sample Viewer will be auto-configured (Pages 1–5 Free, Pages 6+ Locked).</span></div><button type="submit" class="btn-primary" style="width:100%; padding:0.75rem;">Publish Book to Store</button></form>';
      } else if (type === 'add-test') {
        content.innerHTML = '<div class="modal-header"><h3 class="modal-title">Create CBT Mock Test Series & Question Bank</h3><button class="close-btn" onclick="closeModal()">✕</button></div><form onsubmit="submitNewTest(event)"><div class="form-group"><label class="form-label">Test Paper Title</label><input type="text" id="new-ts-title" class="form-input" required placeholder="e.g. Class 12 Accountancy Board Full Mock 2"></div><div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;"><div class="form-group"><label class="form-label">Duration</label><input type="text" id="new-ts-dur" class="form-input" value="180 mins"></div><div class="form-group"><label class="form-label">Total Marks</label><input type="number" id="new-ts-marks" class="form-input" value="80"></div></div><div style="border-top:1px solid var(--card-border); padding-top:1rem; margin-top:1rem;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;"><span style="font-size:0.82rem; font-weight:800; color:#818CF8;">➕ Add Questions to Exam Paper</span><button type="button" onclick="loadSampleQuestions()" class="view-all-btn" style="font-size:0.72rem;">✨ Load 4 Sample Questions</button></div><div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.4rem; margin-bottom:0.85rem;"><button type="button" id="qb-btn-mcq" class="q-type-btn active" onclick="setQuestionBuilderType(\\'mcq\\')">🔘 MCQ</button><button type="button" id="qb-btn-tf" class="q-type-btn" onclick="setQuestionBuilderType(\\'tf\\')">⚖️ T/F</button><button type="button" id="qb-btn-ar" class="q-type-btn" onclick="setQuestionBuilderType(\\'ar\\')">🧩 A&R</button><button type="button" id="qb-btn-match" class="q-type-btn" onclick="setQuestionBuilderType(\\'match\\')">🔗 Match</button></div><div id="q-dynamic-fields" style="background:#0E121B; padding:0.9rem; border-radius:12px; border:1px solid var(--card-border); margin-bottom:0.85rem;"></div><button type="button" onclick="addDraftQuestion()" class="btn-primary" style="width:100%; margin-bottom:1rem; font-size:0.78rem;">+ Insert Question into Test</button><div style="margin-bottom:0.5rem; display:flex; justify-content:space-between;"><span style="font-size:0.75rem; font-weight:700; color:#CBD5E1;">Questions in Paper:</span><span id="q-counter-badge" style="font-size:0.75rem; color:#34D399; font-weight:800;">0 Questions Added</span></div><div id="draft-questions-list" style="max-height:140px; overflow-y:auto;"></div></div><button type="submit" class="btn-primary" style="width:100%; padding:0.75rem; margin-top:1rem;">Publish Test Paper</button></form>';
        setQuestionBuilderType('mcq');
        renderDraftQuestionsList();
      } else if (type === 'add-banner') {
        content.innerHTML = '<div class="modal-header"><h3 class="modal-title">Upload Promotional Banner</h3><button class="close-btn" onclick="closeModal()">✕</button></div><form onsubmit="submitNewBanner(event)"><div class="form-group"><label class="form-label">Banner Campaign Title</label><input type="text" id="new-bn-title" class="form-input" required placeholder="e.g. Board Toppers Fast-Track Batch"></div><div class="form-group"><label class="form-label">Target Page Link</label><input type="text" id="new-bn-link" class="form-input" required value="/courses"></div><button type="submit" class="btn-primary" style="width:100%; padding:0.75rem;">Activate Banner</button></form>';
      } else if (type === 'add-promo') {
        content.innerHTML = '<div class="modal-header"><h3 class="modal-title">Create Promo Code</h3><button class="close-btn" onclick="closeModal()">✕</button></div><form onsubmit="submitNewPromo(event)"><div class="form-group"><label class="form-label">Coupon Code</label><input type="text" id="new-promo-code" class="form-input" required placeholder="e.g. FESTIVE50"></div><div class="form-group"><label class="form-label">Discount Text</label><input type="text" id="new-promo-disc" class="form-input" required placeholder="e.g. 50% OFF"></div><button type="submit" class="btn-primary" style="width:100%; padding:0.75rem;">Activate Code</button></form>';
      }
    }

    function closeModal() {
      document.getElementById('action-modal').style.display = 'none';
    }

    function submitNewOrder(e) {
      e.preventDefault();
      const cust = document.getElementById('new-ord-cust').value;
      const item = document.getElementById('new-ord-item').value;
      const total = Number(document.getElementById('new-ord-total').value) || 150;
      orders.unshift({
        id: '#' + (orders.length + 1),
        customer: cust,
        email: cust.toLowerCase().replace(' ', '.') + '@example.com',
        total: total,
        status: 'PENDING',
        date: new Date().toISOString().split('T')[0],
        item: item
      });
      closeModal();
      showToast('New order created for ' + cust);
      renderCurrentTab();
    }

    function submitNewLecture(e) {
      e.preventDefault();
      const title = document.getElementById('new-lec-title').value;
      const sub = document.getElementById('new-lec-sub').value;
      const dur = (document.getElementById('new-lec-dur') && document.getElementById('new-lec-dur').value) || '50 mins';
      const isFree = document.getElementById('new-lec-free') ? document.getElementById('new-lec-free').checked : true;
      let videoSource = 'YouTube Masterclass';

      if (activeVideoSourceMode === 'file' && selectedVideoFileName) {
        videoSource = 'Recorded File (' + selectedVideoFileName + ')';
      } else if (document.getElementById('new-lec-url')) {
        videoSource = document.getElementById('new-lec-url').value;
      }

      lectures.unshift({
        id: 'LEC-0' + (lectures.length + 1),
        title: title,
        grade: 'Class 12',
        subject: sub,
        instructor: 'Prof. S. K. Sharma',
        duration: dur,
        isFree: isFree,
        views: '0',
        source: videoSource
      });
      closeModal();
      showToast('Video Lecture published (' + (isFree ? 'Free Preview' : 'VIP Locked') + ')!');
      renderCurrentTab();
    }

    function submitNewBook(e) {
      e.preventDefault();
      const title = document.getElementById('new-bk-title').value;
      const author = document.getElementById('new-bk-author').value || 'Prof. S. K. Sharma';
      const price = Number(document.getElementById('new-bk-price').value) || 449;
      const format = document.getElementById('new-bk-format').value || 'Paperback + eBook';

      books.unshift({
        id: 'BK-0' + (books.length + 1),
        title: title,
        author: author,
        price: price,
        sales: 0,
        format: format,
        pages: 350
      });
      closeModal();
      showToast('Book "' + title + '" published to store!');
      renderCurrentTab();
    }

    function submitNewTest(e) {
      e.preventDefault();
      const title = document.getElementById('new-ts-title').value;
      const dur = document.getElementById('new-ts-dur').value || '180 mins';
      const marks = Number(document.getElementById('new-ts-marks').value) || 80;
      const qCount = draftTestQuestions.length > 0 ? draftTestQuestions.length : 34;

      tests.unshift({
        id: 'TS-0' + (tests.length + 1),
        title: title,
        marks: marks,
        duration: dur,
        qCount: qCount,
        attempts: 0,
        avgScore: 'N/A',
        isFree: true
      });
      closeModal();
      showToast('Mock Test Series created with ' + qCount + ' questions!');
      draftTestQuestions = [];
      renderCurrentTab();
    }

    function submitNewBanner(e) {
      e.preventDefault();
      const title = document.getElementById('new-bn-title').value;
      const link = document.getElementById('new-bn-link').value || '/courses';

      banners.unshift({
        id: 'BN-0' + (banners.length + 1),
        title: title,
        status: 'LIVE',
        link: link
      });
      closeModal();
      showToast('Promotional Banner activated!');
      renderCurrentTab();
    }

    function submitNewPromo(e) {
      e.preventDefault();
      const code = document.getElementById('new-promo-code').value.toUpperCase();
      const disc = document.getElementById('new-promo-disc').value;
      promos.unshift({ code: code, discount: disc, usage: '0 uses', status: 'ACTIVE' });
      closeModal();
      showToast('Promo code ' + code + ' activated!');
      renderCurrentTab();
    }

    function switchTab(tabName) {
      currentTab = tabName;
      document.querySelectorAll('.nav-item').forEach(function(el) { el.classList.remove('active'); });
      const activeNav = document.getElementById('nav-' + tabName);
      if (activeNav) activeNav.classList.add('active');

      const titleMap = {
        'dashboard': 'Dashboard',
        'orders': 'Orders Management',
        'customers': 'Customers & Students Directory',
        'lectures': 'Video Lectures & Masterclasses',
        'books': 'Books & Study Material Catalog',
        'tests': 'CBT Mock Test Series',
        'memberships': 'Memberships & VIP Passes',
        'banners': 'Home Promotional Banners',
        'promos': 'Promo & Coupon Codes',
        'products': 'Store Products Catalog',
        'settings': 'Platform & API Settings'
      };
      document.getElementById('page-heading').innerText = titleMap[tabName] || 'Dashboard';
      renderCurrentTab();
    }

    function renderCurrentTab() {
      const container = document.getElementById('dynamic-content');
      let totalRev = 0;
      for (let i = 0; i < orders.length; i++) { totalRev += orders[i].total; }
      let pendingCount = 0;
      for (let j = 0; j < orders.length; j++) { if (orders[j].status === 'PENDING') pendingCount++; }
      document.getElementById('pending-badge').innerText = pendingCount;

      if (currentTab === 'dashboard') {
        let orderRows = '';
        const limit = Math.min(orders.length, 5);
        for (let i = 0; i < limit; i++) {
          const o = orders[i];
          orderRows += '<tr><td class="order-id">' + o.id + '</td><td class="customer-name">' + o.customer + '</td><td class="order-total">₹' + o.total + '</td><td><span class="status-badge ' + (o.status === 'PENDING' ? 'status-pending' : 'status-delivered') + '" onclick="toggleOrderStatus(\\'' + o.id + '\\')" title="Click to toggle status">' + o.status + '</span></td></tr>';
        }

        container.innerHTML = '<div class="metrics-grid"><div class="metric-card"><div class="metric-icon-box icon-blue">🛍️</div><div class="metric-info"><h3>' + orders.length + '</h3><p>Total Orders</p></div></div><div class="metric-card"><div class="metric-icon-box icon-green" style="font-weight: 800; font-size: 1.1rem;">Rs</div><div class="metric-info"><h3>₹' + totalRev + '</h3><p>Total Revenue</p></div></div><div class="metric-card"><div class="metric-icon-box icon-orange">⏱️</div><div class="metric-info"><h3>' + pendingCount + '</h3><p>Pending Orders</p></div></div><div class="metric-card"><div class="metric-icon-box icon-purple">👥</div><div class="metric-info"><h3>11,428</h3><p>Active Students</p></div></div></div><div class="table-card"><div class="table-header"><div class="table-title"><span class="flame">🔥</span><span>Recent Orders</span></div><div class="header-actions"><button class="btn-primary" onclick="openModal(\\'add-order\\')">+ Create Order</button><button class="view-all-btn" onclick="switchTab(\\'orders\\')">View All</button></div></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>ORDER ID</th><th>CUSTOMER</th><th>TOTAL</th><th>STATUS (CLICK TO TOGGLE)</th></tr></thead><tbody>' + orderRows + '</tbody></table></div></div>';
      } else if (currentTab === 'orders') {
        let rows = '';
        for (let i = 0; i < orders.length; i++) {
          const o = orders[i];
          rows += '<tr><td class="order-id">' + o.id + '</td><td><div class="customer-name">' + o.customer + '</div><div style="font-size:0.75rem; color:var(--text-muted);">' + o.email + '</div></td><td style="color:#CBD5E1;">' + o.item + '</td><td style="color:var(--text-muted); font-size:0.8rem;">' + o.date + '</td><td class="order-total">₹' + o.total + '</td><td><span class="status-badge ' + (o.status === 'PENDING' ? 'status-pending' : 'status-delivered') + '" onclick="toggleOrderStatus(\\'' + o.id + '\\')">' + o.status + '</span></td></tr>';
        }
        container.innerHTML = '<div class="table-card"><div class="table-header"><div class="table-title"><span>🛍️ All Customer Orders (' + orders.length + ')</span></div><button class="btn-primary" onclick="openModal(\\'add-order\\')">+ New Order</button></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>ORDER ID</th><th>CUSTOMER & EMAIL</th><th>ITEM PURCHASED</th><th>DATE</th><th>TOTAL</th><th>STATUS</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      } else if (currentTab === 'customers') {
        let rows = '';
        for (let i = 0; i < customers.length; i++) {
          const c = customers[i];
          rows += '<tr><td><div class="customer-name">' + c.name + '</div><div style="font-size:0.75rem; color:var(--text-muted);">' + c.email + '</div></td><td><span style="font-weight:700; color:#818CF8;">' + c.grade + '</span></td><td>' + c.orders + ' orders</td><td class="order-total">' + c.spent + '</td><td><span class="status-badge status-shipped">' + c.plan + '</span></td><td><span class="status-badge ' + (c.status === 'Active' ? 'status-delivered' : 'status-pending') + '" onclick="toggleCustomerStatus(\\'' + c.id + '\\')">' + c.status + '</span></td></tr>';
        }
        container.innerHTML = '<div class="table-card"><div class="table-header"><div class="table-title"><span>👥 Registered Students & Customers (' + customers.length + ')</span></div><button class="view-all-btn" onclick="showToast(\\'Customer list synced with MongoDB Atlas.\\')">Sync DB</button></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>USER</th><th>GRADE / CLASS</th><th>ORDERS</th><th>TOTAL SPENT</th><th>MEMBERSHIP</th><th>STATUS (CLICK TO TOGGLE)</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      } else if (currentTab === 'lectures') {
        let rows = '';
        for (let i = 0; i < lectures.length; i++) {
          const l = lectures[i];
          rows += '<tr><td><div class="customer-name">' + l.title + '</div><div style="font-size:0.75rem; color:#818CF8; font-weight:700;">' + l.subject + '</div></td><td>' + l.grade + '</td><td>' + l.instructor + '</td><td>' + l.duration + ' • ' + l.views + '</td><td><span class="status-badge ' + (l.isFree ? 'status-delivered' : 'status-pending') + '" onclick="toggleLectureLock(\\'' + l.id + '\\')">' + (l.isFree ? 'FREE DEMO' : 'VIP LOCKED') + '</span></td></tr>';
        }
        container.innerHTML = '<div class="table-card"><div class="table-header"><div class="table-title"><span>🎥 HD Video Lectures & Masterclasses (' + lectures.length + ')</span></div><button class="btn-primary" onclick="openModal(\\'add-lecture\\')">+ Upload Lecture</button></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>TOPIC & SUBJECT</th><th>GRADE</th><th>INSTRUCTOR</th><th>DURATION & VIEWS</th><th>ACCESS LOCK (CLICK TO TOGGLE)</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      } else if (currentTab === 'books') {
        let rows = '';
        for (let i = 0; i < books.length; i++) {
          const b = books[i];
          rows += '<tr><td><div class="customer-name">' + b.title + '</div><div style="font-size:0.75rem; color:var(--text-muted);">By ' + b.author + '</div></td><td>' + b.format + ' • ' + b.pages + ' pages</td><td class="order-total">₹' + b.price + '</td><td>' + b.sales + ' sold</td><td><span class="status-badge status-delivered">5-Page Preview Active</span></td></tr>';
        }
        container.innerHTML = '<div class="table-card"><div class="table-header"><div class="table-title"><span>📚 Published Books & Study Materials (' + books.length + ')</span></div><button class="btn-primary" onclick="openModal(\\'add-book\\')">+ Add Book / PDF</button></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>TITLE & AUTHOR</th><th>FORMAT & PAGES</th><th>PRICE</th><th>COPIES SOLD</th><th>PREVIEW STATUS</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      } else if (currentTab === 'tests') {
        let rows = '';
        for (let i = 0; i < tests.length; i++) {
          const t = tests[i];
          rows += '<tr><td class="customer-name">' + t.title + '</td><td>' + t.marks + ' Marks • ' + t.duration + '</td><td><span style="color:#818CF8; font-weight:800;">' + (t.qCount || 34) + ' Questions</span></td><td>' + t.attempts + ' students</td><td style="color:#34D399; font-weight:700;">' + t.avgScore + '</td><td><span class="status-badge ' + (t.isFree ? 'status-delivered' : 'status-pending') + '">' + (t.isFree ? 'FREE' : 'VIP LOCKED') + '</span></td></tr>';
        }
        container.innerHTML = '<div class="table-card"><div class="table-header"><div class="table-title"><span>📝 CBT Mock Test Series (' + tests.length + ')</span></div><button class="btn-primary" onclick="openModal(\\'add-test\\')">+ Create Test</button></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>TEST PAPER TITLE</th><th>MARKS & DURATION</th><th>QUESTIONS</th><th>ATTEMPTS</th><th>AVG SCORE</th><th>ACCESS</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      } else if (currentTab === 'memberships') {
        container.innerHTML = '<div class="metrics-grid"><div class="metric-card"><div class="metric-icon-box icon-purple">👑</div><div class="metric-info"><h3>₹999</h3><p>Monthly Pro Pass (280 Users)</p></div></div><div class="metric-card"><div class="metric-icon-box icon-blue">⚡</div><div class="metric-info"><h3>₹2,499</h3><p>3-Month Booster (410 Users)</p></div></div><div class="metric-card"><div class="metric-icon-box icon-orange">🏆</div><div class="metric-info"><h3>₹6,999</h3><p>Annual VIP Pass (190 Users)</p></div></div><div class="metric-card"><div class="metric-icon-box icon-green" style="font-weight:800; font-size:1.1rem;">Rs</div><div class="metric-info"><h3>₹26.3L</h3><p>Gross Subscriptions</p></div></div></div><div class="table-card" style="padding:1.75rem;"><div class="table-title" style="margin-bottom:1rem;"><span>👑 Instant Student VIP Pass Grant Tool</span></div><p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1rem;">Enter any student email to unlock all video lectures, mock test simulators, and handwritten notes PDF.</p><div style="display:flex; gap:0.75rem; flex-wrap:wrap;"><input type="email" id="grant-email-input" class="form-input" style="flex:1; min-width:240px;" placeholder="e.g. student@example.com"><select id="grant-tier-select" class="form-select" style="width:200px;"><option>Annual VIP Topper Plan</option><option>Monthly Pro Pass</option><option>3-Month Booster</option></select><button class="btn-primary" onclick="grantVipPass()">Grant Membership</button></div></div>';
      } else if (currentTab === 'banners') {
        let rows = '';
        for (let i = 0; i < banners.length; i++) {
          const b = banners[i];
          rows += '<tr><td class="customer-name">' + b.title + '</td><td style="color:#38BDF8; font-family:\\'JetBrains Mono\\';">' + b.link + '</td><td><span class="status-badge ' + (b.status === 'LIVE' ? 'status-delivered' : 'status-pending') + '">' + b.status + '</span></td></tr>';
        }
        container.innerHTML = '<div class="table-card"><div class="table-header"><div class="table-title"><span>🖼️ Promotional Home Banners (' + banners.length + ')</span></div><button class="btn-primary" onclick="openModal(\\'add-banner\\')">+ Upload Banner</button></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>BANNER TITLE</th><th>TARGET LINK</th><th>STATUS</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      } else if (currentTab === 'promos') {
        let rows = '';
        for (let i = 0; i < promos.length; i++) {
          const p = promos[i];
          rows += '<tr><td class="order-id" style="font-size:0.95rem;">' + p.code + '</td><td class="customer-name">' + p.discount + '</td><td>' + p.usage + '</td><td><span class="status-badge ' + (p.status === 'ACTIVE' ? 'status-delivered' : 'status-pending') + '">' + p.status + '</span></td></tr>';
        }
        container.innerHTML = '<div class="table-card"><div class="table-header"><div class="table-title"><span>🏷️ Promo & Coupon Codes (' + promos.length + ')</span></div><button class="btn-primary" onclick="openModal(\\'add-promo\\')">+ Create Code</button></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>PROMO CODE</th><th>DISCOUNT OFFER</th><th>USAGE COUNT</th><th>STATUS</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      } else if (currentTab === 'products') {
        let rows = '';
        for (let i = 0; i < books.length; i++) {
          const b = books[i];
          rows += '<tr><td class="customer-name">' + b.title + '</td><td class="order-total">₹' + b.price + '</td><td>In Stock (Digital / Print-on-Demand)</td><td><span class="status-badge status-delivered">ACTIVE</span></td></tr>';
        }
        container.innerHTML = '<div class="table-card"><div class="table-header"><div class="table-title"><span>📦 Store Products & Book Bundles (' + books.length + ')</span></div><button class="btn-primary" onclick="openModal(\\'add-book\\')">+ Add Product</button></div><div style="overflow-x: auto;"><table class="data-table"><thead><tr><th>PRODUCT</th><th>PRICE</th><th>INVENTORY</th><th>STATUS</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
      } else if (currentTab === 'settings') {
        container.innerHTML = '<div class="table-card" style="padding:2rem;"><div class="table-title" style="margin-bottom:1.5rem;"><span>⚙️ Platform & API Server Configuration</span></div><div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem;"><div style="background:#0E121B; padding:1.2rem; border-radius:14px; border:1px solid var(--card-border);"><div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Database Engine</div><div style="font-size:1.1rem; font-weight:800; color:#34D399; margin-top:0.25rem;">MongoDB Atlas (Synced)</div><div style="font-size:0.75rem; color:#64748B; margin-top:0.25rem;">Cloud Cluster Connected & Operational</div></div><div style="background:#0E121B; padding:1.2rem; border-radius:14px; border:1px solid var(--card-border);"><div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Super Admin Account</div><div style="font-size:1.1rem; font-weight:800; color:#38BDF8; margin-top:0.25rem;">dgulati352@gmail.com</div><div style="font-size:0.75rem; color:#64748B; margin-top:0.25rem;">Full Super Administrator Privileges</div></div><div style="background:#0E121B; padding:1.2rem; border-radius:14px; border:1px solid var(--card-border);"><div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">CORS & API Security</div><div style="font-size:1.1rem; font-weight:800; color:#A78BFA; margin-top:0.25rem;">Allow-All (*) Active</div><div style="font-size:0.75rem; color:#64748B; margin-top:0.25rem;">Frontend origin verified with credentials</div></div></div></div>';
      }
    }

    function grantVipPass() {
      const email = document.getElementById('grant-email-input').value;
      const tier = document.getElementById('grant-tier-select').value;
      if (!email) {
        alert('Please enter student email');
        return;
      }
      customers.push({
        id: 'CUST-0' + (customers.length + 1),
        name: email.split('@')[0],
        email: email,
        grade: 'Class 12',
        orders: 1,
        spent: '₹0 (Granted)',
        status: 'Active',
        plan: tier
      });
      showToast('Successfully granted ' + tier + ' to ' + email);
      document.getElementById('grant-email-input').value = '';
    }

    renderCurrentTab();
  </script>
</body>
</html>
`;
