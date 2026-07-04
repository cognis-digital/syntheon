import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";

describe("Collapsible", () => {
  it("shows content when open", () => {
    render(
      <Collapsible open={true}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden details</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByText("Hidden details")).toBeInTheDocument();
  });

  it("does not render content when closed (Radix unmounts closed content)", () => {
    render(
      <Collapsible open={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden details</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();
  });
});
