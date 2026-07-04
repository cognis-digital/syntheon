import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { TestimonialWall } from "./testimonial-wall";

describe("TestimonialWall", () => {
  it("renders quotes and author names with fallback initials", () => {
    render(
      <TestimonialWall
        heading="Loved by builders"
        testimonials={[
          { quote: "It changed my workflow.", name: "Ada Lovelace", role: "Engineer" },
        ]}
      />,
    );
    expect(screen.getByText(/It changed my workflow\./)).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
