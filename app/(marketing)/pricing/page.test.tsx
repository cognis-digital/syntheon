import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import PricingPage from "./page";

describe("Pricing page", () => {
  it("renders all three tiers", () => {
    render(<PricingPage />);
    expect(screen.getByText("Open Source")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
    // "Enterprise" appears in tier + comparison + callout; at least one present
    expect(screen.getAllByText("Enterprise").length).toBeGreaterThan(0);
  });

  it("renders the plan comparison table", () => {
    render(<PricingPage />);
    expect(screen.getByText("Capability")).toBeInTheDocument();
    expect(screen.getByText("SSO / SAML + RBAC")).toBeInTheDocument();
  });

  it("has an enterprise contact callout", () => {
    render(<PricingPage />);
    expect(screen.getByText(/regulated deployments/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sales@syntheon\.dev/i })).toBeInTheDocument();
  });
});
