import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

describe("Tabs", () => {
  it("shows the active tab content and switches on trigger click", async () => {
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>,
    );

    expect(screen.getByText("First panel")).toBeInTheDocument();
    expect(screen.queryByText("Second panel")).not.toBeInTheDocument();

    const secondTab = screen.getByRole("tab", { name: "Two" });
    // Radix Tabs select via a primary-button pointerdown; supply button: 0 explicitly.
    fireEvent.pointerDown(secondTab, { button: 0, ctrlKey: false });
    fireEvent.mouseDown(secondTab, { button: 0, ctrlKey: false });
    secondTab.focus();
    fireEvent.click(secondTab);

    expect(await screen.findByText("Second panel")).toBeInTheDocument();
  });
});
