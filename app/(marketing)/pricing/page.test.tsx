import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import PricingPage from "./page";

describe("Pricing page", () => {
  it("renders all three tiers", () => {
    render(<PricingPage />);
    expect(screen.getAllByText("Open Source").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Team").length).toBeGreaterThan(0);
    // "Enterprise" appears in tier + comparison + callout; at least one present
    expect(screen.getAllByText("Enterprise").length).toBeGreaterThan(0);
  });

  it("renders the plan comparison table", () => {
    render(<PricingPage />);
    expect(screen.getByText("Capability")).toBeInTheDocument();
    expect(screen.getAllByText("SSO / SAML + RBAC").length).toBeGreaterThan(0);
  });

  it("has an enterprise contact callout", () => {
    render(<PricingPage />);
    expect(screen.getByText(/regulated deployments/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sales@syntheon\.dev/i })).toBeInTheDocument();
  });
});
