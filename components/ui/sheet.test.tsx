import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Sheet, SheetContent, SheetTitle } from "./sheet";

describe("Sheet", () => {
  it("renders the title when controlled open (default side)", async () => {
    render(
      <Sheet open={true}>
        <SheetContent>
          <SheetTitle>Sheet title</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(await screen.findByText("Sheet title")).toBeInTheDocument();
  });

  it("renders with the left side variant", async () => {
    render(
      <Sheet open={true}>
        <SheetContent side="left">
          <SheetTitle>Left sheet</SheetTitle>
        </SheetContent>
      </Sheet>,
    );
    expect(await screen.findByText("Left sheet")).toBeInTheDocument();
  });
});
