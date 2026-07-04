import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SettingsLayout } from "./settings-layout";

describe("SettingsLayout", () => {
  const sections = [
    { id: "profile", label: "Profile", content: <div>Profile settings</div> },
    { id: "billing", label: "Billing", content: <div>Billing settings</div> },
  ];

  it("shows the first section by default and switches on nav click", () => {
    render(<SettingsLayout sections={sections} />);

    // Nav labels present
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Billing" })).toBeInTheDocument();

    // First section content visible
    expect(screen.getByText("Profile settings")).toBeInTheDocument();
    expect(screen.queryByText("Billing settings")).not.toBeInTheDocument();

    // Switch to the second section
    fireEvent.click(screen.getByRole("button", { name: "Billing" }));
    expect(screen.getByText("Billing settings")).toBeInTheDocument();
  });
});
