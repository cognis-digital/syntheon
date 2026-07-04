# Airtable

Record CRUD (list / create / update / delete) via the REST API using `fetch`.

## Setup

1. Create a **Personal Access Token** at
   [airtable.com/create/tokens](https://airtable.com/create/tokens) with
   `data.records:read` + `data.records:write` on your base → `AIRTABLE_API_KEY`.
2. Copy the base id (starts with `app...`) → `AIRTABLE_BASE_ID`.

## Env

```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
```

`isConfigured()` requires both.

## Usage

```ts
import { listRecords, createRecord, updateRecord, deleteRecord } from "@/lib/integrations/airtable";

const rows = await listRecords("Contacts", { filterByFormula: "{Status}='Open'" });
const rec = await createRecord("Contacts", { Name: "Jane", Email: "jane@x.co" });
await updateRecord("Contacts", rec.id, { Status: "Won" });
await deleteRecord("Contacts", rec.id);
```

Pass a `base` option to any method to target a different base than the default.
