import "server-only";

import { isConfigured as stripeConfigured } from "@/lib/integrations/stripe/index";

/**
 * Billing model for the example SaaS app.
 *
 * Describes the plan catalog and resolves the current workspace's billing
 * state. When Stripe is configured (STRIPE_SECRET_KEY present) the checkout /
 * portal actions call the real typed adapter; otherwise the whole surface runs
 * in a clearly-labelled mock mode so the example app builds and renders with no
 * keys. Nothing here touches the network at import time.
 */

export interface Plan {
  id: string;
  name: string;
  /** Price in whole dollars per month; 0 = free. */
  price: number;
  tagline: string;
  features: string[];
  /** Optional Stripe price id override; else falls back to STRIPE_PRICE_ID. */
  priceId?: string;
  /** Marketing highlight. */
  featured?: boolean;
}

export const PLANS: readonly Plan[] = [
  {
    id: "free",
    name: "Local",
    price: 0,
    tagline: "Everything runs on your machine. Forever free.",
    features: [
      "Unlimited local generation",
      "All 130+ UI components",
      "Self-hosted auth + store",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 20,
    tagline: "Cloud acceleration + priority everything.",
    features: [
      "Everything in Local",
      "Optional cloud model escalation",
      "Hosted preview deployments",
      "Priority support",
    ],
    featured: true,
  },
  {
    id: "team",
    name: "Team",
    price: 80,
    tagline: "Shared blueprints and roles for your whole team.",
    features: [
      "Everything in Pro",
      "Shared project library",
      "Roles & permissions",
      "SSO / SAML",
    ],
  },
] as const;

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export interface BillingState {
  /** True when real Stripe keys are present. */
  live: boolean;
  /** The plan the workspace is currently on. */
  planId: string;
  /** Human status of the subscription. */
  status: "active" | "trialing" | "canceled" | "none";
  /** Stripe customer id when known (live mode). */
  customerId?: string;
  /** ISO date the current period renews / ends, when applicable. */
  renewsAt?: string;
}

/**
 * Resolve the current workspace billing state.
 *
 * In mock mode this is deterministic (free plan, no subscription) so the UI is
 * stable in dev, tests, and the static build. Wire this to your customer record
 * + `listSubscriptions()` from the Stripe adapter once you persist customer ids.
 */
export async function getBillingState(): Promise<BillingState> {
  const live = stripeConfigured();
  return {
    live,
    planId: "free",
    status: "none",
  };
}
