import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Drawer, DrawerContent, DrawerTitle } from "./drawer";

describe("Drawer", () => {
  it("renders the title when controlled open", async () => {
    render(
      <Drawer open={true}>
        <DrawerContent>
          <DrawerTitle>Drawer title</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    expect(await screen.findByText("Drawer title")).toBeInTheDocument();
  });
});
