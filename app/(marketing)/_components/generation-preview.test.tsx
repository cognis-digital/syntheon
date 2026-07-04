import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { GenerationPreview } from "./generation-preview";

describe("GenerationPreview", () => {
  it("renders the builder command and both menu + app panes", () => {
    render(<GenerationPreview />);
    expect(screen.getByText(/npm run studio/i)).toBeInTheDocument();
    expect(screen.getByText("localhost:3000")).toBeInTheDocument();
  });

  it("lists the selected feature values", () => {
    render(<GenerationPreview />);
    expect(screen.getByText("Clerk + waitlist")).toBeInTheDocument();
    expect(screen.getByText("Stripe Billing")).toBeInTheDocument();
    expect(screen.getByText("local Ollama")).toBeInTheDocument();
  });

  it("renders the four verification gate labels", () => {
    render(<GenerationPreview />);
    expect(screen.getByText("typecheck")).toBeInTheDocument();
    expect(screen.getByText("lint")).toBeInTheDocument();
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("build")).toBeInTheDocument();
  });
});
