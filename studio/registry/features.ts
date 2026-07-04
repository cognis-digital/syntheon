/**
 * Syntheon feature catalog.
 *
 * Each feature (DESIGN.md §5) declares: id, label, description, category, the
 * generation units it contributes, its dependencies on other features, the
 * components and integrations it pulls in, and the env vars its code reads.
 * This catalog is the substrate `resolvePlan` expands into an ordered
 * `GenerationUnit[]` for the generation engine.
 */
import type { FeatureCategory, FeatureSpec } from "../types.js";

/**
 * Menu group descriptor — how features are surfaced in the TUI (DESIGN.md §5).
 * `kind` maps to a @clack prompt: "multiselect" (pages, integrations) or
 * "select" (single-choice provider groups like auth/payments).
 */
export interface MenuGroup {
  category: FeatureCategory;
  label: string;
  kind: "select" | "multiselect";
  /** Selecting nothing is allowed (adds a "none" affordance for selects). */
  optional: boolean;
}

export const MENU_GROUPS: readonly MenuGroup[] = [
  { category: "pages", label: "Pages", kind: "multiselect", optional: true },
  { category: "auth", label: "Auth", kind: "select", optional: true },
  { category: "payments", label: "Payments", kind: "select", optional: true },
  { category: "scheduling", label: "Scheduling", kind: "select", optional: true },
  { category: "email", label: "Email", kind: "select", optional: true },
  { category: "crm", label: "CRM", kind: "select", optional: true },
  { category: "integrations", label: "Integrations", kind: "multiselect", optional: true },
  { category: "ai", label: "AI", kind: "select", optional: true },
  { category: "identity", label: "Identity / KYC", kind: "select", optional: true },
] as const;

export const FEATURES: readonly FeatureSpec[] = [
  // ── core (always included) ────────────────────────────────────────────────
  {
    id: "core-app-shell",
    label: "App shell",
    description: "Root layout, theme provider, global styles and design tokens.",
    category: "core",
    components: ["navbar", "footer"],
    units: [
      { kind: "config", path: "app/globals.css", spec: "HSL design tokens + Tailwind base per the Syntheon token contract." },
      { kind: "route", path: "app/layout.tsx", spec: "Root layout: html/body, font, ThemeProvider, Toaster.", dependsOn: ["app/globals.css"] },
      { kind: "component", path: "components/blocks/navbar.tsx", spec: "Responsive navbar with mobile sheet." },
      { kind: "component", path: "components/blocks/footer.tsx", spec: "Site footer with links and legal." },
    ],
  },

  // ── pages (multiselect) ────────────────────────────────────────────────────
  {
    id: "page-landing",
    label: "Landing page",
    description: "Marketing landing with hero, features, social proof and CTA.",
    category: "pages",
    requires: ["core-app-shell"],
    components: ["hero", "feature-grid", "logo-cloud", "testimonial-wall", "cta"],
    units: [
      { kind: "component", path: "components/blocks/hero.tsx", spec: "Hero with headline, subcopy, primary/secondary CTA." },
      { kind: "route", path: "app/(marketing)/page.tsx", spec: "Landing route composing hero, feature grid, logo cloud, testimonials, CTA.", dependsOn: ["components/blocks/hero.tsx", "app/layout.tsx"] },
    ],
  },
  {
    id: "page-pricing",
    label: "Pricing page",
    description: "Pricing tiers with a comparison table and FAQ.",
    category: "pages",
    requires: ["core-app-shell"],
    components: ["pricing-table", "faq"],
    units: [
      { kind: "component", path: "components/blocks/pricing-table.tsx", spec: "Pricing table with monthly/annual toggle and tier cards." },
      { kind: "route", path: "app/(marketing)/pricing/page.tsx", spec: "Pricing route composing the pricing table and FAQ.", dependsOn: ["components/blocks/pricing-table.tsx"] },
    ],
  },
  {
    id: "page-docs",
    label: "Docs page",
    description: "Documentation shell with sidebar navigation and MDX content area.",
    category: "pages",
    requires: ["core-app-shell"],
    components: ["sidebar-nav", "breadcrumb"],
    units: [
      { kind: "route", path: "app/(marketing)/docs/page.tsx", spec: "Docs index with sidebar nav and content area.", dependsOn: ["app/layout.tsx"] },
    ],
  },
  {
    id: "page-blog",
    label: "Blog",
    description: "Blog index and post route.",
    category: "pages",
    requires: ["core-app-shell"],
    components: ["card"],
    units: [
      { kind: "route", path: "app/(marketing)/blog/page.tsx", spec: "Blog index listing posts as cards.", dependsOn: ["app/layout.tsx"] },
      { kind: "route", path: "app/(marketing)/blog/[slug]/page.tsx", spec: "Blog post route rendering MDX.", dependsOn: ["app/(marketing)/blog/page.tsx"] },
    ],
  },
  {
    id: "page-dashboard",
    label: "Dashboard",
    description: "Authenticated dashboard shell with stats and empty states.",
    category: "pages",
    requires: ["core-app-shell"],
    components: ["dashboard-shell", "stats", "empty-state"],
    units: [
      { kind: "component", path: "components/blocks/dashboard-shell.tsx", spec: "Dashboard shell: sidebar + topbar + content slot." },
      { kind: "route", path: "app/(app)/dashboard/page.tsx", spec: "Dashboard home with stats cards and empty states.", dependsOn: ["components/blocks/dashboard-shell.tsx"] },
    ],
  },
  {
    id: "page-settings",
    label: "Settings",
    description: "Account settings with tabbed sections.",
    category: "pages",
    requires: ["core-app-shell"],
    components: ["settings-layout", "form"],
    units: [
      { kind: "route", path: "app/(app)/settings/page.tsx", spec: "Settings page with tabbed profile/account/billing sections.", dependsOn: ["app/layout.tsx"] },
    ],
  },
  {
    id: "page-admin",
    label: "Admin",
    description: "Admin area with data tables.",
    category: "pages",
    requires: ["core-app-shell"],
    components: ["data-table", "dashboard-shell"],
    units: [
      { kind: "route", path: "app/(app)/admin/page.tsx", spec: "Admin dashboard with a data table of users.", dependsOn: ["app/layout.tsx"] },
    ],
  },

  // ── auth (select) ──────────────────────────────────────────────────────────
  {
    id: "auth-clerk",
    label: "Clerk",
    description: "Hosted auth: sign-in/up, waitlist, orgs, RBAC.",
    category: "auth",
    requires: ["core-app-shell"],
    integrations: ["clerk"],
    components: ["auth-card", "waitlist-form"],
    env: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
    units: [
      { kind: "module", path: "lib/auth/clerk.ts", spec: "Clerk client helpers and RBAC guards." },
      { kind: "route", path: "app/(auth)/sign-in/[[...sign-in]]/page.tsx", spec: "Clerk sign-in route.", dependsOn: ["lib/auth/clerk.ts"] },
      { kind: "route", path: "app/(auth)/sign-up/[[...sign-up]]/page.tsx", spec: "Clerk sign-up route.", dependsOn: ["lib/auth/clerk.ts"] },
      { kind: "route", path: "app/(auth)/waitlist/page.tsx", spec: "Waitlist capture using Clerk waitlist.", dependsOn: ["components/blocks/waitlist-form.tsx"] },
    ],
  },
  {
    id: "auth-selfhosted",
    label: "Self-hosted (Lucia-style)",
    description: "Session-based self-hosted auth with your own DB.",
    category: "auth",
    requires: ["core-app-shell"],
    components: ["auth-card", "waitlist-form"],
    env: ["AUTH_SECRET", "DATABASE_URL"],
    units: [
      { kind: "module", path: "lib/auth/session.ts", spec: "Self-hosted session auth: cookies, hashing, guards." },
      { kind: "api", path: "app/api/auth/[...auth]/route.ts", spec: "Auth route handlers for sign-in/up/out.", dependsOn: ["lib/auth/session.ts"] },
      { kind: "route", path: "app/(auth)/sign-in/page.tsx", spec: "Sign-in page using the auth card.", dependsOn: ["components/blocks/auth-card.tsx"] },
      { kind: "route", path: "app/(auth)/sign-up/page.tsx", spec: "Sign-up page using the auth card.", dependsOn: ["components/blocks/auth-card.tsx"] },
    ],
  },

  // ── payments (select) ────────────────────────────────────────────────────
  {
    id: "pay-stripe",
    label: "Stripe (Checkout + Billing)",
    description: "Stripe Checkout, subscriptions, customer portal and webhooks.",
    category: "payments",
    requires: ["core-app-shell"],
    integrations: ["stripe"],
    env: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
    units: [
      { kind: "integration", path: "lib/integrations/stripe/client.ts", spec: "Stripe client factory + typed billing helpers." },
      { kind: "api", path: "app/api/stripe/checkout/route.ts", spec: "Create Checkout session handler.", dependsOn: ["lib/integrations/stripe/client.ts"] },
      { kind: "api", path: "app/api/stripe/webhook/route.ts", spec: "Stripe webhook handler with signature verification.", dependsOn: ["lib/integrations/stripe/client.ts"] },
      { kind: "api", path: "app/api/stripe/portal/route.ts", spec: "Customer billing portal session handler.", dependsOn: ["lib/integrations/stripe/client.ts"] },
    ],
  },
  {
    id: "pay-stripe-link",
    label: "Stripe Link",
    description: "One-click accelerated checkout via Stripe Link.",
    category: "payments",
    requires: ["core-app-shell"],
    integrations: ["stripe-link", "stripe"],
    env: ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY"],
    units: [
      { kind: "integration", path: "lib/integrations/stripe-link/client.ts", spec: "Stripe Link enabled Payment Element helper." },
      { kind: "component", path: "components/blocks/checkout-link.tsx", spec: "Payment element with Link one-click checkout." },
    ],
  },
  {
    id: "pay-lemonsqueezy",
    label: "Lemon Squeezy",
    description: "Merchant-of-record subscriptions and checkout.",
    category: "payments",
    requires: ["core-app-shell"],
    integrations: ["lemonsqueezy"],
    env: ["LEMONSQUEEZY_API_KEY", "LEMONSQUEEZY_STORE_ID", "LEMONSQUEEZY_WEBHOOK_SECRET"],
    units: [
      { kind: "integration", path: "lib/integrations/lemonsqueezy/client.ts", spec: "Lemon Squeezy client + checkout helpers." },
      { kind: "api", path: "app/api/lemonsqueezy/webhook/route.ts", spec: "Lemon Squeezy webhook handler.", dependsOn: ["lib/integrations/lemonsqueezy/client.ts"] },
    ],
  },
  {
    id: "pay-polar",
    label: "Polar",
    description: "Open-source monetization and subscriptions.",
    category: "payments",
    requires: ["core-app-shell"],
    integrations: ["polar"],
    env: ["POLAR_ACCESS_TOKEN", "POLAR_WEBHOOK_SECRET"],
    units: [
      { kind: "integration", path: "lib/integrations/polar/client.ts", spec: "Polar client + checkout helpers." },
      { kind: "api", path: "app/api/polar/webhook/route.ts", spec: "Polar webhook handler.", dependsOn: ["lib/integrations/polar/client.ts"] },
    ],
  },

  // ── scheduling (select) ────────────────────────────────────────────────────
  {
    id: "sched-calendly",
    label: "Calendly",
    description: "Calendly scheduling embed + event webhooks.",
    category: "scheduling",
    requires: ["core-app-shell"],
    integrations: ["calendly"],
    env: ["CALENDLY_API_TOKEN", "NEXT_PUBLIC_CALENDLY_URL"],
    units: [
      { kind: "integration", path: "lib/integrations/calendly/client.ts", spec: "Calendly API client + webhook types." },
      { kind: "component", path: "components/blocks/calendly-embed.tsx", spec: "Calendly inline embed component." },
      { kind: "api", path: "app/api/calendly/webhook/route.ts", spec: "Calendly event webhook handler.", dependsOn: ["lib/integrations/calendly/client.ts"] },
    ],
  },
  {
    id: "sched-calcom",
    label: "Cal.com",
    description: "Open-source scheduling embed.",
    category: "scheduling",
    requires: ["core-app-shell"],
    integrations: ["calcom"],
    env: ["CALCOM_API_KEY", "NEXT_PUBLIC_CALCOM_LINK"],
    units: [
      { kind: "integration", path: "lib/integrations/calcom/client.ts", spec: "Cal.com API client." },
      { kind: "component", path: "components/blocks/calcom-embed.tsx", spec: "Cal.com inline embed component." },
    ],
  },

  // ── email (select) ─────────────────────────────────────────────────────────
  {
    id: "email-resend",
    label: "Resend",
    description: "Transactional + broadcast email with React templates and automation sequences.",
    category: "email",
    requires: ["core-app-shell"],
    integrations: ["resend"],
    env: ["RESEND_API_KEY"],
    units: [
      { kind: "integration", path: "lib/integrations/resend/client.ts", spec: "Resend client + send helpers." },
      { kind: "module", path: "lib/email/sequences.ts", spec: "Automation sequences: welcome, drip, win-back." },
      { kind: "api", path: "app/api/email/send/route.ts", spec: "Send transactional email handler.", dependsOn: ["lib/integrations/resend/client.ts"] },
    ],
  },
  {
    id: "email-gmail",
    label: "Gmail API",
    description: "Send/read via Gmail OAuth with automation sequences.",
    category: "email",
    requires: ["core-app-shell"],
    integrations: ["gmail"],
    env: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"],
    units: [
      { kind: "integration", path: "lib/integrations/gmail/client.ts", spec: "Gmail OAuth client + send helpers." },
      { kind: "module", path: "lib/email/sequences.ts", spec: "Automation sequences: welcome, drip, win-back." },
    ],
  },
  {
    id: "email-postmark",
    label: "Postmark",
    description: "Transactional email delivery with automation sequences.",
    category: "email",
    requires: ["core-app-shell"],
    integrations: ["postmark"],
    env: ["POSTMARK_SERVER_TOKEN"],
    units: [
      { kind: "integration", path: "lib/integrations/postmark/client.ts", spec: "Postmark client + send helpers." },
      { kind: "module", path: "lib/email/sequences.ts", spec: "Automation sequences: welcome, drip, win-back." },
    ],
  },

  // ── crm (select) ───────────────────────────────────────────────────────────
  {
    id: "crm-hubspot",
    label: "HubSpot",
    description: "Contact sync + lifecycle stages via HubSpot.",
    category: "crm",
    requires: ["core-app-shell"],
    integrations: ["hubspot"],
    env: ["HUBSPOT_ACCESS_TOKEN"],
    units: [
      { kind: "integration", path: "lib/integrations/hubspot/client.ts", spec: "HubSpot client + contact/deal helpers." },
      { kind: "module", path: "lib/crm/sync.ts", spec: "Contact sync + lifecycle mapping.", dependsOn: ["lib/integrations/hubspot/client.ts"] },
    ],
  },
  {
    id: "crm-salesforce",
    label: "Salesforce",
    description: "Lead/contact sync via Salesforce.",
    category: "crm",
    requires: ["core-app-shell"],
    integrations: ["salesforce"],
    env: ["SALESFORCE_CLIENT_ID", "SALESFORCE_CLIENT_SECRET", "SALESFORCE_INSTANCE_URL"],
    units: [
      { kind: "integration", path: "lib/integrations/salesforce/client.ts", spec: "Salesforce OAuth client + object helpers." },
      { kind: "module", path: "lib/crm/sync.ts", spec: "Contact sync + lifecycle mapping.", dependsOn: ["lib/integrations/salesforce/client.ts"] },
    ],
  },
  {
    id: "crm-attio",
    label: "Attio",
    description: "Records + lists sync via Attio.",
    category: "crm",
    requires: ["core-app-shell"],
    integrations: ["attio"],
    env: ["ATTIO_API_KEY"],
    units: [
      { kind: "integration", path: "lib/integrations/attio/client.ts", spec: "Attio client + record helpers." },
      { kind: "module", path: "lib/crm/sync.ts", spec: "Contact sync + lifecycle mapping.", dependsOn: ["lib/integrations/attio/client.ts"] },
    ],
  },
  {
    id: "crm-airtable",
    label: "Airtable",
    description: "Lightweight CRM on Airtable.",
    category: "crm",
    requires: ["core-app-shell"],
    integrations: ["airtable"],
    env: ["AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"],
    units: [
      { kind: "integration", path: "lib/integrations/airtable/client.ts", spec: "Airtable client + record helpers." },
      { kind: "module", path: "lib/crm/sync.ts", spec: "Contact sync + lifecycle mapping.", dependsOn: ["lib/integrations/airtable/client.ts"] },
    ],
  },

  // ── integrations (multiselect) ─────────────────────────────────────────────
  ...(
    [
      ["int-zapier", "Zapier", "zapier"],
      ["int-n8n", "n8n", "n8n"],
      ["int-slack", "Slack", "slack"],
      ["int-discord", "Discord", "discord"],
      ["int-twilio", "Twilio", "twilio"],
      ["int-segment", "Segment", "segment"],
      ["int-posthog", "PostHog", "posthog"],
      ["int-notion", "Notion", "notion"],
      ["int-plaid", "Plaid", "plaid"],
    ] as const
  ).map<FeatureSpec>(([id, label, integrationId]) => ({
    id,
    label,
    description: `${label} typed adapter with client factory, webhook (where relevant) and env scaffold.`,
    category: "integrations",
    requires: ["core-app-shell"],
    integrations: [integrationId],
    units: [
      {
        kind: "integration",
        path: `lib/integrations/${integrationId}/client.ts`,
        spec: `${label} client factory + typed methods; degrades gracefully without keys.`,
      },
    ],
  })),

  // ── ai (select) ────────────────────────────────────────────────────────────
  {
    id: "ai-claude",
    label: "Claude",
    description: "Chat, RAG and agent endpoints backed by Claude.",
    category: "ai",
    requires: ["core-app-shell"],
    integrations: ["claude"],
    env: ["ANTHROPIC_API_KEY"],
    units: [
      { kind: "integration", path: "lib/integrations/claude/client.ts", spec: "Claude client + streaming chat helper." },
      { kind: "api", path: "app/api/ai/chat/route.ts", spec: "Streaming chat endpoint.", dependsOn: ["lib/integrations/claude/client.ts"] },
      { kind: "api", path: "app/api/ai/rag/route.ts", spec: "RAG endpoint: retrieve + answer.", dependsOn: ["lib/integrations/claude/client.ts"] },
    ],
  },
  {
    id: "ai-openai",
    label: "OpenAI",
    description: "Chat, RAG and agent endpoints backed by OpenAI.",
    category: "ai",
    requires: ["core-app-shell"],
    integrations: ["openai"],
    env: ["OPENAI_API_KEY"],
    units: [
      { kind: "integration", path: "lib/integrations/openai/client.ts", spec: "OpenAI client + chat/embedding helpers." },
      { kind: "api", path: "app/api/ai/chat/route.ts", spec: "Streaming chat endpoint.", dependsOn: ["lib/integrations/openai/client.ts"] },
      { kind: "api", path: "app/api/ai/rag/route.ts", spec: "RAG endpoint: retrieve + answer.", dependsOn: ["lib/integrations/openai/client.ts"] },
    ],
  },
  {
    id: "ai-ollama",
    label: "Local Ollama",
    description: "Local chat/RAG endpoints — no keys, no data leaves the box.",
    category: "ai",
    requires: ["core-app-shell"],
    integrations: ["ollama"],
    env: ["OLLAMA_BASE_URL"],
    units: [
      { kind: "integration", path: "lib/integrations/ollama/client.ts", spec: "Ollama client + streaming chat helper." },
      { kind: "api", path: "app/api/ai/chat/route.ts", spec: "Streaming chat endpoint.", dependsOn: ["lib/integrations/ollama/client.ts"] },
    ],
  },

  // ── identity / KYC (select) ────────────────────────────────────────────────
  {
    id: "kyc-persona",
    label: "Persona",
    description: "Document + biometric identity verification via Persona.",
    category: "identity",
    requires: ["core-app-shell"],
    integrations: ["persona"],
    env: ["PERSONA_API_KEY", "PERSONA_TEMPLATE_ID"],
    units: [
      { kind: "integration", path: "lib/integrations/persona/client.ts", spec: "Persona client + inquiry helpers." },
      { kind: "api", path: "app/api/kyc/persona/webhook/route.ts", spec: "Persona verification webhook handler.", dependsOn: ["lib/integrations/persona/client.ts"] },
    ],
  },
  {
    id: "kyc-stripe-identity",
    label: "Stripe Identity",
    description: "Document + selfie KYC via Stripe Identity.",
    category: "identity",
    requires: ["core-app-shell"],
    integrations: ["stripe-identity"],
    env: ["STRIPE_SECRET_KEY"],
    units: [
      { kind: "integration", path: "lib/integrations/stripe-identity/client.ts", spec: "Stripe Identity verification session helpers." },
      { kind: "api", path: "app/api/kyc/stripe/webhook/route.ts", spec: "Stripe Identity webhook handler.", dependsOn: ["lib/integrations/stripe-identity/client.ts"] },
    ],
  },
] as const;

const FEATURE_BY_ID = new Map(FEATURES.map((f) => [f.id, f]));

export function getFeature(id: string): FeatureSpec | undefined {
  return FEATURE_BY_ID.get(id);
}

export function featureIds(): string[] {
  return FEATURES.map((f) => f.id);
}

export function featuresByCategory(category: FeatureCategory): FeatureSpec[] {
  return FEATURES.filter((f) => f.category === category);
}

/** The always-included core feature ids. */
export const CORE_FEATURE_IDS: readonly string[] = FEATURES.filter(
  (f) => f.category === "core",
).map((f) => f.id);

/** Supported project archetypes and the pages each seeds by default. */
export const PROJECT_TYPES: Record<string, { label: string; defaultPages: string[] }> = {
  saas: { label: "SaaS", defaultPages: ["page-landing", "page-pricing", "page-dashboard", "page-settings"] },
  marketing: { label: "Marketing site", defaultPages: ["page-landing", "page-pricing", "page-blog"] },
  "internal-tool": { label: "Internal tool", defaultPages: ["page-dashboard", "page-settings", "page-admin"] },
  marketplace: { label: "Marketplace", defaultPages: ["page-landing", "page-dashboard", "page-settings"] },
  directory: { label: "Directory", defaultPages: ["page-landing", "page-dashboard"] },
  blog: { label: "Blog", defaultPages: ["page-landing", "page-blog"] },
};
