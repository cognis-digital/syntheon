"use client";

import * as React from "react";
import { Check, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type { Plan, BillingState } from "../_data/billing";
import { startCheckout, openBillingPortal } from "../_data/billing-actions";

/**
 * The billing / upgrade surface. Renders the plan catalog and the current
 * subscription state, and drives checkout + the billing portal through server
 * actions. When Stripe is unconfigured it degrades to a clearly-labelled mock:
 * upgrade shows an informative toast + notice instead of navigating.
 */
export function BillingPanel({
  plans,
  billing,
}: {
  plans: readonly Plan[];
  billing: BillingState;
}) {
  const [pending, setPending] = React.useState<string | null>(null);

  async function onUpgrade(plan: Plan) {
    setPending(plan.id);
    try {
      const result = await startCheckout(plan.id);
      if (result.mock) {
        toast.info("Stripe isn't connected", {
          description:
            "Add STRIPE_SECRET_KEY to enable real checkout. This is the mock path.",
        });
        return;
      }
      if (result.ok && result.url) {
        window.location.href = result.url;
        return;
      }
      toast.error(result.error ?? "Could not start checkout.");
    } finally {
      setPending(null);
    }
  }

  async function onManage() {
    if (!billing.customerId) return;
    setPending("portal");
    try {
      const result = await openBillingPortal(billing.customerId);
      if (result.mock) {
        toast.info("Stripe isn't connected", {
          description: "The billing portal is available once Stripe is configured.",
        });
        return;
      }
      if (result.ok && result.url) {
        window.location.href = result.url;
        return;
      }
      toast.error(result.error ?? "Could not open the billing portal.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {!billing.live && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Preview billing (mock mode)</AlertTitle>
          <AlertDescription>
            No Stripe keys detected, so checkout runs in mock mode. Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              STRIPE_SECRET_KEY
            </code>{" "}
            to enable real Checkout, subscriptions, and the customer portal.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const current = plan.id === billing.planId;
          return (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col",
                plan.featured && "border-primary shadow-sm",
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {current ? (
                    <Badge variant="secondary">Current</Badge>
                  ) : plan.featured ? (
                    <Badge>Popular</Badge>
                  ) : null}
                </div>
                <CardDescription>{plan.tagline}</CardDescription>
                <p className="pt-2 text-2xl font-bold tracking-tight">
                  {plan.price === 0 ? (
                    "Free"
                  ) : (
                    <>
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        / mo
                      </span>
                    </>
                  )}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="flex flex-col gap-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {current ? (
                  <Button variant="outline" className="w-full" disabled>
                    Your plan
                  </Button>
                ) : plan.price === 0 ? (
                  <Button variant="outline" className="w-full" disabled>
                    Included
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => onUpgrade(plan)}
                    disabled={pending !== null}
                  >
                    {pending === plan.id && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {billing.customerId && (
        <div>
          <Button
            variant="outline"
            onClick={onManage}
            disabled={pending !== null}
          >
            {pending === "portal" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="mr-2 h-4 w-4" />
            )}
            Manage billing
          </Button>
        </div>
      )}
    </div>
  );
}
