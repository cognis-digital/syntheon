import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import DocsPage from "./page";

describe("Docs index", () => {
  it("renders the docs heading and DESIGN.md reference", () => {
    render(<DocsPage />);
    expect(screen.getByRole("heading", { level: 1, name: /Build with Syntheon/i })).toBeInTheDocument();
    expect(screen.getAllByText(/DESIGN\.md/i).length).toBeGreaterThan(0);
  });

  it("lists the design-system topics", () => {
    render(<DocsPage />);
    expect(screen.getByText("Philosophy")).toBeInTheDocument();
    expect(screen.getByText("The generation engine")).toBeInTheDocument();
    expect(screen.getByText("The verification harness")).toBeInTheDocument();
  });

  it("includes a quickstart with the clone command", () => {
    render(<DocsPage />);
    expect(screen.getByText("Quickstart")).toBeInTheDocument();
    expect(screen.getByText(/git clone/i)).toBeInTheDocument();
  });
});
