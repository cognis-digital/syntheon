import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { InputOTP } from "./input-otp";

describe("InputOTP", () => {
  it("renders one input per length slot", () => {
    render(<InputOTP length={4} />);
    const boxes = screen.getAllByLabelText(/Digit/);
    expect(boxes).toHaveLength(4);
  });

  it("calls onChange when a digit is entered", () => {
    const onChange = vi.fn();
    render(<InputOTP length={4} onChange={onChange} />);
    const first = screen.getByLabelText("Digit 1");
    fireEvent.change(first, { target: { value: "5" } });
    expect(onChange).toHaveBeenCalledWith("5");
  });

  it("disables all inputs when disabled", () => {
    render(<InputOTP length={4} disabled />);
    screen.getAllByLabelText(/Digit/).forEach((el) => expect(el).toBeDisabled());
  });
});
