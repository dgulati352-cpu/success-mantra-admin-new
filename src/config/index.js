import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_ATLAS_URI = 'mongodb+srv://dgulati352_db_user:Jh5D2AL2OiPnR0Bt@cluster0.tvyihes.mongodb.net/success-mantra?retryWrites=true&w=majority';

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'production',
  mongodb: {
    uri: process.env.MONGODB_URI || DEFAULT_ATLAS_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'success-mantra-jwt-secret-key-2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'success-mantra-jwt-refresh-secret-key-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  clientUrl: process.env.CLIENT_URL || '*',
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TSSSbzfqnMRNfR',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'bOEJs5ws33FUqGLMo54rt6Ww'
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM
  }
};