# Success Mantra - Educational Platform Backend API & Admin

Node.js, Express, Socket.IO, and MongoDB Atlas backend powering the Success Mantra educational platform.

## 🚀 Features

- **Authentication & Roles**: JWT authentication (Access & Refresh tokens), cookie handling, role-based access control (Student, VIP, Instructor, Admin).
- **Courses & Lessons**: Course CRUD, curriculum modules, video lessons, and student progress tracking.
- **Live Streaming & Real-time Chat**: Socket.IO integration for live class notifications, viewer tracking, and interactive chat.
- **Stripe Payment & Membership Webhooks**: Subscriptions, checkout sessions, and VIP membership management.
- **Database Resilience**: MongoDB Atlas support with DNS SRV resolution and in-memory development fallback with auto-seeding.

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB / Mongoose (MongoDB Atlas)
- **Real-Time**: Socket.IO
- **Security & Validation**: bcryptjs, jsonwebtoken, express-validator, cookie-parser, express-rate-limit

## 💻 Getting Started

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start server
npm start
```
