import { type Stripe } from 'stripe';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const stripeConfigSchema = z.object({
  publishableKey: z.string().min(1),
  secretKey: z.string().min(1),
  webhookSecret: z.string().optional(),
});

type StripeConfig = z.infer<typeof stripeConfigSchema>;

let config: StripeConfig | null = null;

export function isConfigured(): boolean {
  return !!config && !!(config.publishableKey && config.secretKey);
}

async function loadStripe(): Promise<Stripe | null> {
  if (!isConfigured()) return null;
  
  try {
    const stripe = await (window as any).stripe?.(config.publishableKey);
    return stripe || null;
  } catch {
    console.warn('Stripe initialization failed');
    return null;
  }
}

export async function createCheckoutSession(
  amount: number,
  currency: string = 'usd',
  items?: Array<{ name: string; quantity: number }>
): Promise<Stripe.Checkout.Session | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency,
      line_items: items?.map((item) => ({
        price_data: {
          currency,
          unit_amount: Math.round(amount / 100),
          product_data: { name: item.name },
        },
        quantity: item.quantity,
      })),
      success_url: `${window.location.origin}/success?session_id={{CHECKOUT_SESSION_ID}}`,
      cancel_url: `${window.location.origin}/cart`,
    });

    return session;
  } catch (error) {
    console.error('Checkout creation failed:', error);
    throw error;
  }
}

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd'
): Promise<Stripe.PaymentIntent | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount / 100),
      currency,
      payment_method_types: ['card'],
    });

    return intent;
  } catch (error) {
    console.error('PaymentIntent creation failed:', error);
    throw error;
  }
}

export async function verifyWebhook(
  eventBody: string | Buffer,
  signature?: string
): Promise<Stripe.Event | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    if (signature && config.webhookSecret) {
      const event = await stripe.webhooks.constructEvent(
        eventBody,
        signature,
        config.webhookSecret
      );
      return event;
    } else if (config.webhookSecret) {
      // Fallback for older Stripe versions
      const event = await stripe.webhooks.constructEvent(
        eventBody,
        'placeholder-signature',
        config.webhookSecret
      );
      return event;
    }

    return null;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw error;
  }
}

export async function handlePaymentSuccess(
  session: Stripe.Checkout.Session,
  amount: number
): Promise<void> {
  if (!isConfigured()) return;

  const stripe = await loadStripe();
  if (!stripe) return;

  try {
    // Confirm payment was successful
    const confirmed = await stripe.paymentIntents.retrieve(
      session.payment_intent || '',
      { expand: ['payment_method'] }
    );

    console.log('Payment confirmed:', confirmed);
    
    // Update your database here
    // await db.transactions.create({ ... });

  } catch (error) {
    console.error('Payment confirmation failed:', error);
    throw error;
  }
}

export async function handleRefund(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const refundAmount = amount || (await stripe.paymentIntents.retrieve(
      paymentIntentId,
      { expand: ['latest_charge'] }
    ))?.amount_received;

    if (!refundAmount) return null;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(refundAmount / 100),
    });

    console.log('Refund created:', refund);
    return refund;
  } catch (error) {
    console.error('Refund creation failed:', error);
    throw error;
  }
}

export async function getCustomerBalance(
  customer: string | Stripe.Customer
): Promise<Stripe.Balance | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const balance = await stripe.balance.retrieve({
      customer,
    });

    return balance;
  } catch (error) {
    console.error('Balance retrieval failed:', error);
    throw error;
  }
}

export async function createPortalSession(
  customer: string | Stripe.Customer
): Promise<Stripe.Session | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${window.location.origin}/portal-success`,
    });

    return session;
  } catch (error) {
    console.error('Portal session creation failed:', error);
    throw error;
  }
}

export async function createSubscription(
  amount: number,
  interval: 'monthly' | 'yearly',
  customer?: string | Stripe.Customer
): Promise<Stripe.Subscription | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const subscription = await stripe.subscriptions.create({
      customer,
      items: [{ price_data: { currency: 'usd', unit_amount: Math.round(amount / 100), product_data: { name: `Syntheon ${interval === 'monthly' ? 'Monthly' : 'Yearly'} Plan` } }, quantity: 1 }],
      billing_cycle_anchor: Date.now(),
      payment_behavior: 'default_incomplete',
      payment_method_types: ['card'],
    });

    return subscription;
  } catch (error) {
    console.error('Subscription creation failed:', error);
    throw error;
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  customer?: string | Stripe.Customer
): Promise<Stripe.Subscription | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const cancelled = await stripe.subscriptions.cancel(
      subscriptionId,
      { customer }
    );

    console.log('Subscription cancelled:', cancelled);
    return cancelled;
  } catch (error) {
    console.error('Subscription cancellation failed:', error);
    throw error;
  }
}

export async function createInvoice(
  amount: number,
  customer: string | Stripe.Customer,
  dueDate?: Date
): Promise<Stripe.Invoice | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const invoice = await stripe.invoices.create({
      customer,
      subscription_items: [],
      amount_due: Math.round(amount / 100),
      currency: 'usd',
      due_date: dueDate ? Math.floor(dueDate.getTime() / 1000) : undefined,
    });

    return invoice;
  } catch (error) {
    console.error('Invoice creation failed:', error);
    throw error;
  }
}

export async function getPaymentMethod(
  customer: string | Stripe.Customer
): Promise<Stripe.PaymentMethod | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const paymentMethod = await stripe.paymentMethods.retrieve({
      customer,
    });

    return paymentMethod;
  } catch (error) {
    console.error('Payment method retrieval failed:', error);
    throw error;
  }
}

export async function createSource(
  amount: number,
  currency: string = 'usd'
): Promise<Stripe.Source | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const source = await stripe.sources.create({
      type: 'card',
      amount: Math.round(amount / 100),
      currency,
    });

    return source;
  } catch (error) {
    console.error('Source creation failed:', error);
    throw error;
  }
}

export async function createToken(
  cardNumber: string,
  expiryMonth: number,
  expiryYear: number,
  cvc?: string
): Promise<Stripe.Token | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const token = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: expiryMonth.toString().padStart(2, '0'),
        exp_year: expiryYear.toString(),
        cvc,
      },
    });

    return token;
  } catch (error) {
    console.error('Token creation failed:', error);
    throw error;
  }
}

export async function createCustomer(
  name?: string,
  email?: string,
  metadata?: Record<string, any>
): Promise<Stripe.Customer | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const customer = await stripe.customers.create({
      name,
      email,
      metadata: metadata || {},
    });

    console.log('Customer created:', customer);
    return customer;
  } catch (error) {
    console.error('Customer creation failed:', error);
    throw error;
  }
}

export async function updateCustomer(
  customerId: string,
  name?: string,
  email?: string,
  metadata?: Record<string, any>
): Promise<Stripe.Customer | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const updated = await stripe.customers.update(
      customerId,
      { name, email, metadata }
    );

    console.log('Customer updated:', updated);
    return updated;
  } catch (error) {
    console.error('Customer update failed:', error);
    throw error;
  }
}

export async function deleteCustomer(
  customerId: string
): Promise<Stripe.Customer | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const deleted = await stripe.customers.del(customerId);

    console.log('Customer deleted:', deleted);
    return deleted;
  } catch (error) {
    console.error('Customer deletion failed:', error);
    throw error;
  }
}

export async function createCharge(
  amount: number,
  currency: string = 'usd',
  customer?: string | Stripe.Customer,
  receiptEmail?: string
): Promise<Stripe.Charge | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const charge = await stripe.charges.create({
      amount: Math.round(amount / 100),
      currency,
      customer,
      receipt_email: receiptEmail,
    });

    console.log('Charge created:', charge);
    return charge;
  } catch (error) {
    console.error('Charge creation failed:', error);
    throw error;
  }
}

export async function createInvoiceItem(
  amount: number,
  description: string,
  customer: string | Stripe.Customer,
  subscription?: string
): Promise<Stripe.InvoiceItem | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const item = await stripe.invoiceItems.create({
      customer,
      amount: Math.round(amount / 100),
      description,
      currency: 'usd',
      subscription,
    });

    console.log('Invoice item created:', item);
    return item;
  } catch (error) {
    console.error('Invoice item creation failed:', error);
    throw error;
  }
}

export async function getCustomerBalanceTransactions(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.BalanceTransaction[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const transactions = await stripe.balanceTransactions.list({
      customer,
      limit: limit || 10,
    });

    console.log('Balance transactions retrieved:', transactions.data.length);
    return transactions.data;
  } catch (error) {
    console.error('Balance transaction retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerSubscription(
  customer: string | Stripe.Customer
): Promise<Stripe.Subscription | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const subscription = await stripe.subscriptions.list({
      customer,
      limit: 1,
    });

    console.log('Customer subscription:', subscription.data[0]);
    return subscription.data[0] || null;
  } catch (error) {
    console.error('Subscription retrieval failed:', error);
    throw error;
  }
}

export async function getPaymentMethodDetails(
  customer: string | Stripe.Customer
): Promise<Stripe.PaymentMethod | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const paymentMethod = await stripe.paymentMethods.list({
      customer,
      limit: 1,
    });

    console.log('Payment method details:', paymentMethod.data[0]);
    return paymentMethod.data[0] || null;
  } catch (error) {
    console.error('Payment method details retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerBalanceHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.BalanceTransaction[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const transactions = await stripe.balanceTransactions.list({
      customer,
      limit: limit || 10,
    });

    console.log('Balance history retrieved:', transactions.data.length);
    return transactions.data;
  } catch (error) {
    console.error('Balance history retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerSubscriptionHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.Subscription[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer,
      limit: limit || 10,
    });

    console.log('Subscription history retrieved:', subscriptions.data.length);
    return subscriptions.data;
  } catch (error) {
    console.error('Subscription history retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerPaymentMethodHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.PaymentMethod[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer,
      limit: limit || 10,
    });

    console.log('Payment method history retrieved:', paymentMethods.data.length);
    return paymentMethods.data;
  } catch (error) {
    console.error('Payment method history retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerInvoiceHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.Invoice[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const invoices = await stripe.invoices.list({
      customer,
      limit: limit || 10,
    });

    console.log('Invoice history retrieved:', invoices.data.length);
    return invoices.data;
  } catch (error) {
    console.error('Invoice history retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerChargeHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.Charge[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const charges = await stripe.charges.list({
      customer,
      limit: limit || 10,
    });

    console.log('Charge history retrieved:', charges.data.length);
    return charges.data;
  } catch (error) {
    console.error('Charge history retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerSourceHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.Source[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const sources = await stripe.sources.list({
      customer,
      limit: limit || 10,
    });

    console.log('Source history retrieved:', sources.data.length);
    return sources.data;
  } catch (error) {
    console.error('Source history retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerTokenHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.Token[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const tokens = await stripe.tokens.list({
      customer,
      limit: limit || 10,
    });

    console.log('Token history retrieved:', tokens.data.length);
    return tokens.data;
  } catch (error) {
    console.error('Token history retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerBalanceTransactionHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.BalanceTransaction[] | null> {
  if (!isConfigured()) return null;

  const stripe = await loadStripe();
  if (!stripe) return null;

  try {
    const transactions = await stripe.balanceTransactions.list({
      customer,
      limit: limit || 10,
    });

    console.log('Balance transaction history retrieved:', transactions.data.length);
    return transactions.data;
  } catch (error) {
    console.error('Balance transaction history retrieval failed:', error);
    throw error;
  }
}

export async function getCustomerSubscriptionEventHistory(
  customer: string | Stripe.Customer,
  limit?: number
): Promise<Stripe.Event[] | null>
