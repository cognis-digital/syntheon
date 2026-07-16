# Syntheon Usage

Task-oriented recipes for driving the builder. For the exhaustive command/flag
reference see [CLI.md](./CLI.md); for how it all fits together see
[ARCHITECTURE.md](./ARCHITECTURE.md).

## Prerequisites

- **Node ≥ 20**
- For real generation: [Ollama](https://ollama.com) with a coding model and a
  reasoning model. Cloud models (Claude/OpenAI) are optional accelerators, never
  required.

Everything below except the actual `build` generation step works with **no model
running** — planning, inspection, and validation are pure.

```bash
git clone https://github.com/cognis-digital/syntheon
cd syntheon
npm install
```

## Recipe: scaffold an app from the menu

```bash
npm run studio        # pick project type, pages, auth, payments, integrations, theme
npm run studio -- --yes   # or skip the menu with batteries-included SaaS defaults
```

This writes `syntheon.config.json`. Nothing is generated yet — the blueprint is
just your intent, captured and validated.

## Recipe: see exactly what will be built (no model needed)

Before spending model time, inspect the plan:

```bash
npx tsx studio/cli.ts explain --yes
```

```text
my-syntheon-app — saas

Features contributing units : 10
Generation units            : 47
  by kind                   : config=1  component=26  module=2  integration=4  api=6  route=8
Dependency depth            : 4 (roots=19, leaves=27)
Integrations                : 5 (5 bring-your-own-key, 0 free/local)
  keys needed               : clerk, stripe, stripe-link, resend, claude
Environment variables       : 7
```

Point it at a saved blueprint with `--config`:

```bash
npx tsx studio/cli.ts explain --config syntheon.config.json
```

## Recipe: get the plan as JSON for tooling

```bash
npx tsx studio/cli.ts explain --config syntheon.config.json --json > plan.json
```

The JSON is stable and diff-friendly (blueprint · ordered units with in-plan
`dependsOn` · enriched integrations · env · analysis). A few things you can do with
it:

```bash
# How many units of each kind?
npx tsx studio/cli.ts explain --yes --json | jq '.analysis.unitsByKind'

# Which env vars do I need to set?
npx tsx studio/cli.ts explain --yes --json | jq -r '.env[]'

# Which integrations require a paid account?
npx tsx studio/cli.ts explain --yes --json | jq -r '.analysis.paidIntegrations[]'

# The exact generation order:
npx tsx studio/cli.ts explain --yes --json | jq -r '.units[].path'
```

`build --dry-run --json` and `add <feature> --dry-run --json` emit the same shape
for a full build or a single-feature addition.

## Recipe: validate a blueprint in CI

`doctor` exits non-zero when the registry has a dangling reference or a config
doesn't parse/resolve — drop it into a pipeline to catch a broken blueprint before
a build:

```bash
npx tsx studio/cli.ts doctor --config syntheon.config.json --json
```

```jsonc
{
  "ok": true,
  "registry": { "ok": true, "problems": [] },
  "config": { "checked": true, "ok": true }
}
```

A missing config is reported as `"checked": false` (not a failure), so `doctor`
with no arguments still validates registry integrity.

## Recipe: generate the app

```bash
npx tsx studio/cli.ts build            # from syntheon.config.json
npx tsx studio/cli.ts build --yes      # from the SaaS defaults
```

Each unit is generated, run through `tsc → eslint → vitest → next build`, and
repaired until green before it's accepted; units that can't be repaired fall back
to a curated template and are flagged. When the engine can't be reached (e.g.
Ollama isn't running) `build` degrades to a dry-run plan instead of failing.

```bash
npm run dev     # your generated app at http://localhost:3000
```

## Recipe: add one feature to an existing app

```bash
npx tsx studio/cli.ts add page-blog              # add a blog
npx tsx studio/cli.ts add pay-stripe --dry-run   # preview the units first
npx tsx studio/cli.ts add --list                 # list addable feature ids
```

`add` diffs against your current `syntheon.config.json` so shared units aren't
regenerated, then runs the same verify/repair loop.

## Exit codes

| Code | Meaning |
|---|---|
| `0` | Success, a clean dry-run, or all checks passed |
| `1` | A build/add failed, a bad invocation, or `doctor`/`explain` found a problem |
| `130` | The interactive menu was cancelled |
