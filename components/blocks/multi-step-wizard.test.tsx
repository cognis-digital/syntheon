import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { MultiStepWizard } from "./multi-step-wizard";

describe("MultiStepWizard", () => {
  const steps = [
    { id: "one", title: "Account", content: <div>Account content</div> },
    { id: "two", title: "Confirm", content: <div>Confirm content</div> },
  ];

  it("shows step 1 with Back disabled, advances to step 2, and completes", async () => {
    const onComplete = vi.fn().mockResolvedValue(undefined);
    render(<MultiStepWizard steps={steps} onComplete={onComplete} />);

    // Step 1 visible
    expect(
      screen.getByRole("heading", { name: "Account" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Account content")).toBeInTheDocument();

    // Back disabled on first step
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();

    // Advance to step 2
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Confirm content")).toBeInTheDocument();

    // Last step: button label becomes finish label; clicking calls onComplete
    const finish = screen.getByRole("button", { name: "Finish" });
    fireEvent.click(finish);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
