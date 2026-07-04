import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Hero } from "./hero";

describe("Hero", () => {
  it("renders title, description and actions (centered)", () => {
    render(
      <Hero
        eyebrow="New"
        title="Build faster"
        description="Own every line."
        primaryAction={{ label: "Get started", href: "/start" }}
        secondaryAction={{ label: "Docs", href: "/docs" }}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Build faster" })).toBeInTheDocument();
    expect(screen.getByText("Own every line.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get started/ })).toHaveAttribute("href", "/start");
    expect(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders each variant without crashing", () => {
    for (const variant of ["centered", "split", "with-image", "gradient", "minimal"] as const) {
      const { unmount } = render(<Hero variant={variant} title={`Title ${variant}`} />);
      expect(screen.getByText(`Title ${variant}`)).toBeInTheDocument();
      unmount();
    }
  });
});
