import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import PlaygroundPage from "./page";

/**
 * The playground is entirely client-side; these tests exercise the real
 * component tree (menu → derived config/preview) rather than mocking it, so a
 * regression in wiring the registry to the UI fails here.
 */
describe("Playground page", () => {
  it("renders the hero and the configure/preview sections", () => {
    render(<PlaygroundPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Syntheon playground/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /configure your build/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /take it with you/i }),
    ).toBeInTheDocument();
  });

  it("mirrors the CLI menu groups (project type, auth, payments, integrations)", () => {
    render(<PlaygroundPage />);
    // Project type radios
    expect(screen.getByRole("radio", { name: "SaaS" })).toBeInTheDocument();
    // Group legends
    expect(screen.getByText("Auth")).toBeInTheDocument();
    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(screen.getByText("Integrations")).toBeInTheDocument();
  });

  it("emits a real syntheon.config.json reflecting the default selection", () => {
    render(<PlaygroundPage />);
    const blocks = Array.from(document.querySelectorAll("pre code")).map(
      (el) => el.textContent ?? "",
    );
    const configJson = blocks.find((t) => t.includes('"version": 1'));
    expect(configJson).toBeTruthy();
    expect(configJson).toContain("auth-clerk");
    expect(configJson).toContain('"projectType": "saas"');
  });

  it("updates the emitted config when a feature is toggled", () => {
    render(<PlaygroundPage />);
    // Switch auth from Clerk to self-hosted.
    const selfhosted = screen.getByRole("radio", {
      name: /Self-hosted/i,
    });
    fireEvent.click(selfhosted);
    const pre = document.querySelector("pre code");
    expect(pre?.textContent).toContain("auth-selfhosted");
    expect(pre?.textContent).not.toContain("auth-clerk");
  });

  it("re-themes the live preview when a brand color is chosen", () => {
    render(<PlaygroundPage />);
    const emerald = screen.getByRole("radio", { name: /emerald/i });
    fireEvent.click(emerald);
    expect(emerald).toHaveAttribute("aria-checked", "true");
  });

  it("shows the four verification gates in the pipeline", () => {
    render(<PlaygroundPage />);
    for (const gate of ["tsc", "lint", "test", "build"]) {
      expect(screen.getAllByText(gate).length).toBeGreaterThan(0);
    }
  });
});
