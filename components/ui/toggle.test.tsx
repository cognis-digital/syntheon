import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Toggle } from "./toggle";

describe("Toggle", () => {
  it("toggles aria-pressed on click", () => {
    render(<Toggle defaultPressed={false}>Bold</Toggle>);
    const btn = screen.getByRole("button", { name: "Bold" });
    expect(btn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("calls onPressedChange with the next state", () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle defaultPressed={false} onPressedChange={onPressedChange}>
        Italic
      </Toggle>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});
