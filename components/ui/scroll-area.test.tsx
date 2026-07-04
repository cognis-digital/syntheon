import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ScrollArea, ScrollBar } from "./scroll-area";

describe("ScrollArea", () => {
  it("renders its child content", () => {
    render(
      <ScrollArea>
        <div>Scrollable content</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>,
    );
    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });
});
