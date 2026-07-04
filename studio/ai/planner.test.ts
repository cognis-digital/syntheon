import { describe, it, expect } from "vitest";
import {
  planUnits,
  topoSort,
  parseOrder,
  isValidOrder,
} from "./planner.js";
import { FakeChatClient, unit, plan } from "./__testkit.js";

describe("topoSort", () => {
  it("orders dependencies before dependents", () => {
    const units = [
      unit("app/page.tsx", { dependsOn: ["components/ui/button.tsx"] }),
      unit("components/ui/button.tsx"),
    ];
    const sorted = topoSort(units);
    const paths = sorted.map((u) => u.path);
    expect(paths.indexOf("components/ui/button.tsx")).toBeLessThan(
      paths.indexOf("app/page.tsx"),
    );
  });

  it("ignores dependencies that are not in the plan", () => {
    const units = [unit("app/page.tsx", { dependsOn: ["lib/utils.ts"] })];
    const sorted = topoSort(units);
    expect(sorted).toHaveLength(1);
  });

  it("uses kind rank as a stable tiebreak (config before test)", () => {
    const units = [
      unit("z.test.ts", { kind: "test" }),
      unit("tailwind.tokens.ts", { kind: "config" }),
    ];
    const sorted = topoSort(units);
    expect(sorted[0].kind).toBe("config");
    expect(sorted[1].kind).toBe("test");
  });

  it("breaks cycles by appending the offending units", () => {
    const units = [
      unit("a.ts", { dependsOn: ["b.ts"] }),
      unit("b.ts", { dependsOn: ["a.ts"] }),
    ];
    const sorted = topoSort(units);
    expect(sorted).toHaveLength(2); // both present, no infinite loop
  });

  it("handles a longer dependency chain", () => {
    const units = [
      unit("c.ts", { dependsOn: ["b.ts"] }),
      unit("b.ts", { dependsOn: ["a.ts"] }),
      unit("a.ts"),
    ];
    const paths = topoSort(units).map((u) => u.path);
    expect(paths).toEqual(["a.ts", "b.ts", "c.ts"]);
  });
});

describe("parseOrder", () => {
  const paths = ["a.ts", "b.ts", "c.ts"];

  it("parses a full permutation from {order:[...]}", () => {
    expect(parseOrder('{"order":["b.ts","a.ts","c.ts"]}', paths)).toEqual([
      "b.ts",
      "a.ts",
      "c.ts",
    ]);
  });

  it("parses a bare array", () => {
    expect(parseOrder('["c.ts","b.ts","a.ts"]', paths)).toEqual(["c.ts", "b.ts", "a.ts"]);
  });

  it("strips <think> blocks (deepseek-r1)", () => {
    const raw = '<think>let me reason</think>\n{"order":["a.ts","b.ts","c.ts"]}';
    expect(parseOrder(raw, paths)).toEqual(["a.ts", "b.ts", "c.ts"]);
  });

  it("rejects a partial permutation", () => {
    expect(parseOrder('{"order":["a.ts"]}', paths)).toBeUndefined();
  });

  it("rejects garbage", () => {
    expect(parseOrder("not json at all", paths)).toBeUndefined();
  });

  it("ignores unknown paths and dedupes", () => {
    expect(
      parseOrder('{"order":["a.ts","a.ts","x.ts","b.ts","c.ts"]}', paths),
    ).toEqual(["a.ts", "b.ts", "c.ts"]);
  });
});

describe("isValidOrder", () => {
  const all = [
    unit("a.ts"),
    unit("b.ts", { dependsOn: ["a.ts"] }),
  ];
  it("accepts an order that respects deps", () => {
    expect(isValidOrder([all[0], all[1]], all)).toBe(true);
  });
  it("rejects an order that violates deps", () => {
    expect(isValidOrder([all[1], all[0]], all)).toBe(false);
  });
});

describe("planUnits", () => {
  it("uses deterministic order when no client is given", async () => {
    const p = plan([
      unit("app/page.tsx", { dependsOn: ["components/ui/button.tsx"] }),
      unit("components/ui/button.tsx"),
    ]);
    const ordered = await planUnits(p);
    expect(ordered[0].path).toBe("components/ui/button.tsx");
    expect(ordered[0].order).toBe(0);
    expect(ordered[1].order).toBe(1);
  });

  it("applies a valid model-refined ordering", async () => {
    const p = plan([unit("a.ts"), unit("b.ts")]);
    const client = new FakeChatClient(['{"order":["b.ts","a.ts"]}']);
    const ordered = await planUnits(p, { client });
    // Both independent, so the model reorder is accepted.
    expect(ordered.map((u) => u.path)).toEqual(["b.ts", "a.ts"]);
  });

  it("rejects a model ordering that violates dependencies", async () => {
    const p = plan([unit("a.ts"), unit("b.ts", { dependsOn: ["a.ts"] })]);
    const client = new FakeChatClient(['{"order":["b.ts","a.ts"]}']);
    const ordered = await planUnits(p, { client });
    // Invalid → falls back to deterministic (a before b).
    expect(ordered.map((u) => u.path)).toEqual(["a.ts", "b.ts"]);
  });

  it("falls back to deterministic order when the model throws", async () => {
    const p = plan([unit("a.ts"), unit("b.ts")]);
    const client = new FakeChatClient(["__THROW__"]);
    const ordered = await planUnits(p, { client });
    expect(ordered).toHaveLength(2);
  });

  it("reindexes order fields to 0..n-1", async () => {
    const p = plan([unit("a.ts"), unit("b.ts"), unit("c.ts")]);
    const ordered = await planUnits(p);
    expect(ordered.map((u) => u.order)).toEqual([0, 1, 2]);
  });
});
