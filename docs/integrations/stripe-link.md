# Stripe Link

One-click accelerated checkout via the Payment Element with Link enabled.
The server creates a PaymentIntent (or SetupIntent) with
`automatic_payment_methods` — Stripe surfaces Link, cards, and wallets from
your dashboard configuration. The client mounts the Payment Element with the
returned `clientSecret`.

## Setup

Uses your existing Stripe keys. Enable Link in the Dashboard
(Settings → Payments → Payment methods → Link).

## Env

```
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Usage

```ts
import { createCheckoutIntent } from "@/lib/integrations/stripe-link";

// server
const { clientSecret, publishableKey } = await createCheckoutIntent({ amount: 1999 });

// client (pseudo)
// const stripe = Stripe(publishableKey)
// const elements = stripe.elements({ clientSecret })
// elements.create("payment")  // Link appears automatically
```

Use `createSetupIntent()` to save a Link-enabled payment method with no charge.
