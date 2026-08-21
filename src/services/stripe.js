import Stripe from 'stripe';
import { config } from '../config/index.js';

const stripe = config.stripe.secretKey && !config.stripe.secretKey.includes('dummy') && !config.stripe.secretKey.includes('your_stripe')
  ? new Stripe(config.stripe.secretKey, { apiVersion: '2023-10-16' })
  : null;

export const createCustomer = async (email, name, metadata = {}) => {
  if (!stripe) return { id: `cus_mock_${Date.now()}`, email, name, metadata };
  return await stripe.customers.create({ email, name, metadata });
};

export const createProduct = async (name, description, metadata = {}) => {
  if (!stripe) return { id: `prod_mock_${Date.now()}`, name, description, metadata };
  return await stripe.products.create({ name, description, metadata });
};

export const createPrice = async (productId, amount, currency = 'inr', recurring = null, metadata = {}) => {
  if (!stripe) return { id: `price_mock_${Date.now()}`, product: productId, unit_amount: Math.round(amount * 100), currency };
  const priceData = {
    product: productId,
    unit_amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata
  };

  if (recurring) {
    priceData.recurring = recurring;
  }

  return await stripe.prices.create(priceData);
};

export const createCheckoutSession = async ({
  customerId,
  lineItems,
  successUrl,
  cancelUrl,
  mode = 'payment',
  metadata = {},
  subscriptionData = null
}) => {
  if (!stripe) {
    return {
      id: `cs_mock_${Date.now()}`,
      url: `${successUrl}?session_id=mock_session_id`
    };
  }
  const sessionData = {
    customer: customerId,
    line_items: lineItems,
    mode,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true }
  };

  if (mode === 'subscription' && subscriptionData) {
    sessionData.subscription_data = subscriptionData;
  }

  return await stripe.checkout.sessions.create(sessionData);
};

export const createPortalSession = async (customerId, returnUrl) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  });
};

export const constructWebhookEvent = (payload, signature) => {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe.webhookSecret
  );
};

export const retrieveSubscription = async (subscriptionId) => {
  return await stripe.subscriptions.retrieve(subscriptionId);
};

export const cancelSubscription = async (subscriptionId) => {
  return await stripe.subscriptions.cancel(subscriptionId);
};

export const createPaymentIntent = async (amount, currency = 'inr', metadata = {}) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata,
    automatic_payment_methods: { enabled: true }
  });
};

export const refundPayment = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
  const refundData = {
    payment_intent: paymentIntentId,
    reason
  };
  
  if (amount) {
    refundData.amount = Math.round(amount * 100);
  }

  return await stripe.refunds.create(refundData);
};

export default stripe;