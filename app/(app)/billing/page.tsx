import type { Metadata } from "next";

import { PLANS, getBillingState } from "../_data/billing";
import { BillingPanel } from "../_components/billing-panel";

export const metadata: Metadata = {
  title: "Billing — Syntheon",
};

export const dynamic = "force-dynamic";

/**
 * Billing / upgrade surface for the example app. Uses the typed Stripe adapter
 * through server actions; renders and builds with no keys (mock mode).
 */
export default async function BillingPage() {
  const billing = await getBillingState();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Choose the plan that fits. Syntheon itself is free and local — paid
          tiers add cloud acceleration and collaboration.
        </p>
      </div>

      <BillingPanel plans={PLANS} billing={billing} />
    </div>
  );
}
