/**
 * Stripe adapter — Checkout, Billing/subscriptions, customer portal, webhooks.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID,
 *      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 */
import Stripe from "stripe";
import { env, hasEnv, IntegrationError, requireEnv } from "../types";

export const STRIPE_ENV = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_ID",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
] as const;

export function isConfigured(): boolean {
  return hasEnv("STRIPE_SECRET_KEY");
}

let _client: Stripe | null = null;

/** Lazily construct the Stripe client. Throws only when called unconfigured. */
export function getStripe(): Stripe {
  const key = requireEnv("stripe", "STRIPE_SECRET_KEY");
  if (!_client) {
    // Pin to the SDK's bundled apiVersion; cast avoids a hard literal mismatch
    // when the installed stripe package bumps its default version.
    _client = new Stripe(key, {
      apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
    });
  }
  return _client;
}

/** Test seam: inject a mock Stripe client. */
export function __setStripe(client: Stripe | null): void {
  _client = client;
}

export interface CheckoutOptions {
  priceId?: string;
  quantity?: number;
  mode?: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  customerId?: string;
  clientReferenceId?: string;
  metadata?: Record<string, string>;
}

/** Create a Checkout Session and return its url + id. */
export async function createCheckoutSession(
  opts: CheckoutOptions,
): Promise<{ id: string; url: string | null }> {
  const stripe = getStripe();
  const priceId = opts.priceId ?? env("STRIPE_PRICE_ID");
  if (!priceId) {
    throw new IntegrationError("stripe", "no priceId and STRIPE_PRICE_ID unset", "bad_request");
  }
  const session = await stripe.checkout.sessions.create({
    mode: opts.mode ?? "subscription",
    line_items: [{ price: priceId, quantity: opts.quantity ?? 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    customer: opts.customerId,
    customer_email: opts.customerId ? undefined : opts.customerEmail,
    client_reference_id: opts.clientReferenceId,
    metadata: opts.metadata,
  });
  return { id: session.id, url: session.url };
}

/** Create a Billing Customer Portal session for self-serve subscription management. */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string,
): Promise<{ url: string }> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return { url: session.url };
}

/** Fetch a customer's active subscriptions. */
export async function listSubscriptions(
  customerId: string,
): Promise<Stripe.Subscription[]> {
  const stripe = getStripe();
  const res = await stripe.subscriptions.list({ customer: customerId, status: "all" });
  return res.data;
}

/** Cancel a subscription (at period end by default). */
export async function cancelSubscription(
  subscriptionId: string,
  atPeriodEnd = true,
): Promise<Stripe.Subscription> {
  const stripe = getStripe();
  if (atPeriodEnd) {
    return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  }
  return stripe.subscriptions.cancel(subscriptionId);
}

/** Verify a webhook signature and return the parsed event. */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  const stripe = getStripe();
  const secret = requireEnv("stripe", "STRIPE_WEBHOOK_SECRET");
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

export interface WebhookResult {
  type: string;
  handled: boolean;
  /** convenient extraction of the object at the center of the event */
  object?: unknown;
}

/** Route a verified event to a lightweight, side-effect-free summary. */
export function handleWebhookEvent(event: Stripe.Event): WebhookResult {
  const handled = [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.paid",
    "invoice.payment_failed",
  ].includes(event.type);
  return { type: event.type, handled, object: event.data.object };
}
