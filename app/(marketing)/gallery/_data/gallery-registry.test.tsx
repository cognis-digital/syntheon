import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  GALLERY,
  GALLERY_CATEGORIES,
  defaultControlValues,
} from "./gallery-registry";

describe("gallery registry", () => {
  it("has unique entry ids", () => {
    const ids = GALLERY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only uses declared categories", () => {
    for (const entry of GALLERY) {
      expect(GALLERY_CATEGORIES).toContain(entry.category);
    }
  });

  it("every entry has a source path and description", () => {
    for (const entry of GALLERY) {
      expect(entry.source).toMatch(/\.(tsx|ts)$/);
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });

  it("derives default control values from an entry's controls", () => {
    const withControls = GALLERY.find((e) => (e.controls?.length ?? 0) > 0)!;
    const values = defaultControlValues(withControls);
    for (const control of withControls.controls!) {
      expect(values[control.name]).toBe(control.default);
    }
  });

  it("renders every entry's preview without throwing (default props)", () => {
    for (const entry of GALLERY) {
      const values = defaultControlValues(entry);
      const { unmount } = render(<>{entry.render(values)}</>);
      unmount();
    }
  });

  it("covers every category with at least one entry", () => {
    for (const cat of GALLERY_CATEGORIES) {
      expect(GALLERY.some((e) => e.category === cat)).toBe(true);
    }
  });
});
