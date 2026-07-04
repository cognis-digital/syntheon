import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Kbd } from "./kbd";

describe("Kbd", () => {
  it("renders its text inside a kbd element", () => {
    render(<Kbd>Ctrl</Kbd>);
    const el = screen.getByText("Ctrl");
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("KBD");
  });
});
