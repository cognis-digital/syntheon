# Stripe

Checkout, Billing/subscriptions, customer portal, and webhook handling.

## Setup

1. Get keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. Create a Price (product) and copy its ID for `STRIPE_PRICE_ID`.
3. Add a webhook endpoint pointing at `/api/webhooks/stripe`; copy its signing secret.
4. Enable the Customer Portal (Settings → Billing → Customer portal).

## Env

```
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

`isConfigured()` requires `STRIPE_SECRET_KEY`.

## Usage

```ts
import { createCheckoutSession, createBillingPortalSession } from "@/lib/integrations/stripe";

const { url } = await createCheckoutSession({
  successUrl: "https://app/ok",
  cancelUrl: "https://app/cancel",
  customerEmail: "user@example.com",
});
```

## Webhook

`app/api/webhooks/stripe/route.ts` verifies the `stripe-signature` header with
`STRIPE_WEBHOOK_SECRET` (using the raw body — never parse JSON first) and routes
`checkout.session.completed`, subscription, and invoice events.

Test locally with the Stripe CLI:

```
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
