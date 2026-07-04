import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Stepper } from "./stepper";

const steps = [
  { label: "Account" },
  { label: "Profile", description: "Tell us about you" },
  { label: "Confirm" },
];

describe("Stepper", () => {
  it("renders all step labels and marks the current step", () => {
    render(<Stepper steps={steps} currentStep={1} />);

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();

    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).not.toHaveAttribute("aria-current");
  });
});
