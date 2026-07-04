/**
 * Syntheon example blueprints.
 *
 * Small, curated `syntheon.config.json` starting points a user can pass to
 * `--config` or select in the TUI. These are *blueprints* (menu selections),
 * not full app source — the generation engine expands them.
 */
export interface TemplateManifestEntry {
  id: string;
  label: string;
  description: string;
  /** Path relative to this directory. */
  file: string;
}

export const TEMPLATE_MANIFEST: readonly TemplateManifestEntry[] = [
  {
    id: "saas",
    label: "SaaS starter",
    description:
      "Landing + pricing + dashboard + settings, Clerk auth, Stripe billing + Link, Resend email, HubSpot CRM, Claude AI, PostHog + Slack.",
    file: "saas.blueprint.json",
  },
  {
    id: "marketing",
    label: "Marketing site",
    description:
      "Landing + pricing + blog, Calendly scheduling, Resend email, PostHog analytics.",
    file: "marketing.blueprint.json",
  },
] as const;

export function templateFile(id: string): string | undefined {
  return TEMPLATE_MANIFEST.find((t) => t.id === id)?.file;
}
