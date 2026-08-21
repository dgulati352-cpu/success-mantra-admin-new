import express from 'express';

const router = express.Router();

const plans = [
  {
    id: 'plan_monthly',
    type: 'premium',
    name: 'Monthly Pro Pass',
    price: 999,
    originalPrice: 1999,
    duration: '1 Month',
    billingCycle: 'monthly',
    badge: 'Popular',
    features: [
      'Full HD access to all Class 11 & 12 chapter video lectures',
      'Download all teacher handwritten notes PDF & formula sheets',
      'All India Board Mock Test Series with instant percentiles',
      'Doubt solving support from verified teachers',
    ]
  },
  {
    id: 'plan_quarterly',
    type: 'premium',
    name: '3-Month Board Booster',
    price: 2499,
    originalPrice: 4999,
    duration: '3 Months',
    billingCycle: 'quarterly',
    badge: 'Best Value',
    features: [
      'Everything in Monthly Pro Pass',
      'Previous 10-Year CBSE Board Question Scanner with solutions',
      'Live weekly interactive doubt classes',
      'Free digital access to all Bookstore eBooks'
    ]
  },
  {
    id: 'plan_annual_vip',
    type: 'vip',
    name: 'Annual VIP Topper Membership',
    price: 6999,
    originalPrice: 14999,
    duration: '12 Months (Full Academic Year)',
    billingCycle: 'annual',
    badge: 'VIP Elite',
    features: [
      'Unlimited 24/7 access to all 500+ video lectures',
      'Direct 1-on-1 mentorship sessions with top rankers',
      'Physical printed handwritten notes delivered to your doorstep',
      'Unlimited CBT Mock Test simulator & performance analytics',
      'Guaranteed 95%+ Board Exam score preparation framework'
    ]
  }
];

// GET /api/memberships/plans - List membership options
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    data: plans,
  });
});

// POST /api/memberships/subscribe - Activate subscription
router.post('/subscribe', (req, res) => {
  const { planId, userEmail } = req.body;
  const plan = plans.find((p) => p.id === planId) || plans[0];

  const expiryDate = new Date();
  if (plan.id === 'plan_annual_vip') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else if (plan.id === 'plan_quarterly') {
    expiryDate.setMonth(expiryDate.getMonth() + 3);
  } else {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  }

  const subscription = {
    subscriptionId: `SM-VIP-${Date.now().toString(36).toUpperCase()}`,
    plan: plan.name,
    type: plan.type,
    amountPaid: plan.price,
    status: 'active',
    startDate: new Date().toISOString(),
    expiresAt: expiryDate.toISOString(),
    benefits: plan.features,
    message: `Congratulations! ${plan.name} has been successfully activated. All video lectures, test papers, and notes are now unlocked!`,
  };

  res.status(201).json({
    success: true,
    message: 'Membership activated successfully!',
    data: subscription,
  });
});

export default router;
