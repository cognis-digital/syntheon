import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

describe("RadioGroup", () => {
  it("selects the clicked item and deselects others", () => {
    render(
      <RadioGroup>
        <div>
          <RadioGroupItem value="a" id="opt-a" />
          <Label htmlFor="opt-a">Option A</Label>
        </div>
        <div>
          <RadioGroupItem value="b" id="opt-b" />
          <Label htmlFor="opt-b">Option B</Label>
        </div>
      </RadioGroup>,
    );

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    const [a, b] = radios;

    expect(a).toHaveAttribute("aria-checked", "false");
    expect(b).toHaveAttribute("aria-checked", "false");

    fireEvent.click(a);
    expect(a).toHaveAttribute("aria-checked", "true");
    expect(b).toHaveAttribute("aria-checked", "false");

    fireEvent.click(b);
    expect(a).toHaveAttribute("aria-checked", "false");
    expect(b).toHaveAttribute("aria-checked", "true");
  });
});
