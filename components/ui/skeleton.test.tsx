import { render } from "@testing-library/react";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("has the animate-pulse class", () => {
    const { container } = render(<Skeleton data-testid="sk" />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });
});
