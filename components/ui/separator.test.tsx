import { render, screen } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  it("is decorative by default (no separator role)", () => {
    const { container } = render(<Separator />);
    expect(screen.queryByRole("separator")).toBeNull();
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes separator role when not decorative", () => {
    render(<Separator decorative={false} orientation="vertical" />);
    const sep = screen.getByRole("separator");
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
  });
});
