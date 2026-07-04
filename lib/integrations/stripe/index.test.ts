import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as stripeAdapter from "./index";

const OLD_ENV = { ...process.env };

function mockStripe() {
  return {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ id: "cs_123", url: "https://pay.stripe/cs_123" }),
      },
    },
    billingPortal: {
      sessions: { create: vi.fn().mockResolvedValue({ url: "https://portal/x" }) },
    },
    subscriptions: {
      list: vi.fn().mockResolvedValue({ data: [{ id: "sub_1" }] }),
      update: vi.fn().mockResolvedValue({ id: "sub_1", cancel_at_period_end: true }),
      cancel: vi.fn().mockResolvedValue({ id: "sub_1", status: "canceled" }),
    },
    webhooks: {
      constructEvent: vi.fn().mockReturnValue({
        type: "checkout.session.completed",
        data: { object: { id: "cs_123" } },
      }),
    },
  } as unknown as import("stripe").default;
}

describe("stripe adapter", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    process.env.STRIPE_PRICE_ID = "price_x";
    stripeAdapter.__setStripe(mockStripe());
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    stripeAdapter.__setStripe(null);
    vi.restoreAllMocks();
  });

  it("isConfigured reflects secret key presence", () => {
    expect(stripeAdapter.isConfigured()).toBe(true);
    delete process.env.STRIPE_SECRET_KEY;
    expect(stripeAdapter.isConfigured()).toBe(false);
  });

  it("creates a checkout session", async () => {
    const res = await stripeAdapter.createCheckoutSession({
      successUrl: "https://a/ok",
      cancelUrl: "https://a/no",
      customerEmail: "x@y.z",
    });
    expect(res).toEqual({ id: "cs_123", url: "https://pay.stripe/cs_123" });
  });

  it("throws when checkout has no price and env unset", async () => {
    delete process.env.STRIPE_PRICE_ID;
    await expect(
      stripeAdapter.createCheckoutSession({ successUrl: "a", cancelUrl: "b" }),
    ).rejects.toThrow(/priceId/);
  });

  it("creates a billing portal session", async () => {
    const res = await stripeAdapter.createBillingPortalSession("cus_1", "https://back");
    expect(res.url).toBe("https://portal/x");
  });

  it("cancels a subscription at period end", async () => {
    const sub = await stripeAdapter.cancelSubscription("sub_1");
    expect(sub.cancel_at_period_end).toBe(true);
  });

  it("verifies and routes a webhook event", () => {
    const event = stripeAdapter.constructWebhookEvent("{}", "sig");
    const result = stripeAdapter.handleWebhookEvent(event);
    expect(result).toEqual({
      type: "checkout.session.completed",
      handled: true,
      object: { id: "cs_123" },
    });
  });
});
