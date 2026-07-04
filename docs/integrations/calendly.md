# Calendly

Scheduling embed URL builder + `scheduled_event` webhook verification.

## Setup

1. Copy your scheduling link (e.g. `https://calendly.com/acme/intro`) → `NEXT_PUBLIC_CALENDLY_URL`.
2. Create a webhook subscription (Calendly API or org integrations) pointing at
   `/api/webhooks/calendly`; copy its signing key → `CALENDLY_WEBHOOK_SIGNING_KEY`.

## Env

```
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/acme/intro
CALENDLY_WEBHOOK_SIGNING_KEY=...
```

`isConfigured()` requires the public URL.

## Usage

```ts
import { buildEmbedUrl } from "@/lib/integrations/calendly";

const url = buildEmbedUrl({
  prefill: { name: "Jane", email: "jane@x.co" },
  utm: { utm_source: "pricing" },
  hideGdprBanner: true,
});
```

## Webhook

`app/api/webhooks/calendly/route.ts` verifies the `Calendly-Webhook-Signature`
header (HMAC-SHA256 over `t.{payload}`) and returns `{ event, inviteeEmail,
eventUri }` for `invitee.created` / `invitee.canceled`.
