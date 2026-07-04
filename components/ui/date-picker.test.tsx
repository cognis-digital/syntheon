import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

if (!window.matchMedia)
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  })) as any;

import { DatePicker } from "./date-picker";

describe("DatePicker", () => {
  it("shows the placeholder on the trigger button", () => {
    render(<DatePicker placeholder="Pick a day" />);
    expect(screen.getByRole("button", { name: /Pick a day/ })).toBeInTheDocument();
  });

  it("shows the formatted date when a value is provided", () => {
    render(<DatePicker value={new Date(2024, 0, 15)} />);
    // date-fns "PPP" -> "January 15th, 2024"
    expect(screen.getByRole("button", { name: /January 15th, 2024/ })).toBeInTheDocument();
  });

  it("opens the calendar when the trigger is clicked", async () => {
    render(<DatePicker value={new Date(2024, 0, 15)} />);
    const trigger = screen.getByRole("button", { name: /January 15th, 2024/ });
    fireEvent.pointerDown(trigger, { button: 0 });
    fireEvent.click(trigger);
    // Calendar renders a month label ("January 2024"); if flaky the placeholder
    // assertions above still cover the component.
    expect(await screen.findByText("January 2024")).toBeInTheDocument();
  });
});
