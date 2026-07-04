# n8n

Trigger a self-hosted workflow webhook + a small REST API client
(list/activate workflows).

## Setup

1. In your n8n instance, add a **Webhook** node to a workflow; copy its
   production URL → `N8N_WEBHOOK_URL`.
2. (Optional) For the REST API, create an API key (Settings → API) →
   `N8N_API_KEY`, and set your instance base URL → `N8N_BASE_URL`.

## Env

```
N8N_WEBHOOK_URL=https://n8n.example.com/webhook/abc
N8N_API_KEY=...          # optional, for the REST client
N8N_BASE_URL=https://n8n.example.com
```

`isConfigured()` is true when the webhook URL is set **or** both API creds are set.

## Usage

```ts
import { trigger, listWorkflows, setWorkflowActive } from "@/lib/integrations/n8n";

await trigger({ order_id: 42 });

const workflows = await listWorkflows();
await setWorkflowActive(workflows[0].id, true);
```

The REST client sends the `X-N8N-API-KEY` header against `{base}/api/v1`.
