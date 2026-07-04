import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { FormModal } from "./form-modal";

describe("FormModal", () => {
  it("renders the title and children when open (controlled)", async () => {
    render(
      <FormModal open onOpenChange={() => {}} title="New project">
        <input aria-label="Project name" />
      </FormModal>,
    );

    expect(await screen.findByText("New project")).toBeInTheDocument();
    expect(await screen.findByLabelText("Project name")).toBeInTheDocument();
  });

  it("calls onSubmit when the submit button is clicked", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <FormModal open onOpenChange={() => {}} title="New project" onSubmit={onSubmit}>
        <input aria-label="Project name" />
      </FormModal>,
    );

    const submit = await screen.findByRole("button", { name: "Save" });
    fireEvent.click(submit);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
