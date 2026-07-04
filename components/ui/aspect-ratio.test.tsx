import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { AspectRatio } from "./aspect-ratio";

describe("AspectRatio", () => {
  it("renders its child and applies an aspect-ratio inline style", () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="ar">
        <span>Media</span>
      </AspectRatio>,
    );
    expect(screen.getByText("Media")).toBeInTheDocument();
    const wrapper = screen.getByTestId("ar");
    expect(wrapper.style.aspectRatio).toBe(String(16 / 9));
  });
});
