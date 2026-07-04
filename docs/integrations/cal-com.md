# Cal.com

Open-source scheduling. Booking-link builder + v2 REST client + webhook verify.

## Setup

1. Copy your event-type link (e.g. `https://cal.com/acme/30min`) → `NEXT_PUBLIC_CALCOM_LINK`.
2. Create an API key (Settings → Developer → API keys) → `CALCOM_API_KEY`.
3. Add a webhook (Settings → Developer → Webhooks) pointing at `/api/webhooks/cal-com`;
   set a secret → `CALCOM_WEBHOOK_SECRET`.

## Env

```
NEXT_PUBLIC_CALCOM_LINK=https://cal.com/acme/30min
CALCOM_API_KEY=cal_...
CALCOM_WEBHOOK_SECRET=...
```

`isConfigured()` requires the public link.

## Usage

```ts
import { buildBookingLink, listBookings, cancelBooking } from "@/lib/integrations/cal-com";

const link = buildBookingLink({ name: "Jo", email: "jo@x.co" });
const bookings = await listBookings({ status: "upcoming" });
```

## Webhook

`app/api/webhooks/cal-com/route.ts` verifies the `X-Cal-Signature-256` HMAC and
returns `{ triggerEvent, bookingUid }` for `BOOKING_CREATED` / `CANCELLED` /
`RESCHEDULED`.
