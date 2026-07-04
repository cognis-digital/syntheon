# Syntheon vs. the alternatives

An honest look at where Syntheon fits. Every tool here is good at something — this is about
*trade-offs*, not dunking. If another tool fits your constraints better, use it.

## The three camps

1. **Cloud AI builders** — v0, Bolt.new, Lovable, Replit Agent. You prompt; a hosted model writes and
   runs the app on their infra. Fast to first pixel, great for prototypes.
2. **Boilerplates / starters** — create-t3-app, MakerKit, ShipFast, Open SaaS, Supastarter. A curated
   codebase you clone. Excellent foundations; no AI personalization after day one.
3. **Syntheon** — a curated substrate *plus* a **local** AI that generates and verifies features into
   it, producing a repo you own outright.

## Feature matrix

| Capability | v0 / Bolt / Lovable | create-t3 / MakerKit / Open SaaS | **Syntheon** |
|---|:---:|:---:|:---:|
| AI generates your features from intent | ✅ | ❌ | ✅ |
| Menu-driven scope selection | ❌ (chat only) | ⚠️ (flags) | ✅ |
| Runs **locally** — code never leaves your machine | ❌ | ✅ | ✅ |
| Air-gap / on-prem capable | ❌ | ✅ | ✅ |
| **You own the source**, zero runtime lock-in | ⚠️ export-gated | ✅ | ✅ |
| Free, no per-seat subscription | ❌ | ⚠️ (paid kits) | ✅ |
| Output **verified**: typecheck·lint·test·build loop | ⚠️ best-effort | n/a (static) | ✅ |
| Repairs its own type/lint/build errors | ⚠️ | ❌ | ✅ |
| Curated shadcn/ui substrate you can edit | ⚠️ | ✅ | ✅ |
| Premium animated components (framer-motion) | ⚠️ | ⚠️ | ✅ |
| Typed integration adapters (20+) w/ setup docs | ⚠️ | ⚠️ | ✅ |
| Your code used to train a vendor model | often | never | **never** |

## When to pick which

**Pick a cloud builder** if you want the absolute fastest path to a live prototype, don't mind a
subscription, and are fine with your code on someone else's servers.

**Pick a boilerplate** if you want a proven static foundation, know exactly what you're building, and
don't need AI to extend it for you.

**Pick Syntheon** if you want AI to build *and maintain* features **on your own hardware**, need the
output to be a repo you fully own (regulated industry, air-gap, or just no lock-in), and want every
generated line to have passed a real build before you see it.

## The honest limitations

- **Local models are smaller than frontier cloud models.** Syntheon compensates with a curated
  substrate + verification + iteration rather than raw one-shot generation — but a giant, novel,
  from-scratch feature is still easier on a frontier model. You can opt into Claude/OpenAI as an
  accelerator when a unit is hard.
- **First run needs Ollama + models pulled.** That's a setup step cloud builders don't have.
- **It's young.** The substrate and integrations are solid; breadth is growing fast (see the
  [roadmap](./ROADMAP.md)). File issues — that's how it gets better.

## What we will not do

Syntheon studies common design *patterns* to produce **original** premium UIs. It does not clone a
specific brand's proprietary design, assets, logos, or copy, and it won't generate features intended
to deceive users. Own your app — honestly.
