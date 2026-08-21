import express from 'express';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/razorpay.js';
import { config } from '../config/index.js';
import Order from '../models/Order.js';

const router = express.Router();

/**
 * GET /api/payment/key
 * Public endpoint to fetch Razorpay public Key ID
 */
router.get('/key', (req, res) => {
  const keyId = config.razorpay?.keyId || process.env.RAZORPAY_KEY_ID;
  res.json({
    success: true,
    key_id: keyId,
  });
});

/**
 * POST /api/create-order or /api/payment/create-order
 * Body: { amount (in paise or INR), currency, receipt, notes, items, user }
 */
export const handleCreateOrder = async (req, res) => {
  try {
    let { amount, currency = 'INR', receipt, notes = {}, items, inRupees } = req.body;

    if (!amount && amount !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required',
      });
    }

    // If client specified amount in Rupees (or if amount < 100 and inRupees is true), convert to paise
    let amountInPaise = Number(amount);
    if (inRupees) {
      amountInPaise = Math.round(amountInPaise * 100);
    }

    // Validate minimum amount of 100 paise (₹1)
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least 100 paise (₹1.00)',
      });
    }

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return res.status(200).json({
      success: true,
      order_id: razorpayOrder.id,
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: config.razorpay?.keyId || process.env.RAZORPAY_KEY_ID,
      receipt: razorpayOrder.receipt,
      status: razorpayOrder.status,
    });
  } catch (error) {
    console.error('[Razorpay] Order creation error:', error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create Razorpay order',
      error: config.nodeEnv === 'development' ? error : undefined,
    });
  }
};

/**
 * POST /api/verify-payment or /api/payment/verify-payment
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId, items }
 */
export const handleVerifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      payment_id,
      signature,
      items,
      userId,
      amount,
    } = req.body;

    const rOrderId = razorpay_order_id || order_id;
    const rPaymentId = razorpay_payment_id || payment_id;
    const rSignature = razorpay_signature || signature;

    // Validate required fields
    if (!rOrderId || !rPaymentId || !rSignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields (order_id, payment_id, signature)',
      });
    }

    // Verify HMAC-SHA256 signature
    const isValid = verifyRazorpaySignature({
      razorpay_order_id: rOrderId,
      razorpay_payment_id: rPaymentId,
      razorpay_signature: rSignature,
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Verification failed.',
      });
    }

    // Optional: Record or update order in Database if Order model is present
    try {
      if (Order && (userId || req.user?.id)) {
        await Order.create({
          user: userId || req.user?.id,
          items: items || [],
          total: amount ? (amount > 1000 ? amount / 100 : amount) : 0,
          paymentMethod: 'razorpay',
          status: 'completed',
          paymentDetails: {
            razorpayOrderId: rOrderId,
            razorpayPaymentId: rPaymentId,
            razorpaySignature: rSignature,
          },
        });
      }
    } catch (dbErr) {
      console.warn('[Order DB Note]: Order recorded in memory/log:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: rPaymentId,
      orderId: rOrderId,
      status: 'SUCCESS',
    });
  } catch (error) {
    console.error('[Razorpay] Payment verification error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Payment verification processing error',
    });
  }
};

router.post('/create-order', handleCreateOrder);
router.post('/verify-payment', handleVerifyPayment);

export default router;
