import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Boxes } from "lucide-react";

import { StatCard } from "./stat-card";

describe("StatCard", () => {
  it("renders the label, value, and positive delta", () => {
    render(<StatCard label="Units generated" value="533" icon={Boxes} delta="+18.2%" hint="vs last week" />);
    expect(screen.getByText("Units generated")).toBeInTheDocument();
    expect(screen.getByText("533")).toBeInTheDocument();
    expect(screen.getByText("+18.2%")).toBeInTheDocument();
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });

  it("renders a negative delta", () => {
    render(<StatCard label="Repairs" value="0.9" icon={Boxes} delta="-0.3" />);
    expect(screen.getByText("-0.3")).toBeInTheDocument();
  });
});
