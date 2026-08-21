import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './index.js';
import { seedDatabase } from '../utils/seedDatabase.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not supported in environment
}

let isConnected = false;
let mongoServer = null;

export const connectDB = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  // 1. First try connecting to configured URI
  try {
    const conn = await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    await seedDatabase();
    return;
  } catch (error) {
    console.warn(`Could not connect to MongoDB at ${config.mongodb.uri}: ${error.message}`);
    console.log('Starting in-memory MongoDB server as development fallback...');
  }

  // 2. Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '4.4.29'
      }
    });
    const memoryUri = mongoServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    isConnected = true;
    console.log(`In-Memory MongoDB connected: ${memoryUri}`);
    await seedDatabase();
  } catch (err) {
    console.error('Failed to initialize MongoDB (both local and in-memory failed):', err);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  isConnected = false;
  console.log('MongoDB disconnected');
};

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});