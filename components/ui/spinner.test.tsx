import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders with role status and the default Loading label", () => {
    render(<Spinner />);
    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-label", "Loading");
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Fetching" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Fetching");
  });
});
