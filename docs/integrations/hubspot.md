# HubSpot

CRM contacts + deals with lifecycle sync, via the v3 CRM API.

## Setup

1. Create a **private app** (Settings → Integrations → Private Apps).
2. Grant scopes `crm.objects.contacts.read/write` and `crm.objects.deals.read/write`.
3. Copy the access token → `HUBSPOT_ACCESS_TOKEN`.

## Env

```
HUBSPOT_ACCESS_TOKEN=pat-na1-...
```

`isConfigured()` requires `HUBSPOT_ACCESS_TOKEN`.

## Usage

```ts
import { upsertContact, setLifecycleStage, createDeal, updateDeal } from "@/lib/integrations/hubspot";

const contact = await upsertContact("user@example.com", { firstname: "Jane" });
await setLifecycleStage(contact.id, "customer");

const deal = await createDeal({ dealname: "Acme — Pro", amount: "1200" });
```

`upsertContact` searches by email then creates/updates — HubSpot has no native
upsert, so this is two API calls.
