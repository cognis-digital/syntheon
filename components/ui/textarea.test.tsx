import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders with a placeholder", () => {
    render(<Textarea placeholder="Your bio" />);
    expect(screen.getByPlaceholderText("Your bio")).toBeInTheDocument();
  });

  it("updates its value on change", () => {
    render(<Textarea placeholder="notes" />);
    const ta = screen.getByPlaceholderText("notes") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "line one" } });
    expect(ta.value).toBe("line one");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Textarea placeholder="off" disabled />);
    expect(screen.getByPlaceholderText("off")).toBeDisabled();
  });
});
