import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// The panel imports server actions (which pull in next/headers + the Stripe
// adapter). Stub the actions module so the component test stays a pure UI test.
vi.mock("../_data/billing-actions", () => ({
  startCheckout: vi.fn(async () => ({ ok: true, mock: true })),
  openBillingPortal: vi.fn(async () => ({ ok: true, mock: true })),
}));

// Toasts render into a portal we don't assert on here.
vi.mock("sonner", () => ({ toast: { info: vi.fn(), error: vi.fn(), success: vi.fn() } }));

import { BillingPanel } from "./billing-panel";
import { PLANS } from "../_data/billing";

describe("BillingPanel", () => {
  it("shows the mock-mode notice when Stripe is not live", () => {
    render(
      <BillingPanel
        plans={PLANS}
        billing={{ live: false, planId: "free", status: "none" }}
      />,
    );
    expect(
      screen.getByText("Preview billing (mock mode)"),
    ).toBeInTheDocument();
    expect(screen.getByText("STRIPE_SECRET_KEY")).toBeInTheDocument();
  });

  it("renders every plan and marks the current one", () => {
    render(
      <BillingPanel
        plans={PLANS}
        billing={{ live: true, planId: "free", status: "active" }}
      />,
    );
    for (const plan of PLANS) {
      expect(screen.getByText(plan.name)).toBeInTheDocument();
    }
    // The free plan is current here → shows a "Current" badge.
    expect(screen.getByText("Current")).toBeInTheDocument();
    // No mock notice in live mode.
    expect(
      screen.queryByText("Preview billing (mock mode)"),
    ).not.toBeInTheDocument();
  });

  it("offers an upgrade button for paid plans", () => {
    render(
      <BillingPanel
        plans={PLANS}
        billing={{ live: true, planId: "free", status: "active" }}
      />,
    );
    expect(
      screen.getByRole("button", { name: /Upgrade to Pro/i }),
    ).toBeInTheDocument();
  });
});
