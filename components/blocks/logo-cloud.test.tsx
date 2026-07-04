import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { LogoCloud } from "./logo-cloud";

describe("LogoCloud", () => {
  it("renders heading and each logo node", () => {
    render(
      <LogoCloud
        heading="Trusted by"
        logos={[<span key="a">Acme</span>, <span key="b">Globex</span>]}
      />,
    );
    expect(screen.getByText("Trusted by")).toBeInTheDocument();
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Globex")).toBeInTheDocument();
  });
});
