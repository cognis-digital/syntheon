import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";

describe("Dialog", () => {
  it("renders the title when controlled open", async () => {
    render(
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled title</DialogTitle>
            <DialogDescription>Controlled description</DialogDescription>
          </DialogHeader>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    );
    expect(await screen.findByText("Controlled title")).toBeInTheDocument();
    expect(screen.getByText("Controlled description")).toBeInTheDocument();
  });

  it("opens on trigger interaction", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Triggered title</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByText("Open dialog");
    fireEvent.pointerDown(trigger, { button: 0 });
    fireEvent.click(trigger);
    expect(await screen.findByText("Triggered title")).toBeInTheDocument();
  });
});
