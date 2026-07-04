import { render, screen, fireEvent } from "@testing-library/react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";

describe("DropdownMenu", () => {
  it("renders the trigger", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByText("Open menu")).toBeInTheDocument();
  });

  it("shows an item after the trigger is clicked", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // Radix menus open on pointer/keyboard interaction rather than a synthetic
    // click, so drive the keyboard path which is deterministic under jsdom.
    const trigger = screen.getByText("Open menu");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter", code: "Enter" });

    expect(await screen.findByText("Profile")).toBeInTheDocument();
  });
});
