import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Stats } from "./stats";

describe("Stats", () => {
  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "12k", label: "Customers", description: "and growing" },
    { value: "40ms", label: "Latency" },
  ];

  it("renders the heading, values, and labels", () => {
    render(<Stats heading="By the numbers" stats={stats} />);

    expect(screen.getByText("By the numbers")).toBeInTheDocument();

    for (const s of stats) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }

    expect(screen.getByText("and growing")).toBeInTheDocument();
  });
});
