import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Navbar } from "./navbar";

describe("Navbar", () => {
  const links = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ];

  it("renders the default brand, links, actions, and mobile menu button", () => {
    render(
      <Navbar links={links} actions={<button>Sign in</button>} />,
    );

    // Default brand appears (desktop header + mobile sheet title uses same node)
    expect(screen.getAllByText("Syntheon").length).toBeGreaterThanOrEqual(1);

    // Links render in both the desktop nav and the mobile sheet nav
    const features = screen.getAllByText("Features");
    expect(features.length).toBeGreaterThanOrEqual(1);
    const pricing = screen.getAllByRole("link", { name: "Pricing" });
    expect(pricing.length).toBeGreaterThanOrEqual(1);

    // Actions render
    expect(
      screen.getAllByRole("button", { name: "Sign in" }).length,
    ).toBeGreaterThanOrEqual(1);

    // Mobile "Open menu" button exists
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });

  it("renders a custom brand", () => {
    render(<Navbar brand={<span>Acme</span>} links={links} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });
});
