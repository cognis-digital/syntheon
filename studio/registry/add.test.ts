import { describe, it, expect } from "vitest";

import {
  resolveFeatureAddition,
  checkRegistryIntegrity,
} from "./index.js";
import type { BuildBlueprint } from "../types.js";

const baseBlueprint = (features: string[]): BuildBlueprint => ({
  version: 1,
  name: "demo",
  projectType: "saas",
  features: features.map((featureId) => ({ featureId })),
  theme: { brandColor: "262 83% 58%", radius: "0.65rem", font: "inter", darkMode: true },
});

describe("resolveFeatureAddition", () => {
  it("throws on an unknown feature id", () => {
    expect(() => resolveFeatureAddition("does-not-exist")).toThrow(/Unknown feature/);
  });

  it("resolves a feature's own units against the core-only baseline", () => {
    const plan = resolveFeatureAddition("page-blog");
    const paths = plan.units.map((u) => u.path);
    // Blog contributes its two routes...
    expect(paths).toContain("app/(marketing)/blog/page.tsx");
    expect(paths).toContain("app/(marketing)/blog/[slug]/page.tsx");
    // ...but the always-present app shell is NOT regenerated.
    expect(paths).not.toContain("app/layout.tsx");
    expect(paths).not.toContain("app/globals.css");
  });

  it("pulls in the feature's own component units (e.g. card for the blog)", () => {
    const plan = resolveFeatureAddition("page-blog");
    expect(plan.units.some((u) => u.path === "components/ui/card.tsx")).toBe(true);
  });

  it("orders units so dependencies come first", () => {
    const plan = resolveFeatureAddition("page-landing");
    const order = new Map(plan.units.map((u) => [u.path, u.order]));
    const hero = order.get("components/blocks/hero.tsx");
    const page = order.get("app/(marketing)/page.tsx");
    if (hero !== undefined && page !== undefined) {
      expect(hero).toBeLessThan(page);
    }
  });

  it("aggregates the feature's env + integrations", () => {
    const plan = resolveFeatureAddition("pay-stripe");
    expect(plan.integrations).toContain("stripe");
    expect(plan.env).toContain("STRIPE_SECRET_KEY");
  });

  it("returns no units when the feature is already in the existing blueprint", () => {
    const existing = baseBlueprint(["page-blog"]);
    const plan = resolveFeatureAddition("page-blog", existing);
    expect(plan.units.length).toBe(0);
  });

  it("diffs against an existing blueprint so shared units aren't duplicated", () => {
    // A SaaS that already has Resend email (which contributes lib/email/sequences.ts).
    const existing = baseBlueprint(["email-resend"]);
    const addGmail = resolveFeatureAddition("email-gmail", existing);
    // The shared sequences module already exists, so it isn't regenerated.
    expect(addGmail.units.some((u) => u.path === "lib/email/sequences.ts")).toBe(false);
    // But Gmail's own adapter IS new.
    expect(
      addGmail.units.some((u) => u.path === "lib/integrations/gmail/client.ts"),
    ).toBe(true);
  });

  it("carries a synthetic single-selection blueprint through to the plan", () => {
    const plan = resolveFeatureAddition("page-blog");
    expect(plan.blueprint.features).toEqual([{ featureId: "page-blog" }]);
  });

  it("keeps the registry internally consistent (no dangling refs)", () => {
    expect(checkRegistryIntegrity()).toEqual([]);
  });
});
