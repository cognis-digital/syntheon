import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox", () => {
  it("renders with role checkbox", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("toggles aria-checked on click", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });
});
