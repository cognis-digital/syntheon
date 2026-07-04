# Resend

Transactional + broadcast email. React-email friendly (pass a `react` element
or a rendered `html` string).

## Setup

1. Create an API key at [resend.com/api-keys](https://resend.com/api-keys).
2. Verify a sending domain and set `EMAIL_FROM` (e.g. `hi@yourdomain.com`).
3. For broadcasts, create an Audience and note its id.

## Env

```
RESEND_API_KEY=re_...
EMAIL_FROM=hi@yourdomain.com
```

`isConfigured()` requires `RESEND_API_KEY`.

## Usage

```ts
import { sendEmail, createBroadcast, sendBroadcast, addContact } from "@/lib/integrations/resend";

await sendEmail({ to: "user@example.com", subject: "Welcome", html: "<p>Hi</p>" });

const { id } = await createBroadcast({ audienceId: "aud_1", subject: "News", html: "<p>...</p>" });
await sendBroadcast(id);
```

Pass `react: <MyEmail />` instead of `html` to render a React-email component.
