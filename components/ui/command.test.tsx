import { render, screen, fireEvent } from "@testing-library/react";

// cmdk relies on ResizeObserver, which jsdom does not provide.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

// jsdom does not implement scrollIntoView, which cmdk calls on selection.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command";

describe("Command", () => {
  it("filters items as the user types", async () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Fruits">
            <CommandItem>Apple</CommandItem>
            <CommandItem>Banana</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "App" },
    });

    expect(await screen.findByText("Apple")).toBeInTheDocument();
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });
});
