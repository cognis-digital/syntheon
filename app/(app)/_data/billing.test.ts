import { describe, it, expect } from "vitest";

import { PLANS, getPlan, getBillingState } from "./billing";

describe("billing model", () => {
  it("exposes a free plan and at least one paid plan", () => {
    expect(PLANS.some((p) => p.price === 0)).toBe(true);
    expect(PLANS.some((p) => p.price > 0)).toBe(true);
  });

  it("looks up a plan by id", () => {
    expect(getPlan("pro")?.name).toBe("Pro");
    expect(getPlan("nope")).toBeUndefined();
  });

  it("marks exactly one plan as featured", () => {
    expect(PLANS.filter((p) => p.featured).length).toBe(1);
  });

  it("resolves mock billing state with no Stripe keys configured", async () => {
    const state = await getBillingState();
    expect(state.live).toBe(false);
    expect(state.planId).toBe("free");
    expect(state.status).toBe("none");
  });
});
