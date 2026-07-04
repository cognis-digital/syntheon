import { render, screen, fireEvent } from "@testing-library/react";
import { Calendar } from "./calendar";

describe("Calendar", () => {
  it("shows the month label for the selected date", () => {
    const selected = new Date(2026, 5, 15); // June 2026
    render(<Calendar selected={selected} />);
    expect(screen.getByText("June 2026")).toBeInTheDocument();
  });

  it("calls onSelect when a day is clicked", () => {
    const selected = new Date(2026, 5, 15);
    const onSelect = vi.fn();
    render(<Calendar selected={selected} onSelect={onSelect} />);
    // Click the "15" day cell.
    const cells = screen.getAllByRole("gridcell");
    const day15 = cells.find((c) => c.textContent === "15");
    expect(day15).toBeDefined();
    fireEvent.click(day15!);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0]).toBeInstanceOf(Date);
  });
});
