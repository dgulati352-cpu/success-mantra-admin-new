import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

let transporter = null;
if (config.email.user && config.email.pass) {
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: { user: config.email.user, pass: config.email.pass }
  });
}

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!transporter) {
      console.log(`[Email Service - Dev Mock] To: ${to} | Subject: ${subject}`);
      return { messageId: 'mock-dev-id' };
    }
    const info = await transporter.sendMail({ from: config.email.from, to, subject, html, text });
    return info;
  } catch (error) {
    console.error('Email send error (non-fatal):', error.message);
    return null;
  }
};

export const sendWelcomeEmail = async (user, verificationUrl) => {
  console.log(`[Verification Link for ${user.email}]: ${verificationUrl}`);
  const html = `<html><body><h1>Welcome ${user.firstName}!</h1><p><a href="${verificationUrl}">Verify Email</a></p></body></html>`;
  return sendEmail({ to: user.email, subject: 'Welcome to Success Mantra', html });
};

export const sendPasswordResetEmail = async (user, resetUrl) => {
  console.log(`[Password Reset Link for ${user.email}]: ${resetUrl}`);
  const html = `<html><body><h1>Reset Password</h1><p><a href="${resetUrl}">Reset Password</a></p></body></html>`;
  return sendEmail({ to: user.email, subject: 'Password Reset Request', html });
};

export const sendOrderConfirmationEmail = async (user, order) => {
  console.log(`[Order Confirmation for ${user.email}]: Order ${order._id}`);
  const html = `<html><body><h1>Order Confirmation</h1><p>Thank you for your order! Order ID: ${order._id}</p></body></html>`;
  return sendEmail({ to: user.email, subject: 'Success Mantra - Order Confirmation', html });
};
