import { render, screen } from "@testing-library/react";
import { Progress } from "./progress";

describe("Progress", () => {
  it("renders a progressbar with aria-valuenow", () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "40");
  });
});
