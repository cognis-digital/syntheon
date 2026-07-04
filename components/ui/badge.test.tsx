import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  it("renders default variant text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders destructive variant text", () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByText("Error");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-destructive");
  });
});
