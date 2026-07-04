import {
  ShieldCheck,
  Cpu,
  PackageCheck,
  Blocks,
  Layers,
  GitFork,
  Lock,
  Sparkles,
} from "lucide-react";

import type { Feature } from "@/components/blocks/feature-grid";
import type { PricingTier } from "@/components/blocks/pricing-table";
import type { FaqItem } from "@/components/blocks/faq";
import type { Testimonial } from "@/components/blocks/testimonial-wall";

import { GITHUB_URL } from "./site-nav";

/** The product pillars from DESIGN.md §1, surfaced as the feature grid. */
export const FEATURES: Feature[] = [
  {
    title: "You own every line",
    description:
      "Components are copied into your project, shadcn-style — not hidden behind a dependency. A Syntheon-generated app has zero runtime tie to Syntheon.",
    icon: GitFork,
  },
  {
    title: "Local-first, no lock-in",
    description:
      "The generation engine runs on your own machine against a local Ollama fleet. No code leaves the box. Cloud models are optional accelerators, never required.",
    icon: Lock,
  },
  {
    title: "Nothing ships unverified",
    description:
      "Every generated unit passes typecheck → lint → test → build before it is accepted. The build is green, or the unit is rejected and regenerated.",
    icon: PackageCheck,
  },
  {
    title: "Templates anchor quality",
    description:
      "A curated substrate of production-grade, already-tested blocks anchors visual and structural quality. The model personalizes on top — never fragile from-scratch UI.",
    icon: Layers,
  },
  {
    title: "Menu-driven builder",
    description:
      "Pick your project type, pages, auth, payments, scheduling, email, CRM, and integrations from an interactive TUI. Selections compile to a blueprint.",
    icon: Blocks,
  },
  {
    title: "Small model, large app",
    description:
      "A 9B model can't one-shot 100k lines, but it can generate thousands of small, verified units. Decomposition plus repair, not one heroic prompt.",
    icon: Cpu,
  },
  {
    title: "50+ primitives, batteries in",
    description:
      "Buttons to data-tables, dialogs to command palettes — every primitive is typed, dark-mode correct, a11y-checked, and shipped with a test.",
    icon: Sparkles,
  },
  {
    title: "Honest by design",
    description:
      "No claim that a small model writes flawless code unaided. Correctness comes from verification, iteration, and a curated substrate. No dark patterns.",
    icon: ShieldCheck,
  },
];

/** Integrations from DESIGN.md §7 — rendered as a wordmark logo cloud. */
export const INTEGRATIONS: string[] = [
  "Clerk",
  "Stripe",
  "Calendly",
  "Gmail",
  "Resend",
  "Claude",
  "OpenAI",
  "Persona",
  "Zapier",
  "n8n",
  "HubSpot",
  "Slack",
  "Discord",
  "Twilio",
  "Segment",
  "PostHog",
  "Notion",
  "Plaid",
];

/** The four-stage generation pipeline from DESIGN.md §4. */
export const ENGINE_STAGES: {
  name: string;
  role: string;
  detail: string;
}[] = [
  {
    name: "Planner",
    role: "deepseek-r1 / qwen3",
    detail:
      "Turns your menu selections into an ordered list of small, well-specified units with their dependencies.",
  },
  {
    name: "Coder",
    role: "OmniCoder-9B",
    detail:
      "Free-generates one unit at a time against an explicit TypeScript contract, fed only the neighbors it needs.",
  },
  {
    name: "Harness",
    role: "tsc · eslint · vitest · next build",
    detail:
      "Runs four gates on the candidate. Failures become structured diagnostics; the coder repairs, bounded to six retries.",
  },
  {
    name: "Integrate",
    role: "commit · rebuild · next unit",
    detail:
      "A green unit is committed and the project rebuilt. On exhaustion, a unit falls back to its curated template — the build never stays red.",
  },
];

/** Pricing tiers — Open Source / Team / Enterprise. */
export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Open Source",
    price: "$0",
    period: "forever",
    description: "Everything you need to build and own a full-stack app locally.",
    features: [
      "Menu-driven builder + full block catalog",
      "Local Ollama generation engine",
      "Zero-errors verification harness",
      "All integration adapters (bring your own keys)",
      "MIT-friendly community license",
      "Self-host, no telemetry",
    ],
    cta: { label: "Clone on GitHub", href: GITHUB_URL },
  },
  {
    name: "Team",
    price: "$29",
    period: "/mo per seat",
    description: "Shared registries and cloud escalation for small teams shipping fast.",
    features: [
      "Everything in Open Source",
      "Shared component + integration registry",
      "Optional cloud model escalation (Claude / OpenAI)",
      "Team blueprint presets & theming",
      "Priority community support",
      "Usage analytics dashboard",
    ],
    cta: { label: "Start free trial", href: "/dashboard" },
    highlighted: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Air-gapped deployments, SSO, and support SLAs for regulated orgs.",
    features: [
      "Everything in Team",
      "Self-hosted / air-gapped fleet",
      "SSO / SAML + RBAC",
      "Custom template & registry authoring",
      "Security review & audit support",
      "Dedicated support SLA",
    ],
    cta: { label: "Contact sales", href: "/pricing#enterprise" },
  },
];

/** FAQ items. */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Does my code depend on Syntheon at runtime?",
    answer:
      "No. Like shadcn/ui, components are copied into your project. A generated app has no runtime dependency on Syntheon — you own and can edit every line.",
  },
  {
    question: "Can a small local model really build a large app?",
    answer:
      "Not in one shot — and we don't claim otherwise. Syntheon decomposes the app into thousands of small, typed units, generates each against a contract, and verifies every one with typecheck, lint, tests, and a production build before accepting it.",
  },
  {
    question: "Do I need to send my code to the cloud?",
    answer:
      "No. The engine runs on your machine against a local Ollama fleet. Cloud models (Claude, OpenAI) are optional accelerators for units that fail local repair — off by default.",
  },
  {
    question: "What happens if a unit can't be fixed?",
    answer:
      "After a bounded number of repair attempts, the unit falls back to its curated, already-tested template and is flagged for review. The build never stays red.",
  },
  {
    question: "Which integrations are supported?",
    answer:
      "Clerk, Stripe, Calendly, Gmail, Resend, Claude, OpenAI, Persona, Zapier, n8n, HubSpot, Slack, Discord, Twilio, Segment, PostHog, Notion, Plaid, and more. Each is a typed adapter that ships disabled until you provide keys.",
  },
  {
    question: "Is it really free?",
    answer:
      "The open-source tier is free forever and self-hostable with no telemetry. Team and Enterprise add shared registries, cloud escalation, SSO, and support.",
  },
];

/** Social-proof placeholders. */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We spun up an entire SaaS shell — auth, billing, dashboard — in an afternoon, and every file was ours to edit. No black box.",
    name: "Alex Rivera",
    role: "Founder, early access",
  },
  {
    quote:
      "The verification harness is the whole game. I stopped babysitting AI output because nothing lands unless it typechecks, lints, tests, and builds.",
    name: "Priya Nair",
    role: "Staff Engineer",
  },
  {
    quote:
      "Running it fully local was the reason we could adopt it. Our code never left the network.",
    name: "Marcus Lang",
    role: "Platform Lead, fintech",
  },
  {
    quote:
      "It feels like shadcn/ui grew a build engine. Templates anchor the quality; the model does the boring glue.",
    name: "Dana Okafor",
    role: "Design Engineer",
  },
  {
    quote:
      "Swapping the brand color and radius re-themed the whole generated app without touching the token contract. Clean.",
    name: "Sam Whitfield",
    role: "Indie hacker",
  },
  {
    quote:
      "Honest marketing, honest engineering. They tell you exactly why it works, and it does.",
    name: "Lena Costa",
    role: "CTO, seed-stage",
  },
];
