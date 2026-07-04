import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

describe("Accordion", () => {
  it("reveals content when the trigger is clicked", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent>Hidden details</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.queryByText("Hidden details")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Section" }));

    expect(screen.getByText("Hidden details")).toBeInTheDocument();
  });
});
