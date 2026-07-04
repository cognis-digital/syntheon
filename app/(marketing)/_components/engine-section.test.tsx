import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { EngineSection } from "./engine-section";

describe("EngineSection", () => {
  it("renders the four pipeline stages in order", () => {
    render(<EngineSection />);
    expect(screen.getByText("Planner")).toBeInTheDocument();
    expect(screen.getByText("Coder")).toBeInTheDocument();
    expect(screen.getByText("Harness")).toBeInTheDocument();
    expect(screen.getByText("Integrate")).toBeInTheDocument();
  });

  it("explains the bounded repair loop", () => {
    render(<EngineSection />);
    expect(screen.getByText(/repair loop/i)).toBeInTheDocument();
    expect(screen.getAllByText(/never stays red/i).length).toBeGreaterThan(0);
  });

  it("has an accessible section landmark heading", () => {
    render(<EngineSection />);
    expect(
      screen.getByRole("heading", { name: /small local model builds a large, correct app/i }),
    ).toBeInTheDocument();
  });
});
