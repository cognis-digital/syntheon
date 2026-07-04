# Persona

KYC/AML — create an inquiry and verify inbound webhooks.

## Setup

1. Get an API key from the [Persona Dashboard](https://withpersona.com) (Settings → API keys).
2. Copy your inquiry template id → `PERSONA_TEMPLATE_ID`.
3. Add a webhook pointing at `/api/webhooks/persona`; copy its secret → `PERSONA_WEBHOOK_SECRET`.

## Env

```
PERSONA_API_KEY=persona_...
PERSONA_TEMPLATE_ID=itmpl_...
PERSONA_WEBHOOK_SECRET=wbhsec_...
```

`isConfigured()` requires `PERSONA_API_KEY`.

## Usage

```ts
import { createInquiry } from "@/lib/integrations/persona";

const inquiry = await createInquiry({ referenceId: "user_123" });
// hand inquiry.id to the Persona embedded/hosted flow
```

## Webhook

`app/api/webhooks/persona/route.ts` verifies the `Persona-Signature` header
(HMAC-SHA256 over `t.{payload}`) and returns `{ name, inquiryId, status }` for
`inquiry.*` events.
