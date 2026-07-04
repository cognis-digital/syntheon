import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Switch } from "@/components/ui/switch";

describe("Switch", () => {
  it("renders with role switch", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("toggles checked state on click", () => {
    render(<Switch />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });
});
