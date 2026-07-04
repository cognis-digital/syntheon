# PostHog

`capture` events + `identify` via the public capture API using `fetch`.

## Setup

1. Copy your **Project API Key** → `NEXT_PUBLIC_POSTHOG_KEY` (public — safe client-side).
2. Set `NEXT_PUBLIC_POSTHOG_HOST` to your region (US default, or `https://eu.i.posthog.com`).

## Env

```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

`isConfigured()` requires `NEXT_PUBLIC_POSTHOG_KEY`.

## Usage

```ts
import { capture, identify } from "@/lib/integrations/posthog";

await capture("pricing_page_viewed", "u1", { plan: "pro" });
await identify("u1", { email: "jane@x.co" });
```

`identify` is implemented as a `$identify` event with a `$set` payload.
