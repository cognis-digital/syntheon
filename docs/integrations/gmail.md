# Gmail API

Send + read email via the Gmail API (OAuth2 refresh-token flow), using
`googleapis`. Good for transactional mail from a Google Workspace mailbox.

## Setup

1. In Google Cloud Console, create an OAuth 2.0 Client (Web application).
2. Enable the **Gmail API**.
3. Run a one-time consent flow with scope `https://www.googleapis.com/auth/gmail.modify`
   (or `gmail.send`) to obtain a **refresh token**.
4. Copy the client id, client secret, and refresh token.

## Env

```
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...
```

`isConfigured()` requires all three.

## Usage

```ts
import { sendEmail, listMessages } from "@/lib/integrations/gmail";

await sendEmail({ to: "user@example.com", subject: "Welcome", body: "<p>Hi</p>", html: true });
const unread = await listMessages("is:unread", 10);
```

## Notes

- Messages are RFC 2822 encoded and base64url-wrapped by the adapter.
- The refresh token is long-lived; store it as a server secret.
