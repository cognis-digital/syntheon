# Syntheon CLI

The Syntheon builder is a small, menu-driven CLI. It compiles your feature
selections into a `syntheon.config.json` blueprint and drives the local
generation engine, which generates and verifies each unit until the build is
green.

```bash
npm run studio           # interactive menu (default)
npm run studio -- --yes  # non-interactive, batteries-included SaaS defaults
```

You can also invoke it directly with `tsx`:

```bash
npx tsx studio/cli.ts [command] [options]
```

## Commands

### `menu` (default)

Runs the interactive menu (`@clack/prompts`): project type, pages, auth,
payments, scheduling, email, CRM, integrations, AI, identity, and theme. Writes
the resulting blueprint to `syntheon.config.json`.

```bash
npx tsx studio/cli.ts
npx tsx studio/cli.ts --yes            # skip the menu, use SaaS defaults
npx tsx studio/cli.ts --out app.json   # write to a different path
```

### `build`

Loads a blueprint, resolves it into an ordered plan, and runs the generation
engine. When the engine (`studio/ai`) isn't available, or with `--dry-run`, it
prints the resolved plan instead of generating.

```bash
npx tsx studio/cli.ts build                 # build from syntheon.config.json
npx tsx studio/cli.ts build --config app.json
npx tsx studio/cli.ts build --yes           # build the SaaS defaults
npx tsx studio/cli.ts build --dry-run       # show the plan, generate nothing
```

### `add <feature>`

Adds **one feature** to an existing app. It resolves just that feature's units
from the registry — the feature's own units plus any component or required-feature
units, with everything already present excluded — and runs them through the same
`typecheck → lint → test → build` verify/repair loop the full build uses, then
reports.

```bash
npx tsx studio/cli.ts add page-blog          # add a blog to the current app
npx tsx studio/cli.ts add pay-stripe --dry-run   # preview the units to be added
npx tsx studio/cli.ts add --list             # list available feature ids
```

How it resolves what to add:

- If a `syntheon.config.json` is present, the addition is **diffed against it**, so
  shared units (e.g. `lib/email/sequences.ts`, or an `app/api/ai/chat/route.ts`
  used by more than one AI feature) aren't regenerated.
- If no config is on disk, the feature is resolved against the always-present
  **core app shell**, so the shell (`app/layout.tsx`, `app/globals.css`, …) isn't
  regenerated.
- If the feature is already present, `add` reports "nothing to do".

`add` reuses the existing engine end-to-end — the planner, the coder, and the
harness repair loop in `studio/ai` + `studio/harness`. Units that fail local
repair fall back to their curated template and are flagged for review, so the tree
never stays red. When the engine isn't reachable (e.g. Ollama is down), `add`
falls back to a dry-run plan.

### `explain`

Resolves a blueprint into a plan and **summarizes it** — features, unit counts by
kind, integrations (split into bring-your-own-key vs. free/local), required env
vars, and the dependency depth of the generation order. Read-only: it never writes
or generates anything, so it is safe to run anywhere, including CI.

```bash
npx tsx studio/cli.ts explain --yes                    # explain the SaaS defaults
npx tsx studio/cli.ts explain --config app.json        # explain a saved blueprint
npx tsx studio/cli.ts explain --config app.json --json # machine-readable plan
```

With `--json`, `explain` prints the full serialized plan — blueprint, ordered
units (with in-plan `dependsOn` edges), enriched integrations, env vars, and the
analysis block — as stable, pretty-printed JSON to stdout. This is the documented
surface for tooling that wants to inspect or diff a plan without running a build.

### `doctor`

Runs health checks and reports problems, exiting non-zero if any are found (so it
works as a CI guard):

- **Registry integrity** — no feature references an unknown component, integration,
  or required feature, and every feature contributes at least one unit.
- **Config validity** — when a `syntheon.config.json` (or `--config`) is present,
  it parses against the schema *and* resolves to a plan. A missing config is not a
  failure (it is simply "not checked").

```bash
npx tsx studio/cli.ts doctor                 # check registry + ./syntheon.config.json
npx tsx studio/cli.ts doctor --config app.json
npx tsx studio/cli.ts doctor --json          # structured report for CI
```

## Options

| Option | Applies to | Meaning |
|---|---|---|
| `-y`, `--yes` | menu, build, explain, doctor | Non-interactive; batteries-included SaaS defaults |
| `-c`, `--config <path>` | build, add, explain, doctor | Load an existing blueprint JSON |
| `-o`, `--out <path>` | menu | Output config path (default `syntheon.config.json`) |
| `--dry-run` | build, add | Print the resolved plan, generate nothing |
| `--json` | explain, doctor, build/add `--dry-run` | Emit machine-readable JSON |
| `--list` | add | List available feature ids and exit |
| `-h`, `--help` | all | Show help |

### The `--json` plan schema

`explain --json` (and `build`/`add --dry-run --json`) emit an object with this shape:

```jsonc
{
  "blueprint": { "version": 1, "name": "...", "projectType": "saas", "features": [...], "theme": {...} },
  "units": [
    { "id": "app/layout.tsx", "path": "app/layout.tsx", "kind": "route",
      "featureId": "core-app-shell", "order": 4, "dependsOn": ["app/globals.css"] }
  ],
  "env": ["STRIPE_SECRET_KEY", "..."],
  "integrations": [
    { "id": "stripe", "label": "Stripe", "paid": true, "env": ["STRIPE_SECRET_KEY", "..."] }
  ],
  "analysis": {
    "name": "...", "projectType": "saas",
    "featureCount": 10, "unitCount": 47,
    "unitsByKind": { "config": 1, "component": 26, "module": 2, "integration": 4, "api": 6, "route": 8, "test": 0 },
    "integrationCount": 5, "paidIntegrations": ["clerk", "stripe", "..."], "freeIntegrations": [],
    "envCount": 7, "dependencyDepth": 4, "rootCount": 19, "leafCount": 27
  }
}
```

Fields and ordering are deterministic, so two runs of the same blueprint diff cleanly.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Success (or a clean dry-run) |
| `1` | A build/add finished with failures, or a bad invocation |
| `130` | The interactive menu was cancelled |

## Under the hood

`menu` / `build` / `add` all funnel through the same pieces:

- **Registry** (`studio/registry`) — the feature/component/integration catalog and
  `resolvePlan` / `resolveFeatureAddition`, which expand selections into an ordered
  `GenerationUnit[]`.
- **Engine** (`studio/ai`) — plans, generates each unit against a typed contract,
  and repairs it against harness diagnostics.
- **Harness** (`studio/harness`) — runs `tsc → eslint → vitest → next build` and
  parses structured diagnostics for the repair loop.

See [DESIGN.md](../DESIGN.md) §4 and §8 for the full architecture.
