<div align="center">

# Cognis Studio

### Build your app. Own every line.

**The open-source, local-AI full-stack web app builder.** Pick your features from a menu — auth,
waitlist, email automation, CRM, payments, scheduling, AI, and 20+ integrations — and a local model
generates and debugs the code until zero errors. No cloud dependency. No lock-in. No retainer.

[Design system & architecture →](./DESIGN.md) · [Integrations →](./docs) · Built by [Cognis Digital](https://cognis.digital)

</div>

---

## Why

Agencies and "AI app builders" rent you a black box. Cognis Studio hands you the keys: a
production-grade **Next.js + TypeScript + Tailwind + shadcn/ui** codebase, composed from your menu
selections and personalized by your **own local AI** (Ollama), then run through a real
`typecheck → lint → test → build` loop until it's green. Everything ships as code you own and can
read, on your own machine.

## How it works

```
npm install
npm run studio          # menu: pick project type, pages, auth, payments, integrations, theme
                        # → writes studio.config.json, then the local fleet generates + verifies
npm run dev             # your app is running
```

The generation engine decomposes your choices into small, typed units; a local coding model
free-generates each; and the harness verifies and repairs every one before it's accepted. See
[DESIGN.md §4](./DESIGN.md#4-the-generation-engine--how-a-small-local-model-builds-a-large-correct-app)
for the honest, detailed explanation of how a small model produces a large, correct codebase.

## What you can build

Sign in / sign up / **waitlist** · dashboards · pricing & billing · **Stripe + Stripe Link** ·
**Calendly** scheduling · email automations (welcome/drip/win-back) · CRM sync · KYC · AI chat/RAG ·
and a deep component + block library (modals, forms, data tables, command palette, and more).

## Integrations

Clerk · Stripe · Stripe Link · Stripe Identity · Calendly · Cal.com · Gmail · Resend · Claude ·
OpenAI · Persona · Zapier · n8n · HubSpot · Slack · Discord · Twilio · Segment · PostHog · Notion ·
Airtable · Plaid — and more. Each is a typed adapter with a setup guide; bring your own keys.

## Requirements

- Node ≥ 20
- [Ollama](https://ollama.com) running locally (recommended models: a coding model such as
  `OmniCoder-9B`/`codellama`, a reasoning model such as `deepseek-r1`/`qwen3`). Cloud models
  (Claude/OpenAI) are optional accelerators.

## Status

Early and moving fast. The base scaffold builds today; the component/block library, integration
adapters, builder TUI, and generation engine are being filled out. See [DESIGN.md](./DESIGN.md) for
the full plan and the [issues](https://github.com/cognis-digital/cognis-studio/issues) for what's next.

## License

Cognis Open Community License (COCL). See [LICENSE](./LICENSE).
