import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders the title and description and fires the action onClick", () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="No projects yet"
        description="Create your first project to get started."
        action={{ label: "New project", onClick }}
      />,
    );

    expect(screen.getByText("No projects yet")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first project to get started."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "New project" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
