# Twilio

SMS + OTP (Verify) via the REST API using `fetch` (no SDK dependency).

## Setup

1. Get your Account SID + Auth Token from the [Twilio Console](https://console.twilio.com).
2. Buy/enable an SMS-capable number → `TWILIO_FROM_NUMBER`.
3. For OTP, create a **Verify Service** and copy its SID → `TWILIO_VERIFY_SERVICE_SID`.

## Env

```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+15550001111
TWILIO_VERIFY_SERVICE_SID=VA...
```

`isConfigured()` requires the Account SID + Auth Token.

## Usage

```ts
import { sendSms, startVerification, checkVerification } from "@/lib/integrations/twilio";

await sendSms("+15552223333", "Your code is on the way.");

await startVerification("+15552223333");            // sends an OTP
const { approved } = await checkVerification("+15552223333", "123456");
```

Auth is HTTP Basic (`AccountSID:AuthToken`), form-encoded bodies.
