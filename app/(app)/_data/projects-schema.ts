import { z } from "zod";

/**
 * Validation contract for the example app's Projects CRUD feature.
 *
 * Shared between the client form (react-hook-form + zod resolver) and the
 * server actions, so the same rules run on both sides. No `server-only` import
 * here — this module is safe in the browser and in tests.
 */

export const PROJECT_TYPES = [
  "SaaS",
  "Marketing site",
  "Internal tool",
  "Marketplace",
  "Directory",
  "Blog",
] as const;

export const PROJECT_STATUSES = ["draft", "building", "live"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Human labels + token-mapped badge variants for each status. */
export const STATUS_META: Record<
  ProjectStatus,
  { label: string; variant: "secondary" | "outline" | "default" }
> = {
  draft: { label: "Draft", variant: "outline" },
  building: { label: "Building", variant: "secondary" },
  live: { label: "Live", variant: "default" },
};

export const projectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Give your project a name of at least 2 characters.")
    .max(60, "Keep the name under 60 characters."),
  description: z
    .string()
    .trim()
    .max(240, "Keep the description under 240 characters.")
    .optional()
    .default(""),
  type: z.enum(PROJECT_TYPES).default("SaaS"),
  status: z.enum(PROJECT_STATUSES).default("draft"),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

/** Parse untrusted input (e.g. a FormData payload) into validated values. */
export function parseProjectForm(input: unknown):
  | { ok: true; values: ProjectFormValues }
  | { ok: false; errors: Record<string, string> } {
  const result = projectFormSchema.safeParse(input);
  if (result.success) return { ok: true, values: result.data };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
