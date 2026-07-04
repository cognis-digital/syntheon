# Discord

Post messages via a channel Webhook.

## Setup

1. In a Discord channel: Edit Channel → Integrations → Webhooks → New Webhook.
2. Copy the webhook URL → `DISCORD_WEBHOOK_URL`.

## Env

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/.../...
```

`isConfigured()` requires `DISCORD_WEBHOOK_URL`.

## Usage

```ts
import { sendMessage } from "@/lib/integrations/discord";

await sendMessage("Build passed 🎉");

await sendMessage({
  content: "New order",
  username: "Syntheon Bot",
  embeds: [{ title: "Order #42", description: "$1,200" }],
});
```
