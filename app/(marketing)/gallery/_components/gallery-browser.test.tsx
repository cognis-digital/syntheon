import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { GalleryBrowser } from "./gallery-browser";
import { GALLERY } from "../_data/gallery-registry";

describe("GalleryBrowser", () => {
  it("renders a tile for every registry entry by default", () => {
    render(<GalleryBrowser />);
    // The count line reflects the full registry.
    expect(
      screen.getByText(`${GALLERY.length} components`),
    ).toBeInTheDocument();
    // Button component is present.
    expect(screen.getAllByText("Button").length).toBeGreaterThan(0);
  });

  it("filters by free-text search", () => {
    render(<GalleryBrowser />);
    fireEvent.change(screen.getByLabelText("Search components"), {
      target: { value: "accordion" },
    });
    expect(screen.getByText("1 component")).toBeInTheDocument();
  });

  it("filters by category tab", () => {
    render(<GalleryBrowser />);
    const inputsCount = GALLERY.filter((e) => e.category === "Inputs").length;
    fireEvent.click(screen.getByRole("tab", { name: /Inputs/ }));
    expect(
      screen.getByText(`${inputsCount} components`),
    ).toBeInTheDocument();
  });

  it("shows an empty state and can clear it", () => {
    render(<GalleryBrowser />);
    fireEvent.change(screen.getByLabelText("Search components"), {
      target: { value: "nonexistent-xyz" },
    });
    expect(screen.getByText("No components match")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(
      screen.getByText(`${GALLERY.length} components`),
    ).toBeInTheDocument();
  });
});
