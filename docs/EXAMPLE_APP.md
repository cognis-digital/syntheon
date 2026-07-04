# Example app — a working SaaS on top of Syntheon

Syntheon ships a complete, working example SaaS app under `app/(app)/`. It is the
reference for what a generated app looks like: real authentication, a real CRUD
feature backed by a local store, a billing/upgrade surface, settings, and proper
loading / empty / error states. **It renders and builds with no environment keys**
— every integration degrades to a local or mock fallback — so you can `npm run dev`
and click through it immediately.

## What's in it

| Route | What it demonstrates |
|---|---|
| `/dashboard` | KPI cards, a generation-throughput chart, recent-activity list |
| `/projects` | A full CRUD feature — create, edit, delete, search, filter — backed by a local store |
| `/billing` | Plan catalog + upgrade flow using the typed Stripe adapter (mock when unconfigured) |
| `/settings` | Tabbed profile / appearance / billing settings |

The authenticated shell (sidebar, top bar, user identity) lives in
`app/(app)/_components/`. Every route renders inside it via `app/(app)/layout.tsx`.

## Authentication — `@/lib/auth`

The app resolves the current user through the provider-agnostic auth entry point:

```ts
// app/(app)/_components/session.ts
import { getSession } from "@/lib/auth";
import { setCookieResolver } from "@/lib/auth/adapters/self-hosted";
```

- With **Clerk keys** present, `@/lib/auth` uses Clerk.
- With **no keys**, it uses the built-in self-hosted adapter (session cookie +
  local user store) — so auth works out of the box.
- In **dev/preview** with nobody signed in, `resolveSession()` surfaces a friendly
  preview identity so the shell and its data are demonstrable. In **production**,
  an unauthenticated request stays anonymous.

Every action re-resolves the session server-side and scopes data to the user, so
one user never sees another's records.

## The CRUD feature — Projects

The Projects feature is the heart of the example. It shows the full loop a real
feature needs.

### Store (`app/(app)/_data/projects-store.ts`)

Persistence mirrors the pattern in `lib/auth/store.ts`: a `node:sqlite` backend
when a server-side SQLite handle can be opened, transparently falling back to an
in-process `Map` for tests, the browser, and the static build. It never throws at
import time and needs no env keys.

- Records are **scoped by `ownerId`** — `update` / `remove` enforce ownership.
- A first-time owner is **seeded** with a small demo set; empty it and you get the
  genuine empty state (it won't re-seed).
- `__setProjectsBackend(null)` is a test seam for a clean backend per test.

### Validation (`app/(app)/_data/projects-schema.ts`)

A single **zod** schema is shared by the client form (via `@hookform/resolvers/zod`)
and the server actions, so the same rules run on both sides. `parseProjectForm`
returns either validated values or a `{ field: message }` map.

### Server actions (`app/(app)/_data/projects-actions.ts`)

`"use server"` functions — `listProjects`, `createProject`, `updateProject`,
`deleteProject` — each:

1. resolve the session and derive the owner id,
2. validate the payload with the shared schema,
3. mutate the store (ownership-enforced),
4. `revalidatePath("/projects")` so the UI reflects the change,
5. return a typed `ActionResult` (they never throw to the client).

### UI (`app/(app)/_components/`)

- `projects-manager.tsx` — search + status filter, the card grid, per-row actions
  (edit / delete with a confirm dialog), and optimistic local updates.
- `project-form-dialog.tsx` — the create/edit dialog wired to react-hook-form +
  the shared schema; server field errors are mapped back onto the form.

### States

- **Loading** — `app/(app)/projects/loading.tsx` renders a skeleton grid.
- **Empty** — a friendly `EmptyState` with a "New project" call to action.
- **No results** — a distinct empty state when a search/filter matches nothing.
- **Error** — `app/(app)/projects/error.tsx` is a route-level error boundary with
  a retry, so a thrown action keeps the shell intact.

## Billing (`app/(app)/_data/billing.ts` + `billing-actions.ts`)

The billing surface uses the **typed Stripe adapter** (`lib/integrations/stripe`)
through server actions:

- `startCheckout(planId)` creates a real Checkout session **when
  `STRIPE_SECRET_KEY` is set**; otherwise it returns `{ mock: true }` and the UI
  shows a labelled "connect Stripe to enable" notice instead of throwing.
- `openBillingPortal(customerId)` opens the Stripe customer portal (live mode).

`getBillingState()` resolves the current plan/subscription; in mock mode it is
deterministic (free plan, no subscription) so dev, tests, and the static build are
stable.

## Testing

Colocated `*.test.ts(x)` cover the store (CRUD + ownership + seeding), the schema,
the billing model, and the interactive components (rendered with
`@testing-library/react`, server actions stubbed). Run them with `npm test`.

> Under vitest, `server-only` is aliased to its no-op stub (see `vitest.config.ts`)
> so server modules can be unit-tested directly.
