import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import LandingPage from "./page";

describe("Landing page", () => {
  it("renders the headline and value proposition", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Build your app\. Own every line\./i }),
    ).toBeInTheDocument();
  });

  it("has primary calls to action to GitHub", () => {
    render(<LandingPage />);
    const githubLinks = screen
      .getAllByRole("link", { name: /star on github/i })
      .filter((el) => el.getAttribute("href")?.includes("cognis-digital/syntheon"));
    expect(githubLinks.length).toBeGreaterThan(0);
  });

  it("renders the feature pillars", () => {
    render(<LandingPage />);
    expect(screen.getByText("You own every line")).toBeInTheDocument();
    expect(screen.getByText("Nothing ships unverified")).toBeInTheDocument();
    expect(screen.getByText("Menu-driven builder")).toBeInTheDocument();
  });

  it("renders the integration logo cloud", () => {
    render(<LandingPage />);
    expect(screen.getAllByText("Clerk").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Stripe").length).toBeGreaterThan(0);
    expect(screen.getAllByText("HubSpot").length).toBeGreaterThan(0);
  });

  it("renders the pricing tiers", () => {
    render(<LandingPage />);
    expect(screen.getByText("Open Source")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("renders the engine pipeline section", () => {
    render(<LandingPage />);
    expect(screen.getByText("Planner")).toBeInTheDocument();
    expect(screen.getByText("OmniCoder-9B")).toBeInTheDocument();
  });

  it("renders an FAQ", () => {
    render(<LandingPage />);
    expect(
      screen.getByText(/Does my code depend on Syntheon at runtime\?/i),
    ).toBeInTheDocument();
  });
});
