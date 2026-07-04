import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Bento } from "./bento";

describe("Bento", () => {
  const items = [
    { title: "Fast", description: "Blazing speed." },
    { title: "Secure", description: "End to end." },
  ];

  it("renders the heading and item titles", () => {
    render(<Bento heading="Why us" items={items} />);

    expect(screen.getByText("Why us")).toBeInTheDocument();
    expect(screen.getByText("Fast")).toBeInTheDocument();
    expect(screen.getByText("Secure")).toBeInTheDocument();
  });
});
