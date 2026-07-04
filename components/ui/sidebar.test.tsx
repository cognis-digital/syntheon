import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

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

import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "./sidebar";

describe("Sidebar", () => {
  function renderSidebar() {
    return render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Brand</SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Home</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
          Body
        </SidebarInset>
      </SidebarProvider>,
    );
  }

  it("renders menu, body and the toggle trigger", () => {
    renderSidebar();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toggle Sidebar" })).toBeInTheDocument();
  });

  it("does not throw when the trigger is clicked", () => {
    renderSidebar();
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: "Toggle Sidebar" })),
    ).not.toThrow();
  });
});
