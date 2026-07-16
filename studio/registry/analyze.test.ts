import { describe, it, expect } from "vitest";

import { resolvePlan } from "./index.js";
import {
  analyzePlan,
  dependencyDepth,
  planToSerializable,
  planToJSON,
  renderAnalysis,
  UNIT_KINDS,
} from "./analyze.js";
import { DEFAULT_BLUEPRINT } from "../config/schema.js";
import type { BuildBlueprint, GenerationUnit } from "../types.js";

const blueprint = (features: string[]): BuildBlueprint => ({
  version: 1,
  name: "demo",
  projectType: "saas",
  features: features.map((featureId) => ({ featureId })),
  theme: { brandColor: "262 83% 58%", radius: "0.65rem", font: "inter", darkMode: true },
});

const unit = (
  path: string,
  dependsOn: string[] = [],
): GenerationUnit => ({
  id: path,
  path,
  kind: "module",
  spec: "",
  featureId: "f",
  order: 0,
  dependsOn,
});

describe("analyzePlan", () => {
  it("summarizes the core-only plan (no selected features)", () => {
    const plan = resolvePlan(blueprint([]));
    const a = analyzePlan(plan);
    expect(a.name).toBe("demo");
    expect(a.projectType).toBe("saas");
    expect(a.unitCount).toBe(plan.units.length);
    expect(a.unitCount).toBeGreaterThan(0);
    // Core pulls in no external integrations.
    expect(a.integrationCount).toBe(0);
    expect(a.paidIntegrations).toEqual([]);
    expect(a.freeIntegrations).toEqual([]);
  });

  it("always reports every unit kind as a key (0 when unused)", () => {
    const a = analyzePlan(resolvePlan(blueprint([])));
    for (const k of UNIT_KINDS) {
      expect(a.unitsByKind).toHaveProperty(k);
      expect(typeof a.unitsByKind[k]).toBe("number");
    }
    // Kind counts sum to the total unit count.
    const sum = UNIT_KINDS.reduce((n, k) => n + a.unitsByKind[k], 0);
    expect(sum).toBe(a.unitCount);
  });

  it("splits integrations into paid (BYO-key) vs free/local", () => {
    // Clerk + Stripe are paid; local Ollama is free.
    const plan = resolvePlan(
      blueprint(["auth-clerk", "pay-stripe", "ai-ollama"]),
    );
    const a = analyzePlan(plan);
    expect(a.paidIntegrations).toContain("clerk");
    expect(a.paidIntegrations).toContain("stripe");
    expect(a.freeIntegrations).toContain("ollama");
    // The split partitions the full integration set exactly.
    expect(a.paidIntegrations.length + a.freeIntegrations.length).toBe(
      a.integrationCount,
    );
    expect(a.integrationCount).toBe(plan.integrations.length);
  });

  it("counts distinct contributing features, not raw selections", () => {
    const plan = resolvePlan(blueprint(["page-blog"]));
    const a = analyzePlan(plan);
    const distinct = new Set(plan.units.map((u) => u.featureId));
    expect(a.featureCount).toBe(distinct.size);
    // Core is always a contributor even when only one page is picked.
    expect(a.featureCount).toBeGreaterThanOrEqual(2);
  });

  it("reports env var count matching the resolved plan", () => {
    const plan = resolvePlan(blueprint(["pay-stripe"]));
    const a = analyzePlan(plan);
    expect(a.envCount).toBe(plan.env.length);
    expect(a.envCount).toBeGreaterThan(0);
  });

  it("computes roots, leaves and dependency depth for the app shell", () => {
    // Core: globals.css (root) → layout.tsx (depends on it); navbar/footer roots.
    const plan = resolvePlan(blueprint([]));
    const a = analyzePlan(plan);
    expect(a.rootCount).toBeGreaterThan(0);
    expect(a.leafCount).toBeGreaterThan(0);
    // layout.tsx depends on globals.css, so the chain is at least 2 deep.
    expect(a.dependencyDepth).toBeGreaterThanOrEqual(2);
    expect(a.rootCount).toBeLessThanOrEqual(a.unitCount);
    expect(a.leafCount).toBeLessThanOrEqual(a.unitCount);
  });

  it("treats the batteries-included SaaS default as all paid integrations", () => {
    const plan = resolvePlan(structuredClone(DEFAULT_BLUEPRINT));
    const a = analyzePlan(plan);
    expect(a.integrationCount).toBeGreaterThan(0);
    // Clerk/Stripe/Resend/Claude are all bring-your-own-key.
    expect(a.freeIntegrations).toEqual([]);
    expect(a.paidIntegrations.length).toBe(a.integrationCount);
  });
});

describe("dependencyDepth", () => {
  it("is 0 for an empty plan", () => {
    expect(dependencyDepth([])).toBe(0);
  });

  it("is 1 for units with no in-plan edges", () => {
    expect(dependencyDepth([unit("a.ts"), unit("b.ts")])).toBe(1);
  });

  it("measures the longest chain, not the count of edges", () => {
    // a → b → c → d is depth 4; e is an isolated depth-1 node.
    const units = [
      unit("a.ts"),
      unit("b.ts", ["a.ts"]),
      unit("c.ts", ["b.ts"]),
      unit("d.ts", ["c.ts"]),
      unit("e.ts"),
    ];
    expect(dependencyDepth(units)).toBe(4);
  });

  it("ignores dependencies that are not units in the plan", () => {
    const units = [unit("only.ts", ["external/not-in-plan.ts"])];
    expect(dependencyDepth(units)).toBe(1);
  });

  it("terminates (finite depth) even on a malformed cyclic plan", () => {
    const units = [unit("a.ts", ["b.ts"]), unit("b.ts", ["a.ts"])];
    const d = dependencyDepth(units);
    expect(Number.isFinite(d)).toBe(true);
    expect(d).toBeGreaterThan(0);
  });

  it("normalizes backslash paths so Windows-style deps still match", () => {
    const u = (p: string, deps: string[] = []): GenerationUnit => ({
      ...unit(p, deps),
    });
    const units = [u("lib/a.ts"), u("app/b.ts", ["lib\\a.ts"])];
    expect(dependencyDepth(units)).toBe(2);
  });
});

describe("planToSerializable / planToJSON", () => {
  it("emits units in generation order starting at 0", () => {
    const plan = resolvePlan(blueprint(["page-landing"]));
    const s = planToSerializable(plan);
    expect(s.units[0].order).toBe(0);
    for (let i = 1; i < s.units.length; i++) {
      expect(s.units[i].order).toBeGreaterThanOrEqual(s.units[i - 1].order);
    }
  });

  it("keeps only in-plan dependsOn edges on each unit", () => {
    const plan = resolvePlan(blueprint(["page-landing"]));
    const s = planToSerializable(plan);
    const paths = new Set(s.units.map((u) => u.path));
    for (const u of s.units) {
      for (const d of u.dependsOn) expect(paths.has(d)).toBe(true);
    }
  });

  it("enriches integrations with catalog metadata", () => {
    const plan = resolvePlan(blueprint(["pay-stripe"]));
    const s = planToSerializable(plan);
    const stripe = s.integrations.find((i) => i.id === "stripe");
    expect(stripe).toBeDefined();
    expect(stripe!.label).toBe("Stripe");
    expect(stripe!.paid).toBe(true);
    expect(stripe!.env).toContain("STRIPE_SECRET_KEY");
  });

  it("carries the blueprint, env, integrations and analysis", () => {
    const plan = resolvePlan(blueprint(["ai-ollama"]));
    const s = planToSerializable(plan);
    expect(s.blueprint.name).toBe("demo");
    expect(s.blueprint.projectType).toBe("saas");
    expect(Array.isArray(s.env)).toBe(true);
    expect(s.analysis.unitCount).toBe(s.units.length);
  });

  it("produces valid, round-trippable JSON", () => {
    const plan = resolvePlan(structuredClone(DEFAULT_BLUEPRINT));
    const json = planToJSON(plan);
    expect(json.endsWith("\n")).toBe(true);
    const parsed = JSON.parse(json);
    expect(parsed.units.length).toBe(plan.units.length);
    expect(parsed.analysis.unitCount).toBe(plan.units.length);
    expect(parsed.blueprint.theme.brandColor).toBe("262 83% 58%");
  });

  it("omits cloudEscalation when the blueprint does not set it", () => {
    const bp = blueprint(["page-blog"]);
    delete (bp as { cloudEscalation?: boolean }).cloudEscalation;
    const s = planToSerializable(resolvePlan(bp));
    expect("cloudEscalation" in s.blueprint).toBe(false);
  });

  it("preserves cloudEscalation when set", () => {
    const bp = { ...blueprint(["page-blog"]), cloudEscalation: true };
    const s = planToSerializable(resolvePlan(bp));
    expect(s.blueprint.cloudEscalation).toBe(true);
  });
});

describe("renderAnalysis", () => {
  it("renders a readable, color-free report with the key facts", () => {
    const plan = resolvePlan(blueprint(["pay-stripe", "ai-ollama"]));
    const text = renderAnalysis(analyzePlan(plan));
    expect(text).toContain("demo — saas");
    expect(text).toContain("Generation units");
    expect(text).toContain("Integrations");
    expect(text).toContain("Environment variables");
    // No ANSI escape codes.
    expect(text).not.toMatch(/\[/);
    // Paid integrations are surfaced as "keys needed".
    expect(text).toContain("keys needed");
  });
});
