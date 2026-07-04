import { render, screen, fireEvent } from "@testing-library/react";
import { Slider } from "./slider";

describe("Slider", () => {
  it("renders a native range input (role slider)", () => {
    render(<Slider defaultValue={50} />);
    const input = screen.getByRole("slider") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("50");
  });

  it("fires onValueChange when changed", () => {
    const onValueChange = vi.fn();
    render(<Slider defaultValue={50} onValueChange={onValueChange} />);
    const input = screen.getByRole("slider");
    fireEvent.change(input, { target: { value: "75" } });
    expect(onValueChange).toHaveBeenCalledWith(75);
  });
});
