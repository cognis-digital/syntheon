import { describe, it, expect } from "vitest";
import {
  assembleContext,
  renderContext,
  memoryFileSource,
  DESIGN_TOKENS_SUMMARY,
} from "./context.js";
import { unit } from "./__testkit.js";

describe("assembleContext", () => {
  it("includes declared dependencies", () => {
    const files = new Map([
      ["components/ui/button.tsx", "export const Button = () => null;"],
    ]);
    const u = unit("app/page.tsx", { dependsOn: ["components/ui/button.tsx"] });
    const ctx = assembleContext(u, memoryFileSource(files));
    expect(ctx.files).toHaveLength(1);
    expect(ctx.files[0].reason).toBe("dependency");
    expect(ctx.files[0].path).toBe("components/ui/button.tsx");
  });

  it("includes sibling files in the same directory", () => {
    const files = new Map([
      ["components/ui/input.tsx", "export const Input = () => null;"],
      ["components/ui/label.tsx", "export const Label = () => null;"],
    ]);
    const u = unit("components/ui/widget.tsx");
    const ctx = assembleContext(u, memoryFileSource(files));
    expect(ctx.files.map((f) => f.path).sort()).toEqual([
      "components/ui/input.tsx",
      "components/ui/label.tsx",
    ]);
    expect(ctx.files.every((f) => f.reason === "sibling")).toBe(true);
  });

  it("never includes the target file itself", () => {
    const files = new Map([["components/ui/widget.tsx", "export const Widget = 1;"]]);
    const u = unit("components/ui/widget.tsx");
    const ctx = assembleContext(u, memoryFileSource(files));
    expect(ctx.files).toHaveLength(0);
  });

  it("does not include unrelated files in other directories", () => {
    const files = new Map([["lib/utils.ts", "export const cn = 1;"]]);
    const u = unit("components/ui/widget.tsx");
    const ctx = assembleContext(u, memoryFileSource(files));
    expect(ctx.files).toHaveLength(0);
  });

  it("respects the character budget (drops low-priority neighbors)", () => {
    const big = "x".repeat(5000);
    const files = new Map([
      ["components/ui/a.tsx", big],
      ["components/ui/b.tsx", big],
    ]);
    const u = unit("components/ui/widget.tsx");
    const ctx = assembleContext(u, memoryFileSource(files), 6000);
    // Only one 5000-char sibling fits under a 6000 budget.
    expect(ctx.files).toHaveLength(1);
  });

  it("always carries the design-token summary", () => {
    const ctx = assembleContext(unit("app/x.tsx"), memoryFileSource(new Map()));
    expect(ctx.designTokens).toBe(DESIGN_TOKENS_SUMMARY);
  });

  it("normalizes windows-style backslash paths", () => {
    const files = new Map([["components/ui/button.tsx", "code"]]);
    const u = unit("components/ui/widget.tsx", {
      dependsOn: ["components\\ui\\button.tsx"],
    });
    const ctx = assembleContext(u, memoryFileSource(files));
    expect(ctx.files).toHaveLength(1);
  });
});

describe("renderContext", () => {
  it("emits tokens plus labeled file blocks", () => {
    const files = new Map([["components/ui/button.tsx", "export const Button = 1;"]]);
    const u = unit("app/page.tsx", { dependsOn: ["components/ui/button.tsx"] });
    const rendered = renderContext(assembleContext(u, memoryFileSource(files)));
    expect(rendered).toContain("--primary");
    expect(rendered).toContain("dependency: components/ui/button.tsx");
    expect(rendered).toContain("export const Button");
  });
});
