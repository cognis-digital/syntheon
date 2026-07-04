/**
 * Stripe Link adapter — one-click accelerated checkout via the Payment Element
 * with Link enabled. Server-side helper creates a PaymentIntent (or
 * SetupIntent) whose client_secret is handed to the Payment Element on the
 * client; Link surfaces automatically when the payment method config allows it.
 *
 * Env: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 */
import type Stripe from "stripe";
import { getStripe, isConfigured as stripeConfigured } from "../stripe/index";
import { env, IntegrationError } from "../types";

export const STRIPE_LINK_ENV = [
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
] as const;

export function isConfigured(): boolean {
  return stripeConfigured();
}

export interface CheckoutIntentOptions {
  /** amount in the smallest currency unit (e.g. cents) */
  amount: number;
  currency?: string;
  customerId?: string;
  receiptEmail?: string;
  /** whether to save the payment method (enables Link + reuse) */
  setupFutureUsage?: "off_session" | "on_session";
  metadata?: Record<string, string>;
}

export interface CheckoutIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey: string | undefined;
}

/**
 * Create a PaymentIntent configured for the Payment Element with Link.
 * `automatic_payment_methods` lets Stripe surface Link + cards + wallets from
 * the dashboard config — the client only needs the returned client_secret.
 */
export async function createCheckoutIntent(
  opts: CheckoutIntentOptions,
): Promise<CheckoutIntentResult> {
  if (opts.amount <= 0) {
    throw new IntegrationError("stripe-link", "amount must be positive", "bad_request");
  }
  const stripe = getStripe();
  const intent = await stripe.paymentIntents.create({
    amount: opts.amount,
    currency: opts.currency ?? "usd",
    customer: opts.customerId,
    receipt_email: opts.receiptEmail,
    setup_future_usage: opts.setupFutureUsage,
    metadata: opts.metadata,
    automatic_payment_methods: { enabled: true },
  });
  if (!intent.client_secret) {
    throw new IntegrationError("stripe-link", "PaymentIntent returned no client_secret", "provider_error");
  }
  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    publishableKey: env("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  };
}

/** Create a SetupIntent to save a Link-enabled payment method with no charge. */
export async function createSetupIntent(
  customerId?: string,
): Promise<{ clientSecret: string; setupIntentId: string }> {
  const stripe = getStripe();
  const intent: Stripe.SetupIntent = await stripe.setupIntents.create({
    customer: customerId,
    automatic_payment_methods: { enabled: true },
  });
  if (!intent.client_secret) {
    throw new IntegrationError("stripe-link", "SetupIntent returned no client_secret", "provider_error");
  }
  return { clientSecret: intent.client_secret, setupIntentId: intent.id };
}
