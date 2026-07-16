# Syntheon Architecture

A map of how the builder is put together. This is the practical, code-level
companion to [DESIGN.md](../DESIGN.md) (which covers the *why*); here we cover the
*where* — the modules, the data that flows between them, and the contract that
keeps the lanes decoupled.

## The one contract everything shares

Every lane depends on a single, deliberately small TypeScript module,
[`studio/types.ts`](../studio/types.ts). It defines the data that flows through
the system and nothing else:

- **`FeatureSpec`** — a catalog entry: id, label, category, the `UnitTemplate[]`
  it contributes, its `requires`, `components`, `integrations`, and `env`.
- **`BuildBlueprint`** — what the menu compiles your choices into and what
  `syntheon.config.json` stores.
- **`GenerationUnit`** — one atomic file to generate (a component, route, api
  handler, adapter, module, config, or test), with a resolved `order`.
- **`BuildPlan`** — a fully expanded, ordered `GenerationUnit[]` plus aggregated
  `env` and `integrations`. This is the handoff between the registry and the
  engine.
- **`GenerationEngine` / `GenerationResult` / `GenerationHooks`** — the interface
  the CLI expects from `studio/ai`, imported defensively so the CLI stays useful
  (dry-run) even when the engine is absent.

Because the whole system talks through these types, each lane can be developed and
tested in isolation. **Additive changes only** — both sides depend on it.

## The lanes

```
                       studio/types.ts  (shared contract)
                                 │
        ┌───────────────┬────────┴────────┬──────────────────┐
        ▼               ▼                 ▼                  ▼
   studio/config   studio/registry    studio/ai         studio/harness
   (blueprint I/O) (catalog+planner)  (plan→code)       (verify gates)
        │               │                 │                  │
        └──────► studio/cli.ts ◄──────────┴──────────────────┘
                 (menu · build · add · explain · doctor)
```

### `studio/config` — blueprint I/O

Zod schemas ([`config/schema.ts`](../studio/config/schema.ts)) validate any
blueprint the CLI reads or writes, and assert every referenced feature id exists
in the registry. `loadBlueprint` / `saveBlueprint` are the only disk I/O for the
blueprint. `DEFAULT_BLUEPRINT` is the `--yes` batteries-included SaaS.

### `studio/registry` — the catalog and the planner

The source of truth for what Syntheon can build:

- [`features.ts`](../studio/registry/features.ts) — the feature catalog and menu
  groups.
- [`components.ts`](../studio/registry/components.ts) — the UI primitive/block
  catalog with `uses` edges.
- [`integrations.ts`](../studio/registry/integrations.ts) — typed adapter
  descriptors (env vars, paid/free, docs link).
- [`index.ts`](../studio/registry/index.ts) — `resolvePlan(blueprint)` expands a
  blueprint into an ordered `BuildPlan` (Kahn topological sort over `dependsOn`,
  de-duplicating shared units); `resolveFeatureAddition(id, existing)` diffs a
  single feature against what's already there; `checkRegistryIntegrity()` verifies
  there are no dangling references.
- [`analyze.ts`](../studio/registry/analyze.ts) — a pure, read-only analysis layer
  over a resolved plan: `analyzePlan` (counts by kind, paid vs. free integrations,
  env total, dependency depth, roots/leaves), `planToSerializable` / `planToJSON`
  (the stable `--json` projection), and `renderAnalysis` (human report). This is
  what powers `explain` and `--json`; it performs no I/O and calls no model.

### `studio/ai` — the generation engine

Consumes a `BuildPlan` and produces verified code:

- [`planner.ts`](../studio/ai/planner.ts) — authoritative deterministic topological
  order; a reasoning model may *refine* the order among independent units, but its
  suggestion is only accepted if it still respects every dependency.
- [`coder.ts`](../studio/ai/coder.ts) / [`context.ts`](../studio/ai/context.ts) —
  generate one unit against its typed contract with assembled context.
- [`generate.ts`](../studio/ai/generate.ts) — `runGeneration`, the engine entry
  point the CLI dynamically imports via [`index.ts`](../studio/ai/index.ts).
- [`ollama.ts`](../studio/ai/ollama.ts) / [`roles.ts`](../studio/ai/roles.ts) —
  local (and optional cloud) chat clients and the model-role mapping.

### `studio/harness` — verification

- [`gates.ts`](../studio/harness/gates.ts) — runs `tsc → eslint → vitest →
  next build` via an **injectable `Runner`**, and parses each tool's output into
  structured `Diagnostic[]`. The injectable runner is why the harness is fully
  unit-testable against canned tool output.
- [`loop.ts`](../studio/harness/loop.ts) — the bounded generate → verify → repair
  loop; on exhaustion it falls back to a unit's curated template and flags it, so
  the tree never stays red.

### `studio/cli.ts` — the front door

Argv parsing and command dispatch. Commands:

| Command | What it does | Writes files? |
|---|---|---|
| `menu` (default) | Interactive menu → `syntheon.config.json` | config only |
| `build` | Resolve plan → run the engine | generated code |
| `add <feature>` | Diff one feature → run the engine | generated code |
| `explain` | Summarize / serialize a plan | no |
| `doctor` | Registry + config health checks | no |

The read-only commands (`explain`, `doctor`) and the `--json` flag are pure
projections of the registry/config lanes, so they run without a model, without the
engine, and without touching disk beyond reading a config.

## Testing strategy

Every lane injects its side effects, so tests never need a live model, real tools,
or the network:

- The **planner/registry/analyze** modules are pure functions over the catalog.
- The **harness** takes an injected `Runner`, exercised with canned tool output.
- The **engine loop** takes an injected `ChatClient`, `Runner`, `FileSource`, and
  `WriteSink` (see `studio/ai/__testkit.ts`), so a whole build can run in-memory.
- The **CLI** exposes `parseArgs` and `main` for command-level tests that capture
  stdout.

Run it all with `npm test` (Vitest); the same suite plus `tsc`, `next lint`, and
`next build` run in CI on every push and PR.
