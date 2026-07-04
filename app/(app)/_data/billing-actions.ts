"use server";

import { headers } from "next/headers";

import {
  isConfigured as stripeConfigured,
  createCheckoutSession,
  createBillingPortalSession,
} from "@/lib/integrations/stripe/index";
import { resolveSession } from "../_components/session";
import { getPlan } from "./billing";

/**
 * Billing server actions for the example app.
 *
 * Both guard on `stripeConfigured()`: with real keys they call the typed Stripe
 * adapter and return a redirect URL; without keys they return a `mock: true`
 * result so the UI can show a labelled "connect Stripe to enable" state instead
 * of throwing. The client is responsible for the actual navigation.
 */

export interface CheckoutResult {
  ok: boolean;
  /** Present when a real Checkout session was created. */
  url?: string;
  /** True when Stripe isn't configured — the UI shows a mock/upgrade notice. */
  mock?: boolean;
  error?: string;
}

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

/** Start a Checkout session for a plan, or return a mock result when unconfigured. */
export async function startCheckout(planId: string): Promise<CheckoutResult> {
  const plan = getPlan(planId);
  if (!plan) return { ok: false, error: "Unknown plan." };
  if (plan.price === 0) return { ok: false, error: "The Local plan is free." };

  if (!stripeConfigured()) {
    // Graceful mock: no keys, so we don't hit Stripe. The UI shows a notice.
    return { ok: true, mock: true };
  }

  const session = await resolveSession();
  const origin = await baseUrl();
  try {
    const { url } = await createCheckoutSession({
      priceId: plan.priceId,
      mode: "subscription",
      successUrl: `${origin}/settings?checkout=success`,
      cancelUrl: `${origin}/settings?checkout=cancelled`,
      customerEmail: session.user?.email,
      clientReferenceId: session.user?.id,
      metadata: { planId: plan.id },
    });
    if (!url) return { ok: false, error: "Stripe returned no checkout URL." };
    return { ok: true, url };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Checkout failed.",
    };
  }
}

/** Open the Stripe billing portal for the current customer (live mode only). */
export async function openBillingPortal(
  customerId: string,
): Promise<CheckoutResult> {
  if (!stripeConfigured()) return { ok: true, mock: true };
  const origin = await baseUrl();
  try {
    const { url } = await createBillingPortalSession(
      customerId,
      `${origin}/settings`,
    );
    return { ok: true, url };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not open the portal.",
    };
  }
}
