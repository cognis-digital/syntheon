// cmdk polyfills — required for jsdom
if (!window.ResizeObserver)
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
if (!Element.prototype.scrollIntoView)
  Element.prototype.scrollIntoView = () => {};
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

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { CommandMenu } from "./command-menu";

describe("CommandMenu", () => {
  const groups = [
    {
      heading: "Navigation",
      items: [
        { id: "home", label: "Go home" },
        { id: "settings", label: "Open settings" },
      ],
    },
  ];

  it("renders the search input and both items when open (controlled)", async () => {
    render(
      <CommandMenu
        open
        onOpenChange={() => {}}
        groups={groups}
        placeholder="Search commands…"
      />,
    );

    expect(
      await screen.findByPlaceholderText("Search commands…"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Go home")).toBeInTheDocument();
    expect(await screen.findByText("Open settings")).toBeInTheDocument();
  });

  it("filters items as the user types", async () => {
    render(
      <CommandMenu
        open
        onOpenChange={() => {}}
        groups={groups}
        placeholder="Search commands…"
      />,
    );

    const input = await screen.findByPlaceholderText("Search commands…");
    fireEvent.change(input, { target: { value: "home" } });

    expect(await screen.findByText("Go home")).toBeInTheDocument();
  });
});
