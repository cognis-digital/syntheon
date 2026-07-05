# Contributing to Syntheon

Thanks for helping build the open, local-first app builder. Contributions of every size are welcome —
a new component, an integration adapter, a docs fix, or a bug report.

## Getting set up

```bash
git clone https://github.com/cognis-digital/syntheon
cd syntheon
npm install
npm run dev          # app at http://localhost:3000
```

For the generation engine, install [Ollama](https://ollama.com) and pull a coding model and a
reasoning model. The engine is fully testable **without** a live model (tests inject a fake client),
so you can contribute to most of the codebase with just Node.

## The four gates (must pass before a PR merges)

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm test             # vitest
npm run build        # next build
```

CI runs all four on every PR. Nothing merges red — that's the core promise of the project, so we hold
ourselves to it too.

## Where things live

| Area | Path | Notes |
|---|---|---|
| UI primitives | `components/ui/` | shadcn "new-york" style, violet tokens |
| Blocks & sections | `components/blocks/`, `components/sections/` | composed, prop-driven |
| Premium components | `components/premium/` | framer-motion; gate motion behind `prefers-reduced-motion` |
| Integration adapters | `lib/integrations/<name>/` | typed, `isConfigured()` guard, setup doc |
| Auth / CRM / email | `lib/auth`, `lib/crm`, `lib/email` | provider-agnostic |
| The builder + engine | `studio/` | CLI, registry, AI engine, verify harness |

## Adding a component

1. Build it in the right folder, typed, dark-mode correct, accessible (visible focus, ARIA).
2. Use `cn` from `@/lib/utils` and the semantic tokens (`bg-background`, `text-primary`, …) — never
   hard-coded colors.
3. Add a colocated `*.test.tsx` that renders it and asserts key content/roles.
4. Run the four gates.

## Adding an integration adapter

Follow an existing adapter in `lib/integrations/`. Every adapter must: export `isConfigured()`, read
keys from env (never commit secrets), **never throw at import/build time**, degrade gracefully when
unconfigured, ship a `docs/integrations/<name>.md`, and include tests against a mocked transport.

## Style & conventions

- TypeScript strict; no `any` in new code where avoidable.
- Client components start with `"use client"`.
- Keep the design honest to [DESIGN.md](./DESIGN.md) — it's the source of truth for look & structure.
- Commit messages: imperative, scoped (`feat(ui): add spotlight-card`).

## Good first issues

Look for the [`good first issue`](https://github.com/cognis-digital/syntheon/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
label. Questions? Open a [Discussion](https://github.com/cognis-digital/syntheon/discussions).

By contributing you agree your work is licensed under the project's [COCL v1.0](./LICENSE).
