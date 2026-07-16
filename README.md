<div align="center">

# ✦ Syntheon

### Build your app. Own every line.

**The open-source, local-AI full-stack app builder.** Pick your features from a menu — auth, waitlist,
payments, email automation, CRM, scheduling, AI, and 20+ integrations — and a model running **on your
own machine** generates the code, then debugs it against a real `typecheck → lint → test → build` loop
until it's green. No cloud. No lock-in. No per-seat bill. You keep the source.

<br/>

[![CI](https://github.com/cognis-digital/syntheon/actions/workflows/ci.yml/badge.svg)](https://github.com/cognis-digital/syntheon/actions/workflows/ci.yml)
[![License: COCL](https://img.shields.io/badge/license-COCL%20v1.0-5b21b6.svg)](./LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-a855f7.svg)](./CONTRIBUTING.md)
[![Local-first](https://img.shields.io/badge/AI-local--first-23d160.svg)](#how-it-works)

[**Quickstart**](#quickstart) · [**How it works**](#how-it-works) · [**vs. the alternatives**](./COMPARISON.md) · [**Docs**](./docs) · [**Roadmap**](./ROADMAP.md) · [**Discussions**](https://github.com/cognis-digital/syntheon/discussions)

</div>

---

## Why Syntheon

Every other "AI app builder" is a black box you rent. You describe an app, a cloud model writes it on
someone else's servers, and you pay per seat to keep looking at code you don't really own. The
boilerplates are the opposite problem: they're static — great on day one, then you're on your own.

**Syntheon is the third option.** A curated, production-grade **Next.js + TypeScript + Tailwind +
shadcn/ui** substrate anchors quality, your **local model** personalizes and extends it, and a real
verification harness guarantees it compiles. The output is a normal repo you own outright, with zero
runtime dependency on Syntheon.

|  | Cloud builders (v0, Bolt, Lovable) | Boilerplates (create-t3, MakerKit) | **Syntheon** |
|---|:---:|:---:|:---:|
| AI generates your features | ✅ | ❌ | ✅ |
| Runs **locally**, code never leaves your box | ❌ | ✅ | ✅ |
| **You own the source**, no lock-in | ⚠️ | ✅ | ✅ |
| Free / no per-seat subscription | ❌ | ⚠️ | ✅ |
| Output **verified** (typecheck·lint·test·build) | ⚠️ | n/a | ✅ |
| Menu-driven, not just a chat prompt | ❌ | ❌ | ✅ |
| Air-gap / on-prem friendly | ❌ | ✅ | ✅ |

→ Full, honest breakdown in [**COMPARISON.md**](./COMPARISON.md).

---

## Quickstart

```bash
git clone https://github.com/cognis-digital/syntheon
cd syntheon
npm install

npm run studio      # ← menu: project type, pages, auth, payments, integrations, theme
npm run dev         # your app is running at http://localhost:3000
```

`npm run studio` writes a `syntheon.config.json` blueprint from your picks; the local generation
engine then builds each piece and verifies it before accepting it. Prefer to skip the menu?
`npm run studio -- --yes` uses sensible defaults.

**Inspect before you build.** Two read-only commands let you (and your CI) see and validate a plan
without generating anything:

```bash
npx tsx studio/cli.ts explain --yes           # units, integrations, env, dependency depth
npx tsx studio/cli.ts explain --yes --json    # the full plan as machine-readable JSON
npx tsx studio/cli.ts doctor                  # registry integrity + config validity (CI-friendly)
```

`explain --json` emits a stable, diff-friendly plan (blueprint · ordered units · integrations · env ·
analysis). See [docs/CLI.md](./docs/CLI.md) for the schema and [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
for how the pieces fit together.

### One-command setup (all platforms)

**Prerequisite:** Node ≥ 20. Optional: [Ollama](https://ollama.com) for local generation.

| Platform | Setup |
|---|---|
| **macOS / Linux** | `./install.sh` |
| **Windows (PowerShell)** | `powershell -ExecutionPolicy Bypass -File .\install.ps1` |
| **make** | `make install` · `make dev` · `make build` · `make studio` |
| **Docker** | `docker build -t syntheon . && docker run -p 3000:3000 syntheon` |

The installers check your Node version, run `npm install`, seed `.env.local` from `.env.example`, and
detect Ollama. Syntheon is a standard Next.js app — it runs anywhere Node runs (Windows, macOS, Linux,
containers); the generation engine talks to a local Ollama endpoint (`OLLAMA_BASE_URL`, default
`http://localhost:11434`).

**Requirements:** Node ≥ 20 and [Ollama](https://ollama.com) with a coding model (e.g. a Qwen/Code
model) and a reasoning model. Cloud models (Claude, OpenAI) are optional accelerators — never required.

---

## What you can build

Sign in / sign up / **waitlist** · dashboards & settings · **Stripe + Stripe Link** billing ·
**Calendly** scheduling · email automations (welcome / drip / win-back) · CRM sync · KYC · AI
chat/RAG endpoints — on top of a deep, owned UI library: 50+ shadcn primitives, dozens of blocks
(hero, pricing, data tables, command palette, modals), and a **premium tier** of framer-motion
components (animated heroes, scroll reveals, parallax, spotlight/tilt cards, custom cursors) and
monetizable features (paywall gates, usage-metered billing, onboarding tours, notification centers).

---

## How it works

A small local model can't one-shot a 100k-line app — but it can generate thousands of *small,
verified* units correctly. Syntheon orchestrates the fleet:

```
menu selections → PLAN (reasoning model, ordered unit list)
                    │
                    ▼
        ┌──────────────────────┐   fails →  feed errors back
        │  GENERATE one unit    │ ─────────────────────────┐
        │  (coding model)       │                          │
        └──────────┬───────────┘                          │
                   ▼                                       │
        ┌──────────────────────┐                           │
        │  VERIFY               │   green → INTEGRATE ─▶ next
        │  tsc·eslint·test·build│                           │
        └──────────┬───────────┘ ──────────────────────────┘
                   └── repair loop (bounded) → template fallback if stuck
```

Every unit is generated against a typed contract, checked by the harness, and repaired until green
before it's accepted. That's the honest answer to "how does a local model produce a large, correct
codebase" — **decomposition + verification + iteration**, not one heroic prompt. Details in
[DESIGN.md](./DESIGN.md).

---

## Integrations

Clerk · Stripe · Stripe Link · Stripe Identity · Calendly · Cal.com · Gmail · Resend · Claude ·
OpenAI · Persona · Zapier · n8n · HubSpot · Slack · Discord · Twilio · Segment · PostHog · Notion ·
Airtable · Plaid — each a typed adapter with a setup guide. Bring your own keys; every adapter
degrades gracefully when unconfigured, so the app always builds.

---

## Local-first & yours

- **Nothing leaves your machine.** Generation runs against local Ollama; your code and product ideas
  aren't sent to a vendor or used to train a model.
- **You own the output.** A standard Next.js repo — no runtime dependency on Syntheon, no account, no
  kill switch. Delete Syntheon and your app keeps working.
- **Air-gap ready.** Works fully offline; cloud models are an optional accelerator you opt into.

---

## Project status

Syntheon builds today and is expanding fast. See the [**Roadmap**](./ROADMAP.md) for what's next and
[**good first issues**](https://github.com/cognis-digital/syntheon/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
to jump in. Contributions welcome — start with [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[Cognis Open Community License (COCL) v1.0](./LICENSE). Built in the open by [Cognis Digital](https://cognis.digital) · [devpairer.com](https://devpairer.com).

<div align="center"><sub>If Syntheon saves you a weekend, a ⭐ helps others find it.</sub></div>
