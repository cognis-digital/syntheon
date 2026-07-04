import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Cta } from "./cta";

describe("Cta", () => {
  it("renders title, description and actions", () => {
    render(
      <Cta
        title="Ready to build?"
        description="Start now."
        primaryAction={{ label: "Start", href: "/start" }}
        secondaryAction={{ label: "Learn more", href: "/learn" }}
      />,
    );
    expect(screen.getByRole("heading", { name: "Ready to build?" })).toBeInTheDocument();
    expect(screen.getByText("Start now.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start" })).toHaveAttribute("href", "/start");
    expect(screen.getByRole("link", { name: "Learn more" })).toBeInTheDocument();
  });

  it("renders banner variant", () => {
    render(<Cta variant="banner" title="Banner CTA" />);
    expect(screen.getByRole("heading", { name: "Banner CTA" })).toBeInTheDocument();
  });
});
