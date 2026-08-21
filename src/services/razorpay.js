import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config/index.js';

let razorpayInstance = null;

export const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const keyId = config.razorpay?.keyId || process.env.RAZORPAY_KEY_ID;
    const keySecret = config.razorpay?.keySecret || process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing');
    }

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
};

/**
 * Create a new Razorpay Order
 * @param {Object} options - { amount (in paise, min 100), currency = 'INR', receipt, notes }
 * @returns {Promise<Object>} Razorpay order object
 */
export const createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  // Validate minimum amount (100 paise = 1 INR)
  const amountInPaise = Math.round(Number(amount));
  if (isNaN(amountInPaise) || amountInPaise < 100) {
    throw new Error('Amount must be at least 100 paise (₹1)');
  }

  const razorpay = getRazorpayInstance();
  const receiptId = receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: currency.toUpperCase(),
    receipt: receiptId.substring(0, 40), // Razorpay limits receipt to 40 chars
    notes: notes,
  });

  return order;
};

/**
 * Verify Razorpay payment signature
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * @param {Object} data - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {boolean} true if signature matches, false otherwise
 */
export const verifyRazorpaySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  const keySecret = config.razorpay?.keySecret || process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured');
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpay_signature;
};
