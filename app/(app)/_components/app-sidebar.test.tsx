import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

import { AppSidebar } from "./app-sidebar";

describe("AppSidebar", () => {
  it("renders all primary nav items", () => {
    render(<AppSidebar />);
    expect(screen.getByRole("link", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
  });

  it("marks the active route with aria-current", () => {
    render(<AppSidebar />);
    const overview = screen.getByRole("link", { name: /overview/i });
    expect(overview).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /projects/i })).not.toHaveAttribute("aria-current");
  });
});
