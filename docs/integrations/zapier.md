# Zapier

Outbound REST-hook trigger + inbound action parsing.

## Setup

1. In Zapier, create a Zap with a **Catch Hook** (Webhooks by Zapier) trigger;
   copy the hook URL → `ZAPIER_WEBHOOK_URL`.
2. (Optional) For inbound actions (a Zap POSTing to your app), set a shared
   token → `ZAPIER_INBOUND_TOKEN` and check it on your endpoint.

## Env

```
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/.../...
ZAPIER_INBOUND_TOKEN=            # optional, for inbound actions
```

`isConfigured()` requires `ZAPIER_WEBHOOK_URL`.

## Usage

```ts
import { trigger, parseInboundAction, verifyInboundToken } from "@/lib/integrations/zapier";

await trigger({ event: "signup", email: "user@example.com" });

// inbound endpoint
if (!verifyInboundToken(req.headers.get("x-zapier-token") ?? undefined)) return unauthorized();
const { action, data } = parseInboundAction(await req.text());
```

Zapier Catch Hooks are unauthenticated by convention — protect inbound
endpoints with a secret path or the shared token above.
