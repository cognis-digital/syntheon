/**
 * Integration registry for Syntheon.
 *
 * Every adapter lives in `lib/integrations/<name>/` and exports an
 * `isConfigured()` guard plus its `<NAME>_ENV` var list. This module
 * assembles them into a single typed registry the builder + UI can enumerate:
 * id, label, category, required env vars, and a config check.
 *
 * Adapters degrade gracefully — importing this file never touches the network
 * and never throws when keys are absent.
 */
import type { IntegrationCategory, IntegrationMeta } from "./types";
export type { IntegrationCategory, IntegrationMeta } from "./types";
export { IntegrationError, env, hasEnv, requireEnv } from "./types";

import * as clerk from "./clerk/index";
import * as stripe from "./stripe/index";
import * as stripeLink from "./stripe-link/index";
import * as stripeIdentity from "./stripe-identity/index";
import * as calendly from "./calendly/index";
import * as calCom from "./cal-com/index";
import * as gmail from "./gmail/index";
import * as resend from "./resend/index";
import * as claude from "./claude/index";
import * as openai from "./openai/index";
import * as persona from "./persona/index";
import * as zapier from "./zapier/index";
import * as n8n from "./n8n/index";
import * as hubspot from "./hubspot/index";
import * as slack from "./slack/index";
import * as discord from "./discord/index";
import * as twilio from "./twilio/index";
import * as segment from "./segment/index";
import * as posthog from "./posthog/index";
import * as notion from "./notion/index";
import * as airtable from "./airtable/index";
import * as plaid from "./plaid/index";

/** Re-export every adapter namespace for direct import via the registry module. */
export {
  clerk,
  stripe,
  stripeLink,
  stripeIdentity,
  calendly,
  calCom,
  gmail,
  resend,
  claude,
  openai,
  persona,
  zapier,
  n8n,
  hubspot,
  slack,
  discord,
  twilio,
  segment,
  posthog,
  notion,
  airtable,
  plaid,
};

/** The full integration catalog, ordered by category then label. */
export const integrations: readonly IntegrationMeta[] = [
  {
    id: "clerk",
    label: "Clerk",
    category: "auth",
    env: clerk.CLERK_ENV,
    isConfigured: clerk.isConfigured,
  },
  {
    id: "stripe",
    label: "Stripe",
    category: "payments",
    env: stripe.STRIPE_ENV,
    isConfigured: stripe.isConfigured,
  },
  {
    id: "stripe-link",
    label: "Stripe Link",
    category: "payments",
    env: stripeLink.STRIPE_LINK_ENV,
    isConfigured: stripeLink.isConfigured,
  },
  {
    id: "stripe-identity",
    label: "Stripe Identity",
    category: "identity",
    env: stripeIdentity.STRIPE_IDENTITY_ENV,
    isConfigured: stripeIdentity.isConfigured,
  },
  {
    id: "persona",
    label: "Persona",
    category: "identity",
    env: persona.PERSONA_ENV,
    isConfigured: persona.isConfigured,
  },
  {
    id: "calendly",
    label: "Calendly",
    category: "scheduling",
    env: calendly.CALENDLY_ENV,
    isConfigured: calendly.isConfigured,
  },
  {
    id: "cal-com",
    label: "Cal.com",
    category: "scheduling",
    env: calCom.CALCOM_ENV,
    isConfigured: calCom.isConfigured,
  },
  {
    id: "gmail",
    label: "Gmail API",
    category: "email",
    env: gmail.GMAIL_ENV,
    isConfigured: gmail.isConfigured,
  },
  {
    id: "resend",
    label: "Resend",
    category: "email",
    env: resend.RESEND_ENV,
    isConfigured: resend.isConfigured,
  },
  {
    id: "claude",
    label: "Claude",
    category: "ai",
    env: claude.CLAUDE_ENV,
    isConfigured: claude.isConfigured,
  },
  {
    id: "openai",
    label: "OpenAI",
    category: "ai",
    env: openai.OPENAI_ENV,
    isConfigured: openai.isConfigured,
  },
  {
    id: "hubspot",
    label: "HubSpot",
    category: "crm",
    env: hubspot.HUBSPOT_ENV,
    isConfigured: hubspot.isConfigured,
  },
  {
    id: "zapier",
    label: "Zapier",
    category: "automation",
    env: zapier.ZAPIER_ENV,
    isConfigured: zapier.isConfigured,
  },
  {
    id: "n8n",
    label: "n8n",
    category: "automation",
    env: n8n.N8N_ENV,
    isConfigured: n8n.isConfigured,
  },
  {
    id: "slack",
    label: "Slack",
    category: "messaging",
    env: slack.SLACK_ENV,
    isConfigured: slack.isConfigured,
  },
  {
    id: "discord",
    label: "Discord",
    category: "messaging",
    env: discord.DISCORD_ENV,
    isConfigured: discord.isConfigured,
  },
  {
    id: "twilio",
    label: "Twilio",
    category: "messaging",
    env: twilio.TWILIO_ENV,
    isConfigured: twilio.isConfigured,
  },
  {
    id: "segment",
    label: "Segment",
    category: "analytics",
    env: segment.SEGMENT_ENV,
    isConfigured: segment.isConfigured,
  },
  {
    id: "posthog",
    label: "PostHog",
    category: "analytics",
    env: posthog.POSTHOG_ENV,
    isConfigured: posthog.isConfigured,
  },
  {
    id: "notion",
    label: "Notion",
    category: "content",
    env: notion.NOTION_ENV,
    isConfigured: notion.isConfigured,
  },
  {
    id: "airtable",
    label: "Airtable",
    category: "content",
    env: airtable.AIRTABLE_ENV,
    isConfigured: airtable.isConfigured,
  },
  {
    id: "plaid",
    label: "Plaid",
    category: "data",
    env: plaid.PLAID_ENV,
    isConfigured: plaid.isConfigured,
  },
] as const;

/** Look up a single integration's metadata by id. */
export function getIntegration(id: string): IntegrationMeta | undefined {
  return integrations.find((i) => i.id === id);
}

/** All integrations in a category. */
export function integrationsByCategory(
  category: IntegrationCategory,
): IntegrationMeta[] {
  return integrations.filter((i) => i.category === category);
}

/** Ids of integrations whose required env is fully present. */
export function configuredIntegrations(): string[] {
  return integrations.filter((i) => i.isConfigured()).map((i) => i.id);
}
