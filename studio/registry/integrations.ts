/**
 * Syntheon integration catalog.
 *
 * Mirrors the `lib/integrations/<name>/` adapter catalog (DESIGN.md §7). Each
 * entry is a typed adapter descriptor: id, label, the env vars its client
 * factory reads, and a link to its setup guide under `docs/integrations/`.
 * Adapters ship disabled until keys are provided and degrade gracefully.
 */

export interface IntegrationSpec {
  id: string;
  label: string;
  /** Short capability summary. */
  capability: string;
  /** Environment variables the adapter's client factory reads. */
  env: string[];
  /** Setup guide path (project-relative). */
  docs: string;
  /** Requires a paid account / external service. */
  paid: boolean;
}

export const INTEGRATIONS: readonly IntegrationSpec[] = [
  {
    id: "clerk",
    label: "Clerk",
    capability: "auth, sign-in/up, waitlist, orgs, RBAC",
    env: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
    docs: "docs/integrations/clerk.md",
    paid: true,
  },
  {
    id: "stripe",
    label: "Stripe",
    capability: "Checkout, Billing/subscriptions, webhooks, customer portal",
    env: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
    docs: "docs/integrations/stripe.md",
    paid: true,
  },
  {
    id: "stripe-link",
    label: "Stripe Link",
    capability: "one-click accelerated checkout",
    env: ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
    docs: "docs/integrations/stripe-link.md",
    paid: true,
  },
  {
    id: "stripe-identity",
    label: "Stripe Identity",
    capability: "document + selfie KYC",
    env: ["STRIPE_SECRET_KEY"],
    docs: "docs/integrations/stripe-identity.md",
    paid: true,
  },
  {
    id: "lemonsqueezy",
    label: "Lemon Squeezy",
    capability: "merchant-of-record subscriptions + checkout",
    env: ["LEMONSQUEEZY_API_KEY", "LEMONSQUEEZY_STORE_ID", "LEMONSQUEEZY_WEBHOOK_SECRET"],
    docs: "docs/integrations/lemonsqueezy.md",
    paid: true,
  },
  {
    id: "polar",
    label: "Polar",
    capability: "open-source monetization, subscriptions",
    env: ["POLAR_ACCESS_TOKEN", "POLAR_WEBHOOK_SECRET"],
    docs: "docs/integrations/polar.md",
    paid: true,
  },
  {
    id: "calendly",
    label: "Calendly",
    capability: "scheduling embed + event webhooks",
    env: ["CALENDLY_API_TOKEN", "NEXT_PUBLIC_CALENDLY_URL"],
    docs: "docs/integrations/calendly.md",
    paid: true,
  },
  {
    id: "calcom",
    label: "Cal.com",
    capability: "open-source scheduling",
    env: ["CALCOM_API_KEY", "NEXT_PUBLIC_CALCOM_LINK"],
    docs: "docs/integrations/calcom.md",
    paid: false,
  },
  {
    id: "gmail",
    label: "Gmail API",
    capability: "send/read, OAuth, transactional email",
    env: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"],
    docs: "docs/integrations/gmail.md",
    paid: false,
  },
  {
    id: "resend",
    label: "Resend",
    capability: "transactional + broadcast email, React email templates",
    env: ["RESEND_API_KEY"],
    docs: "docs/integrations/resend.md",
    paid: true,
  },
  {
    id: "postmark",
    label: "Postmark",
    capability: "transactional email delivery",
    env: ["POSTMARK_SERVER_TOKEN"],
    docs: "docs/integrations/postmark.md",
    paid: true,
  },
  {
    id: "claude",
    label: "Claude",
    capability: "chat, tools, streaming",
    env: ["ANTHROPIC_API_KEY"],
    docs: "docs/integrations/claude.md",
    paid: true,
  },
  {
    id: "openai",
    label: "OpenAI",
    capability: "chat, embeddings, assistants",
    env: ["OPENAI_API_KEY"],
    docs: "docs/integrations/openai.md",
    paid: true,
  },
  {
    id: "ollama",
    label: "Ollama (local)",
    capability: "local chat, embeddings — no keys, no data leaves the box",
    env: ["OLLAMA_BASE_URL"],
    docs: "docs/integrations/ollama.md",
    paid: false,
  },
  {
    id: "persona",
    label: "Persona",
    capability: "KYC/AML, document + biometric verification",
    env: ["PERSONA_API_KEY", "PERSONA_TEMPLATE_ID"],
    docs: "docs/integrations/persona.md",
    paid: true,
  },
  {
    id: "zapier",
    label: "Zapier",
    capability: "REST hooks (trigger + action)",
    env: ["ZAPIER_WEBHOOK_URL"],
    docs: "docs/integrations/zapier.md",
    paid: false,
  },
  {
    id: "n8n",
    label: "n8n",
    capability: "self-hosted workflow trigger/callback",
    env: ["N8N_WEBHOOK_URL"],
    docs: "docs/integrations/n8n.md",
    paid: false,
  },
  {
    id: "slack",
    label: "Slack",
    capability: "notifications, slash commands",
    env: ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"],
    docs: "docs/integrations/slack.md",
    paid: false,
  },
  {
    id: "discord",
    label: "Discord",
    capability: "notifications, slash commands",
    env: ["DISCORD_BOT_TOKEN", "DISCORD_WEBHOOK_URL"],
    docs: "docs/integrations/discord.md",
    paid: false,
  },
  {
    id: "twilio",
    label: "Twilio",
    capability: "SMS, OTP",
    env: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
    docs: "docs/integrations/twilio.md",
    paid: true,
  },
  {
    id: "segment",
    label: "Segment",
    capability: "analytics, product events",
    env: ["SEGMENT_WRITE_KEY"],
    docs: "docs/integrations/segment.md",
    paid: true,
  },
  {
    id: "posthog",
    label: "PostHog",
    capability: "product analytics, events, feature flags",
    env: ["NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_POSTHOG_HOST"],
    docs: "docs/integrations/posthog.md",
    paid: false,
  },
  {
    id: "notion",
    label: "Notion",
    capability: "content + lightweight CRM",
    env: ["NOTION_API_KEY", "NOTION_DATABASE_ID"],
    docs: "docs/integrations/notion.md",
    paid: false,
  },
  {
    id: "airtable",
    label: "Airtable",
    capability: "content + lightweight CRM",
    env: ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    docs: "docs/integrations/airtable.md",
    paid: false,
  },
  {
    id: "hubspot",
    label: "HubSpot",
    capability: "CRM contacts, deals, lifecycle sync",
    env: ["HUBSPOT_ACCESS_TOKEN"],
    docs: "docs/integrations/hubspot.md",
    paid: false,
  },
  {
    id: "salesforce",
    label: "Salesforce",
    capability: "CRM objects, lead/contact sync",
    env: ["SALESFORCE_CLIENT_ID", "SALESFORCE_CLIENT_SECRET", "SALESFORCE_INSTANCE_URL"],
    docs: "docs/integrations/salesforce.md",
    paid: true,
  },
  {
    id: "attio",
    label: "Attio",
    capability: "modern CRM, records, lists",
    env: ["ATTIO_API_KEY"],
    docs: "docs/integrations/attio.md",
    paid: true,
  },
  {
    id: "plaid",
    label: "Plaid",
    capability: "bank/account linking",
    env: ["PLAID_CLIENT_ID", "PLAID_SECRET", "PLAID_ENV"],
    docs: "docs/integrations/plaid.md",
    paid: true,
  },
] as const;

const INTEGRATION_BY_ID = new Map(INTEGRATIONS.map((i) => [i.id, i]));

export function getIntegration(id: string): IntegrationSpec | undefined {
  return INTEGRATION_BY_ID.get(id);
}

export function integrationIds(): string[] {
  return INTEGRATIONS.map((i) => i.id);
}
