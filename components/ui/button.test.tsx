import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders a button with text by default", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toBeInTheDocument();
  });

  it("applies variant className tokens", () => {
    render(<Button variant="destructive">Danger</Button>);
    expect(screen.getByRole("button", { name: "Danger" })).toHaveClass("bg-destructive");
  });

  it.each(["default", "destructive", "outline", "secondary", "ghost", "link"] as const)(
    "renders without crashing for variant %s",
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole("button", { name: variant })).toBeInTheDocument();
    },
  );

  it.each(["default", "sm", "lg", "icon"] as const)("renders size %s", (size) => {
    render(<Button size={size}>btn-{size}</Button>);
    expect(screen.getByRole("button", { name: `btn-${size}` })).toBeInTheDocument();
  });

  it("renders as a child anchor when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/home">Home link</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Home link" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
  });
});
