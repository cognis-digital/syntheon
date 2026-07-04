# Notion

Create pages + databases and query databases via the REST API using `fetch`.

## Setup

1. Create an integration at [notion.so/my-integrations](https://www.notion.so/my-integrations);
   copy its secret → `NOTION_API_KEY`.
2. Share the target page/database with the integration (Share → invite the integration).

## Env

```
NOTION_API_KEY=secret_...   (or ntn_...)
NOTION_VERSION=2022-06-28
```

`isConfigured()` requires `NOTION_API_KEY`.

## Usage

```ts
import { createPage, createDatabase, queryDatabase } from "@/lib/integrations/notion";

const page = await createPage(
  { database_id: "..." },
  { Name: { title: [{ text: { content: "New lead" } }] } },
);

const results = await queryDatabase("...", {
  filter: { property: "Status", select: { equals: "Open" } },
});
```

Requests send `Authorization: Bearer`, `Notion-Version`, and JSON bodies.
