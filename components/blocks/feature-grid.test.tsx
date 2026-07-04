import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Zap } from "lucide-react";

import { FeatureGrid } from "./feature-grid";

describe("FeatureGrid", () => {
  it("renders heading and all features", () => {
    render(
      <FeatureGrid
        heading="Features"
        subheading="Everything you need"
        features={[
          { title: "Fast", description: "Very fast", icon: Zap },
          { title: "Safe", description: "Very safe" },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Features" })).toBeInTheDocument();
    expect(screen.getByText("Fast")).toBeInTheDocument();
    expect(screen.getByText("Very safe")).toBeInTheDocument();
  });
});
