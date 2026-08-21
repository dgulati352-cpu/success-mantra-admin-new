import express from 'express';
import Order from '../models/Order.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { createCheckoutSession, constructWebhookEvent, retrieveSubscription, cancelSubscription } from '../services/stripe.js';
import { sendOrderConfirmationEmail } from '../services/email.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';
import { config } from '../config/index.js';

const router = express.Router();

router.get('/', authenticate, catchAsync(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('items.item');
  res.json({ success: true, orders });
}));

router.get('/:id', authenticate, catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('items.item');
  if (!order) return next(new AppError('Order not found', 404));
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') return next(new AppError('Not authorized', 403));
  res.json({ success: true, order });
}));

router.post('/checkout', authenticate, catchAsync(async (req, res, next) => {
  const { items, successUrl, cancelUrl } = req.body;
  if (!items || !items.length) return next(new AppError('No items provided', 400));

  const lineItems = [];
  let subtotal = 0;

  for (const item of items) {
    let course, price;
    if (item.type === 'course') {
      course = await Course.findById(item.id);
      if (!course) return next(new AppError(`Course ${item.id} not found`, 404));
      price = course.price;
      lineItems.push({ price: course.stripePriceId, quantity: 1 });
    }
    subtotal += price;
  }

  const customer = req.user.membership.stripeCustomerId ? { id: req.user.membership.stripeCustomerId } : await (async () => {
    const { createCustomer } = await import('../services/stripe.js');
    const c = await createCustomer(req.user.email, `${req.user.firstName} ${req.user.lastName}`, { userId: req.user.id });
    req.user.membership.stripeCustomerId = c.id;
    await req.user.save({ validateBeforeSave: false });
    return c;
  })();

  const session = await createCheckoutSession({
    customerId: customer.id,
    lineItems,
    successUrl: successUrl || `${config.clientUrl}/checkout/success`,
    cancelUrl: cancelUrl || `${config.clientUrl}/checkout/cancel`,
    mode: 'payment',
    metadata: { userId: req.user.id, items: JSON.stringify(items) }
  });

  res.json({ success: true, sessionId: session.id, url: session.url });
}));

router.post('/webhook', express.raw({ type: 'application/json' }), catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = constructWebhookEvent(req.body, sig);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const items = JSON.parse(session.metadata?.items || '[]');

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          for (const item of items) {
            if (item.type === 'course') {
              const course = await Course.findById(item.id);
              if (course && !user.enrolledCourses.some(e => e.course.toString() === course._id.toString())) {
                user.enrolledCourses.push({ course: course._id, enrolledAt: new Date(), progress: 0, completedLessons: [] });
                course.enrollmentCount += 1;
                await course.save();
              }
            }
          }
          await user.save();

          const order = await Order.create({
            user: userId,
            items: items.map(i => ({ type: i.type, item: i.id, price: 0, quantity: 1 })),
            subtotal: session.amount_subtotal / 100,
            total: session.amount_total / 100,
            status: 'completed',
            paymentMethod: 'stripe',
            stripeSessionId: session.id,
            paidAt: new Date()
          });

          await sendOrderConfirmationEmail(user, order);
        }
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const user = await User.findOne({ 'membership.stripeSubscriptionId': subscription.id });
      if (user) {
        user.membership.type = 'free';
        user.membership.endDate = new Date();
        user.membership.stripeSubscriptionId = null;
        await user.save();
      }
      break;
    }
  }

  res.json({ received: true });
}));

router.get('/subscription/status', authenticate, catchAsync(async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    membership: user.membership,
    isActive: user.membership.endDate ? user.membership.endDate > new Date() : false
  });
}));

router.post('/subscription/cancel', authenticate, catchAsync(async (req, res, next) => {
  if (!req.user.membership.stripeSubscriptionId) return next(new AppError('No active subscription', 400));
  await cancelSubscription(req.user.membership.stripeSubscriptionId);
  req.user.membership.type = 'free';
  req.user.membership.endDate = new Date();
  req.user.membership.stripeSubscriptionId = null;
  await req.user.save();
  res.json({ success: true, message: 'Subscription cancelled' });
}));

export default router;