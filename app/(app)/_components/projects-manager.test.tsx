import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Stub server actions (they import next/cache + next/headers).
vi.mock("../_data/projects-actions", () => ({
  createProject: vi.fn(async () => ({ ok: true })),
  updateProject: vi.fn(async () => ({ ok: true })),
  deleteProject: vi.fn(async () => ({ ok: true })),
}));
vi.mock("sonner", () => ({
  toast: { info: vi.fn(), error: vi.fn(), success: vi.fn() },
}));

import { ProjectsManager } from "./projects-manager";
import type { ProjectRecord } from "../_data/projects-store";

function project(over: Partial<ProjectRecord> = {}): ProjectRecord {
  const now = Date.now();
  return {
    id: "prj_1",
    ownerId: "usr_1",
    name: "Aurora",
    description: "Analytics SaaS",
    type: "SaaS",
    status: "live",
    units: 100,
    createdAt: now,
    updatedAt: now,
    ...over,
  };
}

describe("ProjectsManager", () => {
  it("renders the empty state when there are no projects", () => {
    render(<ProjectsManager initialProjects={[]} />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
  });

  it("lists projects with their status badge", () => {
    render(<ProjectsManager initialProjects={[project()]} />);
    expect(screen.getByText("Aurora")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("filters projects by search query", () => {
    render(
      <ProjectsManager
        initialProjects={[
          project({ id: "a", name: "Aurora" }),
          project({ id: "b", name: "Harbor", description: "directory" }),
        ]}
      />,
    );
    const search = screen.getByLabelText("Search projects");
    fireEvent.change(search, { target: { value: "harbor" } });
    expect(screen.getByText("Harbor")).toBeInTheDocument();
    expect(screen.queryByText("Aurora")).not.toBeInTheDocument();
  });

  it("shows a no-results empty state and can clear filters", () => {
    render(<ProjectsManager initialProjects={[project()]} />);
    fireEvent.change(screen.getByLabelText("Search projects"), {
      target: { value: "zzzz" },
    });
    expect(screen.getByText("No matching projects")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Aurora")).toBeInTheDocument();
  });

  it("exposes per-project actions via the row menu", () => {
    render(<ProjectsManager initialProjects={[project()]} />);
    const menu = screen.getByRole("button", { name: "Actions for Aurora" });
    expect(menu).toBeInTheDocument();
    expect(
      within(screen.getByText("Aurora").closest("div")!).queryByText("Aurora"),
    ).toBeTruthy();
  });
});
