import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ProjectList, type Project } from "./project-list";

const SAMPLE: Project[] = [
  {
    id: "prj_1",
    name: "Aurora SaaS",
    description: "Billing + dashboard.",
    type: "SaaS",
    units: 412,
    updated: "2h ago",
  },
];

describe("ProjectList", () => {
  it("renders a grid of projects when populated", () => {
    render(<ProjectList projects={SAMPLE} />);
    expect(screen.getByText("Aurora SaaS")).toBeInTheDocument();
    expect(screen.getByText("SaaS")).toBeInTheDocument();
    expect(screen.getByText("412 units")).toBeInTheDocument();
  });

  it("renders the empty state when there are no projects", () => {
    render(<ProjectList projects={[]} />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /new project/i })).toBeInTheDocument();
  });
});
