import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './index.js';
import { seedDatabase } from '../utils/seedDatabase.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not supported in environment
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(config.mongodb.uri, opts)
      .then(async (m) => {
        console.log(`MongoDB connected: ${m.connection.host}`);
        try {
          await seedDatabase();
        } catch (err) {
          console.warn('Seed database warning:', err.message);
        }
        return m;
      })
      .catch(async (error) => {
        console.warn(`Could not connect to MongoDB at ${config.mongodb.uri}: ${error.message}`);
        if (!process.env.VERCEL && process.env.NODE_ENV === 'development') {
          try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create({ binary: { version: '4.4.29' } });
            const memoryUri = mongoServer.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`In-Memory MongoDB connected: ${memoryUri}`);
            await seedDatabase();
            return conn;
          } catch (memErr) {
            console.error('In-memory fallback failed:', memErr.message);
          }
        }
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export const disconnectDB = async () => {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
};