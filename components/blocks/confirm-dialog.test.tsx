import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ConfirmDialog } from "./confirm-dialog";

describe("ConfirmDialog", () => {
  it("renders title and description when open (controlled)", async () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="Delete item?"
        description="This action cannot be undone."
      />,
    );

    expect(await screen.findByText("Delete item?")).toBeInTheDocument();
    expect(
      await screen.findByText("This action cannot be undone."),
    ).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(
      <ConfirmDialog
        open
        onOpenChange={() => {}}
        title="Delete item?"
        onConfirm={onConfirm}
      />,
    );

    const confirm = await screen.findByRole("button", { name: "Confirm" });
    fireEvent.click(confirm);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
