import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Label } from "./label";

describe("Label", () => {
  it("renders its text and associates via htmlFor", () => {
    render(<Label htmlFor="email">Email address</Label>);
    const label = screen.getByText("Email address");
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "email");
  });

  it("does not throw when clicked", () => {
    render(<Label htmlFor="field">Click me</Label>);
    const label = screen.getByText("Click me");
    fireEvent.click(label);
    expect(label).toBeInTheDocument();
  });
});
