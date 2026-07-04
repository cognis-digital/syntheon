import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("renders with a placeholder", () => {
    render(<Input placeholder="Your name" />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
  });

  it("updates its value on change", () => {
    render(<Input placeholder="email" />);
    const input = screen.getByPlaceholderText("email") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "hi@example.com" } });
    expect(input.value).toBe("hi@example.com");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Input placeholder="disabled" disabled />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });
});
