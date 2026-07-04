import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup", () => {
  it("selects a single item and reports its value", () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="single" onValueChange={onValueChange}>
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    );

    const left = screen.getByRole("button", { name: "Left" });
    const right = screen.getByRole("button", { name: "Right" });
    expect(left).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(left);

    expect(onValueChange).toHaveBeenCalledWith("left");
    expect(left).toHaveAttribute("aria-pressed", "true");
    expect(right).toHaveAttribute("aria-pressed", "false");
  });
});
