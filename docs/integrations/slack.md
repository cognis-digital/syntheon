# Slack

Post messages via an Incoming Webhook.

## Setup

1. Create a Slack app and enable **Incoming Webhooks**.
2. Add a webhook to a channel; copy the URL → `SLACK_WEBHOOK_URL`.

## Env

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...
```

`isConfigured()` requires `SLACK_WEBHOOK_URL`.

## Usage

```ts
import { sendMessage } from "@/lib/integrations/slack";

await sendMessage("Deploy finished ✅");

await sendMessage({
  text: "New signup",
  blocks: [{ type: "section", text: { type: "mrkdwn", text: "*New signup:* jane@x.co" } }],
});
```
