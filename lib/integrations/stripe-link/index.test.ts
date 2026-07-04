import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as link from "./index";
import { __setStripe } from "../stripe/index";

const OLD_ENV = { ...process.env };

function mockStripe() {
  return {
    paymentIntents: {
      create: vi.fn().mockResolvedValue({ id: "pi_1", client_secret: "pi_1_secret" }),
    },
    setupIntents: {
      create: vi.fn().mockResolvedValue({ id: "si_1", client_secret: "si_1_secret" }),
    },
  } as unknown as import("stripe").default;
}

describe("stripe-link adapter", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_x";
    __setStripe(mockStripe());
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    __setStripe(null);
    vi.restoreAllMocks();
  });

  it("isConfigured tracks stripe secret", () => {
    expect(link.isConfigured()).toBe(true);
    delete process.env.STRIPE_SECRET_KEY;
    expect(link.isConfigured()).toBe(false);
  });

  it("creates a checkout intent with publishable key", async () => {
    const res = await link.createCheckoutIntent({ amount: 1999 });
    expect(res.clientSecret).toBe("pi_1_secret");
    expect(res.paymentIntentId).toBe("pi_1");
    expect(res.publishableKey).toBe("pk_test_x");
  });

  it("rejects non-positive amounts", async () => {
    await expect(link.createCheckoutIntent({ amount: 0 })).rejects.toThrow(/positive/);
  });

  it("creates a setup intent", async () => {
    const res = await link.createSetupIntent("cus_1");
    expect(res.clientSecret).toBe("si_1_secret");
  });
});
