import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// recharts' ResponsiveContainer needs layout dims that jsdom doesn't provide;
// stub the chart to a marker so the page composition is what we assert.
vi.mock("../_components/generation-chart", () => ({
  GenerationChart: () => <div data-testid="generation-chart" />,
}));

import DashboardPage from "./page";

describe("Dashboard overview", () => {
  it("renders the overview heading", () => {
    render(<DashboardPage />);
    expect(screen.getByRole("heading", { level: 1, name: /overview/i })).toBeInTheDocument();
  });

  it("renders the KPI stat cards", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Units generated")).toBeInTheDocument();
    expect(screen.getByText("Gate pass rate")).toBeInTheDocument();
    expect(screen.getByText("98.7%")).toBeInTheDocument();
  });

  it("renders the throughput chart and recent units", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("generation-chart")).toBeInTheDocument();
    expect(screen.getByText("Recent units")).toBeInTheDocument();
    expect(screen.getByText("app/(app)/settings/page.tsx")).toBeInTheDocument();
  });
});
