import { describe, it, expect } from "vitest";

import {
  BRAND_PRESETS,
  countFiles,
  featuresIn,
  groupFor,
  initialState,
  isValidBlueprint,
  planFor,
  planToTree,
  runCommand,
  selectedFeatureIds,
  setBrandColor,
  setDarkMode,
  setName,
  setProjectType,
  toBlueprint,
  toConfigJson,
  toggleFeature,
} from "./model";
import { parseBlueprint } from "@/studio/config/schema";
import { PROJECT_TYPES } from "@/studio/registry";

describe("playground model — initial state", () => {
  it("seeds the archetype's default pages", () => {
    const state = initialState("saas");
    expect(state.projectType).toBe("saas");
    for (const pageId of PROJECT_TYPES.saas.defaultPages) {
      expect(state.selections.pages).toContain(pageId);
    }
  });

  it("produces a schema-valid blueprint out of the box", () => {
    expect(isValidBlueprint(initialState())).toBe(true);
    // And it round-trips through the real parser without throwing.
    expect(() => parseBlueprint(toBlueprint(initialState()))).not.toThrow();
  });

  it("resolves a non-empty ordered plan by default", () => {
    const plan = planFor(initialState());
    expect(plan.units.length).toBeGreaterThan(0);
    // Orders are the contiguous 0..n-1 the harness expects.
    plan.units.forEach((u, i) => expect(u.order).toBe(i));
  });
});

describe("playground model — select vs multiselect cardinality", () => {
  it("keeps at most one pick in a select group (auth)", () => {
    let state = initialState();
    // initialState seeds auth-clerk; choosing another replaces it.
    state = toggleFeature(state, "auth", "auth-selfhosted");
    expect(state.selections.auth).toEqual(["auth-selfhosted"]);
  });

  it("clears a select pick when toggled again", () => {
    let state = initialState();
    expect(state.selections.auth).toEqual(["auth-clerk"]);
    state = toggleFeature(state, "auth", "auth-clerk");
    expect(state.selections.auth).toEqual([]);
  });

  it("accumulates picks in a multiselect group (integrations)", () => {
    let state = initialState();
    state.selections.integrations = [];
    state = toggleFeature(state, "integrations", "int-slack");
    state = toggleFeature(state, "integrations", "int-discord");
    expect(state.selections.integrations).toEqual(["int-slack", "int-discord"]);
    state = toggleFeature(state, "integrations", "int-slack");
    expect(state.selections.integrations).toEqual(["int-discord"]);
  });

  it("never mutates the input state", () => {
    const state = initialState();
    const snapshot = JSON.stringify(state);
    toggleFeature(state, "auth", "auth-selfhosted");
    expect(JSON.stringify(state)).toBe(snapshot);
  });

  it("groupFor and featuresIn agree on categories", () => {
    expect(groupFor("auth")?.kind).toBe("select");
    expect(groupFor("integrations")?.kind).toBe("multiselect");
    expect(featuresIn("auth").every((f) => f.category === "auth")).toBe(true);
  });
});

describe("playground model — project type", () => {
  it("reseeds pages when the archetype changes", () => {
    let state = initialState("saas");
    state = setProjectType(state, "blog");
    expect(state.projectType).toBe("blog");
    expect(state.selections.pages).toEqual(
      PROJECT_TYPES.blog.defaultPages.filter(Boolean),
    );
  });

  it("ignores an unknown archetype", () => {
    const state = initialState();
    expect(setProjectType(state, "does-not-exist")).toBe(state);
  });
});

describe("playground model — theme", () => {
  it("applies a brand color and stays schema-valid", () => {
    let state = initialState();
    state = setBrandColor(state, BRAND_PRESETS[3].hsl);
    expect(state.theme.brandColor).toBe(BRAND_PRESETS[3].hsl);
    expect(isValidBlueprint(state)).toBe(true);
  });

  it("toggles dark mode", () => {
    let state = setDarkMode(initialState(), false);
    expect(state.theme.darkMode).toBe(false);
    state = setDarkMode(state, true);
    expect(state.theme.darkMode).toBe(true);
  });

  it("every brand preset is a valid HSL triple that keeps the blueprint valid", () => {
    for (const preset of BRAND_PRESETS) {
      expect(preset.hsl).toMatch(/^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/);
      expect(isValidBlueprint(setBrandColor(initialState(), preset.hsl))).toBe(
        true,
      );
    }
  });
});

describe("playground model — blueprint + config emission", () => {
  it("tags select-group picks with a choice, multiselect without", () => {
    let state = initialState();
    state.selections.integrations = ["int-slack"];
    const blueprint = toBlueprint(state);
    const auth = blueprint.features.find((f) => f.featureId === "auth-clerk");
    const slack = blueprint.features.find((f) => f.featureId === "int-slack");
    expect(auth?.choice).toBe("auth-clerk");
    expect(slack?.choice).toBeUndefined();
  });

  it("emits pretty JSON that parses back to the same blueprint", () => {
    const state = initialState();
    const json = toConfigJson(state);
    expect(json.endsWith("\n")).toBe(true);
    expect(JSON.parse(json)).toEqual(toBlueprint(state));
  });

  it("falls back to a default name when blank", () => {
    const state = setName(initialState(), "   ");
    expect(toBlueprint(state).name).toBe("my-syntheon-app");
  });

  it("selectedFeatureIds is deduped and ordered by menu group", () => {
    const ids = selectedFeatureIds(initialState());
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("run command references the app name and the studio script", () => {
    const cmd = runCommand(setName(initialState(), "acme"));
    expect(cmd).toContain("npm run studio");
    expect(cmd).toContain("acme");
  });
});

describe("playground model — file tree", () => {
  it("folds the plan into a tree whose leaf count matches the unit count", () => {
    const state = initialState();
    const plan = planFor(state);
    const tree = planToTree(plan);
    expect(countFiles(tree)).toBe(plan.units.length);
  });

  it("sorts directories before files", () => {
    const tree = planToTree(planFor(initialState()));
    const top = tree.children ?? [];
    const firstFileIdx = top.findIndex((n) => !n.children);
    const lastDirIdx = top.map((n) => Boolean(n.children)).lastIndexOf(true);
    if (firstFileIdx !== -1 && lastDirIdx !== -1) {
      expect(lastDirIdx).toBeLessThan(firstFileIdx);
    }
  });

  it("always includes the core app shell files", () => {
    const paths = planFor(initialState()).units.map((u) => u.path);
    expect(paths).toContain("app/layout.tsx");
    expect(paths).toContain("app/globals.css");
  });
});
