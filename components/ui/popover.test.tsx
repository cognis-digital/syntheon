import { render, screen, fireEvent } from "@testing-library/react";

import { Popover, PopoverTrigger, PopoverContent } from "./popover";

describe("Popover", () => {
  it("shows content after the trigger is clicked", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    );

    expect(screen.getByText("Open popover")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Open popover"));

    expect(await screen.findByText("Popover body")).toBeInTheDocument();
  });
});
