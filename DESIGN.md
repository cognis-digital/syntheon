# Syntheon — Design System & Generation Architecture

> The open-source, local-AI full-stack web app builder. Pick your features from a menu; the
> local model generates and debugs the code until zero errors. You own every line.

This document is the single source of truth for **how Syntheon looks, how it is built, and
how it generates apps**. Every contributor and every generation agent reads this first.

---

## 1. Philosophy

1. **You own the code.** Like [shadcn/ui](https://ui.shadcn.com), components are copied into your
   project, not hidden behind an npm dependency. Syntheon-generated apps have no runtime dependency
   on Syntheon.
2. **Templates anchor quality; AI personalizes.** A curated substrate of production-grade,
   already-tested components and blocks anchors visual and structural quality. The local model
   generates *variations and glue* on top — never fragile from-scratch UI under a deadline.
3. **Nothing ships unverified.** Every generated unit passes `typecheck → lint → test → build`
   before it is accepted. The build is green or the unit is rejected and regenerated.
4. **Local-first, no lock-in.** The generation engine runs on your own machine against a local
   Ollama fleet. No code leaves the box. Cloud models (Claude, OpenAI) are optional accelerators,
   never required.

---

## 2. Design tokens

The palette is **Cognis violet** — a deliberate, branded accent, not a default. All color is
expressed as HSL CSS variables in `app/globals.css` and consumed through Tailwind semantic names
so a theme swap is one file.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--primary` | `262 83% 58%` | `262 83% 66%` | primary actions, links, focus |
| `--accent` | `271 91% 65%` | `271 91% 70%` | highlights, gradients |
| `--background` / `--foreground` | white / near-black violet | near-black violet / off-white | page ground |
| `--muted` | `260 30% 96%` | `260 20% 16%` | secondary surfaces |
| `--destructive` | `0 84% 60%` | `0 72% 51%` | danger |
| `--radius` | `0.65rem` | — | corner rounding |

- **Type:** Inter (variable, `--font-sans`). Scale is Tailwind default; headings use
  `tracking-tight` + `text-balance`, body uses `text-pretty`. Running text ≤ 65ch.
- **Spacing/layout:** flex/grid + `gap`; container max `1400px`. Wide content (tables, code,
  diagrams) scrolls inside its own `overflow-x-auto` — the page body never scrolls sideways.
- **Motion:** subtle, purposeful, and gated by `prefers-reduced-motion`. `tailwindcss-animate`
  for enter/exit; no gratuitous motion.
- **Accessibility:** every interactive element has a visible focus ring (`--ring`), keyboard
  operability, and correct ARIA. Radix primitives supply the a11y foundation.

The AI personalization pass may re-theme (brand color, radius, font) but must keep the token
contract intact — it edits values, never the semantic names.

---

## 3. Repository layout

```
syntheon/
├── app/                     # Next.js App Router (routes, layouts, route handlers)
│   ├── (marketing)/         # landing, pricing, blog, legal
│   ├── (auth)/              # sign-in, sign-up, waitlist
│   ├── (app)/               # authenticated dashboard shell
│   └── api/                 # route handlers, webhooks
├── components/
│   ├── ui/                  # shadcn primitives (button, dialog, input, ...)
│   └── blocks/              # composed blocks (hero, pricing, feature-grid, modals, tables ...)
├── lib/
│   ├── integrations/        # typed adapters (stripe, clerk, calendly, gmail, ...)
│   ├── auth/  crm/  email/  # feature modules
│   └── utils.ts
├── studio/                  # the builder itself (Node/TS, runs locally)
│   ├── cli.ts               # menu-driven entry point (@clack/prompts)
│   ├── registry/            # feature + component + integration catalog
│   ├── ai/                  # local-AI generation engine (Ollama fleet client)
│   ├── harness/             # typecheck→lint→test→build repair loop
│   └── templates/           # full app templates the builder composes
└── docs/                    # guides, per-integration setup, architecture
```

**Lane ownership** (so parallel build agents never collide): each top-level subtree above has a
single owner. Agents add files only within their lane and never edit shared config
(`package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`).

---

## 4. The generation engine — how a small local model builds a large, correct app

A 9B model cannot one-shot a 100k-line app. It *can* generate thousands of small, well-specified
units correctly when each is verified and repaired. Syntheon orchestrates the fleet:

```
menu selections
      │
      ▼
┌───────────┐   plan (ordered unit list, deps)    ┌───────────┐
│  PLANNER  │ ─────────────────────────────────▶ │   QUEUE   │
│ deepseek/ │                                     └─────┬─────┘
│  qwen3    │                                           │ next unit
└───────────┘                                           ▼
                                                  ┌───────────┐
                    ┌──────── repair ◀──────────  │   CODER   │  free-generate one unit
                    │                             │ OmniCoder │  (typed contract + context)
                    ▼                             └─────┬─────┘
              ┌───────────┐   errors                    │ candidate
              │  HARNESS  │ ◀───────────────────────────┘
              │ tsc/eslint│   green ─────────▶ INTEGRATE (commit unit, rebuild) ─▶ next
              │ vitest/   │
              │ next build│
              └───────────┘
```

- **Unit granularity:** one component, one route, one API handler, one integration adapter, one
  test file. Small enough to fit the model's competence window with full local context.
- **Typed contracts:** every unit is generated against an explicit TypeScript interface + a
  natural-language spec from the registry, so output shape is constrained.
- **Repair loop:** the harness returns structured errors (file, line, message). The coder gets the
  failing code + errors and regenerates. Bounded retries (default 6); on exhaustion the unit falls
  back to its curated template and is flagged for review — the build never stays red.
- **Context assembly:** the integrator feeds the coder only the relevant neighbors (imported types,
  sibling components, the design tokens) — not the whole repo — keeping prompts small and on-target.
- **Model roles:** planning/reasoning → `deepseek-r1:14b` or `qwen3`; code → `OmniCoder-9B`;
  copy/marketing text → `qwen3`/`llama3`; optional cloud escalation → Claude/OpenAI for a unit that
  fails local repair (opt-in, off by default).

This is the honest answer to "free-generate hundreds of thousands of lines": decomposition +
verification + iteration, not a single heroic prompt.

---

## 5. Menu-driven builder

`npm run studio` launches an interactive TUI (`@clack/prompts`). The user selects:

- **Project type:** SaaS · marketing site · internal tool · marketplace · directory · blog
- **Pages:** landing, pricing, docs, blog, dashboard, settings, admin
- **Auth:** Clerk · self-hosted (Lucia-style) · none — with sign-in / sign-up / **waitlist**
- **Payments:** Stripe (Checkout + Billing) · **Stripe Link** · Lemon Squeezy · Polar · none
- **Scheduling:** **Calendly** · Cal.com · none
- **Email:** Resend · Gmail API · Postmark — plus **automation sequences** (welcome, drip, win-back)
- **CRM:** HubSpot · Salesforce · Attio · Airtable — contact sync + lifecycle
- **Integrations:** Zapier · n8n · Slack · Discord · Twilio · Segment · PostHog · Notion · Plaid
- **AI:** Claude · OpenAI · local Ollama — chat, RAG, agent endpoints
- **Identity/KYC:** Persona · Stripe Identity
- **Theme:** brand color, radius, font, light/dark

Selections compile to a `studio.config.json` blueprint, which drives the generation engine.

---

## 6. Component & block catalog (target)

- **UI primitives (50+):** button, input, textarea, select, checkbox, radio, switch, slider,
  dialog, sheet, drawer, popover, tooltip, dropdown-menu, context-menu, command palette, tabs,
  accordion, avatar, badge, card, table, data-table, calendar, date-picker, toast/sonner, alert,
  skeleton, progress, pagination, breadcrumb, form (react-hook-form + zod).
- **Blocks:** hero (5 variants), feature grid, bento, pricing table, testimonial wall, logo cloud,
  FAQ, CTA, footer, navbar (+ mobile), stats, newsletter/waitlist form, auth cards, dashboard
  shell, sidebar nav, settings layout, empty states, cookie/consent, **modals** (confirm, form,
  command, media, multi-step wizard).

Every component: typed props, dark-mode correct, a11y-checked, and a `*.test.tsx`.

---

## 7. Integration catalog

Each integration is a **typed adapter** in `lib/integrations/<name>/` with: a client factory, typed
methods, a webhook handler where relevant, a `.env` scaffold, a `docs/integrations/<name>.md` setup
guide, and tests against mocked transport. Ships disabled until keys are provided; degrades
gracefully. Keys are read from env — never committed.

| Integration | Capability |
|---|---|
| **Clerk** | auth, sign-in/up, **waitlist**, orgs, RBAC |
| **Stripe** | Checkout, Billing/subscriptions, webhooks, customer portal |
| **Stripe Link** | one-click accelerated checkout |
| **Stripe Identity** | document + selfie KYC |
| **Calendly** | scheduling embed + event webhooks |
| **Cal.com** | open-source scheduling alternative |
| **Gmail API** | send/read, OAuth, transactional email |
| **Resend** | transactional + broadcast email, React email templates |
| **Claude** | chat, tools, streaming (`@anthropic-ai/sdk`) |
| **OpenAI** | chat, embeddings, assistants |
| **Persona** | KYC/AML, document + biometric verification |
| **Zapier** | REST hooks (trigger + action) |
| **n8n** | self-hosted workflow trigger/callback |
| **HubSpot** | CRM contacts, deals, lifecycle sync |
| **Slack / Discord** | notifications, slash commands |
| **Twilio** | SMS, OTP |
| **Segment / PostHog** | analytics, product events |
| **Notion / Airtable** | content + lightweight CRM |
| **Plaid** | bank/account linking |

*"+ more" is a first-class goal: adapters share one interface so new ones drop in.*

---

## 8. The verification harness (zero-errors guarantee)

`studio/harness/loop.ts` runs, in order and on every generated unit and on the whole project:

1. `tsc --noEmit` — types
2. `eslint` — lint + a11y rules
3. `vitest run` — unit/component tests
4. `next build` — production build (route/render correctness)

Failures are parsed into structured diagnostics and fed back to the coder for repair. The loop
exits only when all four are clean (or the unit falls back to template + is flagged). CI runs the
same four gates on every push — the guarantee is enforced, not aspirational.

---

## 9. Non-goals & honesty

- Syntheon does **not** claim a small local model writes flawless code unaided — correctness comes
  from verification + iteration + a curated substrate.
- Integrations that need paid accounts (Stripe, Clerk, Persona, Twilio, Plaid) ship as typed,
  documented adapters with env scaffolds; you bring your own keys.
- No dark patterns, no scraping-for-resale, no credential handling on the user's behalf.
