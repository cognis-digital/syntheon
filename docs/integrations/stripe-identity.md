# Stripe Identity

Document + selfie KYC via VerificationSession.

## Setup

1. Enable Identity in the [Stripe Dashboard](https://dashboard.stripe.com/identity).
2. Add a webhook endpoint at `/api/webhooks/stripe-identity` for
   `identity.verification_session.*` events.

## Env

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Usage

```ts
import { createVerificationSession, getVerificationSession } from "@/lib/integrations/stripe-identity";

const session = await createVerificationSession({
  returnUrl: "https://app/kyc/done",
  requireLiveSelfie: true,
});
// redirect the user to session.url (or use session.clientSecret with Stripe.js)

const state = await getVerificationSession(session.id); // status: verified | requires_input | ...
```

## Webhook

`app/api/webhooks/stripe-identity/route.ts` verifies the signature and returns
`{ sessionId, status }` for `identity.verification_session.*` events.
