// matchMedia polyfill — SidebarProvider uses useIsMobile
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

import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";

describe("SidebarNav", () => {
  const items = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/settings" },
  ];

  it("renders items and marks the active link with aria-current", () => {
    render(
      <SidebarProvider>
        <SidebarNav items={items} activeHref="/dashboard" />
      </SidebarProvider>,
    );

    const dashboard = screen.getByRole("link", { name: "Dashboard" });
    const settings = screen.getByRole("link", { name: "Settings" });

    expect(dashboard).toBeInTheDocument();
    expect(settings).toBeInTheDocument();

    expect(dashboard).toHaveAttribute("aria-current", "page");
    expect(settings).not.toHaveAttribute("aria-current");
  });
});
