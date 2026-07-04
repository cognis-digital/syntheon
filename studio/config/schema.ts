/**
 * Syntheon config — zod schemas + defaults for `syntheon.config.json`.
 *
 * The schema is the runtime gate on any blueprint the CLI writes or loads.
 * It mirrors the {@link BuildBlueprint} contract in `studio/types.ts`; the
 * `satisfies` check below fails compilation if the two ever drift.
 */
import { z } from "zod";
import type { BuildBlueprint } from "../types.js";
import { PROJECT_TYPES, featureIds } from "../registry/features.js";

/** HSL triple like "262 83% 58%" (hue 0-360, sat/light 0-100%). */
const hslTriple = z
  .string()
  .regex(
    /^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/,
    'Brand color must be an HSL triple like "262 83% 58%".',
  );

export const themeSchema = z.object({
  brandColor: hslTriple,
  radius: z.string().regex(/^\d*\.?\d+rem$/, 'Radius must be a rem value like "0.65rem".'),
  font: z.enum(["inter", "geist", "system", "mono"]),
  darkMode: z.boolean(),
});

export const featureSelectionSchema = z.object({
  featureId: z.string().min(1),
  choice: z.string().min(1).optional(),
});

export const blueprintSchema = z.object({
  version: z.literal(1),
  name: z.string().min(1).max(80),
  projectType: z.enum(
    Object.keys(PROJECT_TYPES) as [string, ...string[]],
  ),
  features: z.array(featureSelectionSchema),
  theme: themeSchema,
  cloudEscalation: z.boolean().optional(),
});

/**
 * Parse + validate, additionally asserting every referenced feature id exists
 * in the registry (schema alone can't know the catalog). Throws a ZodError on
 * shape problems, a plain Error on unknown feature ids.
 */
export function parseBlueprint(input: unknown): BuildBlueprint {
  const parsed = blueprintSchema.parse(input) as BuildBlueprint;
  const known = new Set(featureIds());
  const unknown = parsed.features
    .map((f) => f.featureId)
    .filter((id) => !known.has(id));
  if (unknown.length) {
    throw new Error(`Config references unknown feature id(s): ${unknown.join(", ")}.`);
  }
  return parsed;
}

/** Non-throwing variant returning a discriminated result. */
export function safeParseBlueprint(
  input: unknown,
):
  | { success: true; data: BuildBlueprint }
  | { success: false; error: string } {
  try {
    return { success: true, data: parseBlueprint(input) };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
    }
    return { success: false, error: (err as Error).message };
  }
}

/** Default theme = the Cognis violet token contract (DESIGN.md §2). */
export const DEFAULT_THEME = {
  brandColor: "262 83% 58%",
  radius: "0.65rem",
  font: "inter",
  darkMode: true,
} as const satisfies BuildBlueprint["theme"];

/**
 * The `--yes` non-interactive default blueprint: a batteries-included SaaS.
 * Kept in sync with the registry — every feature id here must exist.
 */
export const DEFAULT_BLUEPRINT = {
  version: 1,
  name: "my-syntheon-app",
  projectType: "saas",
  features: [
    { featureId: "page-landing" },
    { featureId: "page-pricing" },
    { featureId: "page-dashboard" },
    { featureId: "page-settings" },
    { featureId: "auth-clerk", choice: "clerk" },
    { featureId: "pay-stripe", choice: "stripe" },
    { featureId: "pay-stripe-link", choice: "stripe-link" },
    { featureId: "email-resend", choice: "resend" },
    { featureId: "ai-claude", choice: "claude" },
  ],
  theme: DEFAULT_THEME,
  cloudEscalation: false,
} as const satisfies BuildBlueprint;
