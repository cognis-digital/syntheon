/**
 * Syntheon interactive flow — maps menu prompts to a {@link BuildBlueprint}.
 *
 * Separated from argv handling in `cli.ts` so it can be driven by a scripted
 * {@link Prompter} in tests with no TTY. Follows DESIGN.md §5 group order.
 */
import type { BuildBlueprint, FeatureSelection } from "./types.js";
import type { Choice, Prompter } from "./prompts.js";
import { DEFAULT_THEME } from "./config/schema.js";
import {
  MENU_GROUPS,
  PROJECT_TYPES,
  featuresByCategory,
} from "./registry/features.js";

const FONTS: Choice[] = [
  { value: "inter", label: "Inter", hint: "default" },
  { value: "geist", label: "Geist" },
  { value: "system", label: "System UI" },
  { value: "mono", label: "Monospace" },
];

const BRAND_COLORS: Choice[] = [
  { value: "262 83% 58%", label: "Cognis violet", hint: "default" },
  { value: "271 91% 65%", label: "Bright violet" },
  { value: "221 83% 53%", label: "Blue" },
  { value: "142 71% 45%", label: "Green" },
  { value: "24 95% 53%", label: "Orange" },
  { value: "0 84% 60%", label: "Red" },
];

const RADII: Choice[] = [
  { value: "0rem", label: "Sharp (0)" },
  { value: "0.375rem", label: "Small" },
  { value: "0.65rem", label: "Medium", hint: "default" },
  { value: "1rem", label: "Large" },
];

function featureChoices(category: Parameters<typeof featuresByCategory>[0]): Choice[] {
  return featuresByCategory(category).map((f) => ({
    value: f.id,
    label: f.label,
    hint: f.description,
  }));
}

/**
 * Run the full interactive menu against the given prompter and return a
 * validated-shape blueprint (validation itself is the caller's job).
 */
export async function runInteractive(prompter: Prompter): Promise<BuildBlueprint> {
  const name = await prompter.text({
    message: "Project name",
    placeholder: "my-syntheon-app",
    initial: "my-syntheon-app",
  });

  const projectType = await prompter.select({
    message: "Project type",
    options: Object.entries(PROJECT_TYPES).map(([value, v]) => ({ value, label: v.label })),
    initial: "saas",
  });

  const selections: FeatureSelection[] = [];

  for (const group of MENU_GROUPS) {
    const choices = featureChoices(group.category);
    if (choices.length === 0) continue;

    if (group.kind === "multiselect") {
      // Pages default to the project archetype's seed set.
      const initial =
        group.category === "pages"
          ? PROJECT_TYPES[projectType]?.defaultPages ?? []
          : [];
      const picked = await prompter.multiselect({
        message: `${group.label} (space to toggle)`,
        options: choices,
        initial,
        required: false,
      });
      for (const id of picked) selections.push({ featureId: id });
    } else {
      // select groups get an explicit "none" affordance when optional.
      const options = group.optional
        ? [{ value: "__none__", label: "None" }, ...choices]
        : choices;
      const picked = await prompter.select({
        message: group.label,
        options,
        initial: group.optional ? "__none__" : options[0]?.value,
      });
      if (picked && picked !== "__none__") {
        // choice mirrors the single integration the feature pulls in, when present.
        selections.push({ featureId: picked, choice: providerChoiceFor(picked) });
      }
    }
  }

  // ── Theme ──────────────────────────────────────────────────────────────
  const brandColor = await prompter.select({
    message: "Brand color",
    options: BRAND_COLORS,
    initial: DEFAULT_THEME.brandColor,
  });
  const radius = await prompter.select({
    message: "Corner radius",
    options: RADII,
    initial: DEFAULT_THEME.radius,
  });
  const font = await prompter.select({
    message: "Font",
    options: FONTS,
    initial: DEFAULT_THEME.font,
  });
  const darkMode = await prompter.confirm({
    message: "Include dark mode?",
    initial: DEFAULT_THEME.darkMode,
  });

  return {
    version: 1,
    name: name.trim() || "my-syntheon-app",
    projectType,
    features: selections,
    theme: {
      brandColor,
      radius,
      font: font as BuildBlueprint["theme"]["font"],
      darkMode,
    },
    cloudEscalation: false,
  };
}

/**
 * For a single-choice feature the `choice` field records the provider id (its
 * one integration), which the engine may use to pick a variant. Falls back to
 * the feature id when a feature has no single integration.
 */
function providerChoiceFor(featureId: string): string | undefined {
  const feature = featuresByCategory("payments")
    .concat(featuresByCategory("auth"))
    .concat(featuresByCategory("scheduling"))
    .concat(featuresByCategory("email"))
    .concat(featuresByCategory("crm"))
    .concat(featuresByCategory("ai"))
    .concat(featuresByCategory("identity"))
    .find((f) => f.id === featureId);
  return feature?.integrations?.[0];
}
