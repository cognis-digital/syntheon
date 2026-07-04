import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { PricingTable } from "./pricing-table";

describe("PricingTable", () => {
  it("renders tiers with prices, features, and CTA", () => {
    render(
      <PricingTable
        heading="Pricing"
        tiers={[
          {
            name: "Pro",
            price: "$29",
            period: "/mo",
            features: ["Feature A", "Feature B"],
            highlighted: true,
            badge: "Popular",
            cta: { label: "Choose Pro", href: "/checkout" },
          },
        ]}
      />,
    );
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("Feature A")).toBeInTheDocument();
    expect(screen.getByText("Popular")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Choose Pro" })).toHaveAttribute("href", "/checkout");
  });
});
