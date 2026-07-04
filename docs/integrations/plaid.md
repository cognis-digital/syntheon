# Plaid

Bank/account linking — create a Link token, exchange the public token, fetch
accounts. Implemented over the REST API with `fetch` (no SDK dependency).

## Setup

1. Get your client id + secret from the [Plaid Dashboard](https://dashboard.plaid.com).
2. Choose an environment: `sandbox`, `development`, or `production`.

## Env

```
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
```

`isConfigured()` requires the client id + secret. The base URL is derived from
`PLAID_ENV`.

## Usage

```ts
import { createLinkToken, exchangePublicToken, getAccounts } from "@/lib/integrations/plaid";

// server: create a link token for the client-side Plaid Link flow
const { linkToken } = await createLinkToken({ userId: "u1" });

// after Link onSuccess, exchange the public token
const { accessToken, itemId } = await exchangePublicToken(publicToken);

const accounts = await getAccounts(accessToken);
```

Credentials (`client_id`, `secret`) are injected into every request body
server-side — never expose them to the client. The default `client_name` sent
to Plaid Link is "Syntheon".
