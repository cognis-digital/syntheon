// matchMedia polyfill — DashboardShell uses useIsMobile via SidebarProvider
if (!window.matchMedia)
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  })) as any;

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { DashboardShell } from "./dashboard-shell";

describe("DashboardShell", () => {
  it("renders nav, topbar, children, and the sidebar toggle", () => {
    render(
      <DashboardShell nav={<div>Nav here</div>} topbar={<span>Topbar</span>}>
        <div>Main content</div>
      </DashboardShell>,
    );

    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Topbar")).toBeInTheDocument();
    expect(screen.getByText("Nav here")).toBeInTheDocument();

    // Default brand renders (may appear more than once)
    expect(screen.getAllByText("Syntheon").length).toBeGreaterThanOrEqual(1);

    // Sidebar trigger exposes sr-only "Toggle Sidebar" text
    expect(
      screen.getByRole("button", { name: /toggle sidebar/i }),
    ).toBeInTheDocument();
  });
});
