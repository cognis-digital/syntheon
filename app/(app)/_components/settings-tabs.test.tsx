import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SettingsTabs } from "./settings-tabs";

const PROFILE = { firstName: "Dev", lastName: "User", email: "you@syntheon.dev" };

describe("SettingsTabs", () => {
  it("shows the profile tab by default with prefilled fields", () => {
    render(<SettingsTabs profile={PROFILE} />);
    expect(screen.getByRole("tab", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByLabelText("First name")).toHaveValue("Dev");
    expect(screen.getByLabelText("Email")).toHaveValue("you@syntheon.dev");
  });

  it("exposes appearance and billing tabs", () => {
    render(<SettingsTabs profile={PROFILE} />);
    expect(screen.getByRole("tab", { name: "Appearance" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Billing" })).toBeInTheDocument();
  });

  it("switches to the appearance tab and shows theme options", async () => {
    render(<SettingsTabs profile={PROFILE} />);
    const tab = screen.getByRole("tab", { name: "Appearance" });
    fireEvent.pointerDown(tab, { button: 0, ctrlKey: false });
    fireEvent.mouseDown(tab, { button: 0, ctrlKey: false });
    tab.focus();
    fireEvent.click(tab);
    expect(await screen.findByText("Theme")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
  });
});
