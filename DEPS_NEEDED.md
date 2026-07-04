# DEPS_NEEDED

Deps the UI/blocks lane would ideally use but that are **not** installed. Everything shipped in
this lane works with the currently-installed deps (functional, a11y-correct equivalents were used
where the canonical shadcn package was missing). Installing the packages below would let those
primitives be swapped for the upstream Radix implementations, but is **not required** — the build
is green as-is.

| Package | Primitive that would use it | Current substitute (works today) |
|---|---|---|
| `@radix-ui/react-radio-group` | `radio-group` | roving-focus + context implementation |
| `@radix-ui/react-slider` | `slider` | styled native `<input type="range">` |
| `@radix-ui/react-scroll-area` | `scroll-area` | native `overflow-auto` container |
| `@radix-ui/react-separator` | `separator` | native `<div role="separator">` |
| `@radix-ui/react-progress` | `progress` | native `<div role="progressbar">` |
| `@radix-ui/react-context-menu` | `context-menu` | built on installed `@radix-ui/react-menu` |
| `react-day-picker` | `calendar` / date-picker | self-contained native month grid |
| `vaul` | `drawer` | built on installed `@radix-ui/react-dialog` (bottom sheet) |
| `@radix-ui/react-hover-card` | `hover-card` | built on installed `@radix-ui/react-popover` |
| `@radix-ui/react-toggle` / `@radix-ui/react-toggle-group` | `toggle`, `toggle-group` | native `aria-pressed` buttons + context |
| `@radix-ui/react-aspect-ratio` | `aspect-ratio` | native CSS `aspect-ratio` |
| `embla-carousel-react` | `carousel` | native scroll-snap track + prev/next |
| `@tanstack/react-table` | `data-table` | native sort/select over the table primitives |

All substitutes keep the same prop surface and semantic class tokens, so swapping to the upstream
package later is a drop-in change confined to the single primitive file.

---

## Integrations lane (adapters)

### Package upgrade (optional, not required)

- **`@anthropic-ai/sdk` — upgrade `^0.32.1` → latest.** The Claude adapter
  (`lib/integrations/claude/`) targets model `claude-opus-4-8` with **adaptive
  thinking** (`thinking: {type: "adaptive"}`), `output_config`, and the `effort`
  parameter. The installed 0.32.1 does not yet *type* those fields (and its
  `stop_reason` union lacks `"refusal"`). The adapter compiles today via a small
  typed-extras intersection and carries the correct runtime shape, so no upgrade
  is required to build green — upgrading just removes the local type shims and
  types these fields natively. No code change needed on upgrade.

No other packages are needed. Every service without an installed SDK (Calendly,
Cal.com, Persona, Zapier, n8n, HubSpot, Slack, Discord, Twilio, Segment,
PostHog, Notion, Airtable, Plaid) is a small typed `fetch` client — **zero new
dependencies**, per the coordination rules. Stripe / Clerk / googleapis /
openai / resend / @anthropic-ai/sdk were already installed.

### New env vars used by adapters (append to `.env.example`)

These services needed env var names not yet in `.env.example`. Adapters degrade
gracefully when they're absent; the owner should append this block (I did not
edit `.env.example` — shared config, out of lane):

```
# --- Scheduling (Cal.com) ---
NEXT_PUBLIC_CALCOM_LINK=
CALCOM_API_KEY=
CALCOM_WEBHOOK_SECRET=

# --- Identity / KYC (Persona webhook) ---
PERSONA_WEBHOOK_SECRET=

# --- CRM / content (Notion, Airtable) ---
NOTION_API_KEY=
NOTION_VERSION=2022-06-28
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=

# --- Automation (Zapier inbound token, n8n API) ---
ZAPIER_INBOUND_TOKEN=
N8N_BASE_URL=

# --- Messaging (Twilio SMS/OTP) ---
TWILIO_FROM_NUMBER=
TWILIO_VERIFY_SERVICE_SID=

# --- Analytics (PostHog host) ---
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# --- Data linking (Plaid env) ---
PLAID_ENV=sandbox
```

---

## Auth / CRM / Email lane (`lib/auth`, `lib/crm`, `lib/email`, `app/(auth)`)

### Packages: none needed

Zero new dependencies. Everything ships against already-installed deps
(`@clerk/nextjs`, `resend`, `googleapis`) or Node built-ins. The self-hosted
auth store uses **`node:sqlite`** (Node 22.5+/24, no native build) with a
transparent in-memory fallback when unavailable, and **`node:crypto`**
(`scrypt`) for password hashing — both server-only and guarded so the client
bundle and tests never touch them.

### Cross-lane wiring notes (for the integration owner)

- **Middleware:** `lib/auth/middleware.ts` exports framework-agnostic
  `protect()` / `isPublicPath()`. The app's root `middleware.ts` (app lane)
  should call `clerkMiddleware()` when Clerk is configured, else run the
  self-hosted decision (`protect(path, isAuthenticated)`).
- **Self-hosted sessions:** in a server context, wire the cookie resolver once:
  `setCookieResolver(() => cookies())` from `lib/auth/adapters/self-hosted`.
  Without it, sessions resolve anonymous (no throw).
- **Auth route handlers:** the fallback forms in `app/(auth)/_components`
  POST to `/api/auth/sign-in|sign-up|waitlist` — those handlers are the
  app/api lane's to add (call `store.authenticate/createUser`,
  `writeSessionToken`, and `joinWaitlist`).
- **Signup → CRM → email:** call `crm.syncSignup(contact, "signup"|"waitlist")`
  on sign-up; `lib/auth`'s `onWaitlistJoin` hook can drive
  `crm.syncSignup(..., "waitlist")` + an `email` welcome-drip enrollment.
- **ClerkProvider:** `app/layout.tsx` (shared config, not mine to edit) should
  wrap children in `<ClerkProvider>` only when Clerk is configured. The auth
  pages guard on config and fall back to self-hosted forms otherwise.

### Env vars used (all already in `.env.example`)

`NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`,
`GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN`, `HUBSPOT_ACCESS_TOKEN`, `DATABASE_URL`.
No new env vars required.
