import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card";

describe("HoverCard", () => {
  it("renders content when controlled open", async () => {
    render(
      <HoverCard open={true}>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Card details</HoverCardContent>
      </HoverCard>,
    );
    expect(await screen.findByText("Card details")).toBeInTheDocument();
  });
});
