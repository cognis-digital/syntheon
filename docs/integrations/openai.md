# OpenAI

Chat completions + embeddings via the `openai` SDK.

## Setup

Get an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

## Env

```
OPENAI_API_KEY=sk-...
```

`isConfigured()` requires `OPENAI_API_KEY`.

## Usage

```ts
import { chat, stream, embed } from "@/lib/integrations/openai";

const { text } = await chat({ messages: [{ role: "user", content: "Hello" }] });

const vectors = await embed(["chunk one", "chunk two"]); // text-embedding-3-small

for await (const delta of stream({ messages: [{ role: "user", content: "Write a poem" }] })) {
  process.stdout.write(delta);
}
```

Defaults: chat model `gpt-4o`, embedding model `text-embedding-3-small`
(override via the `model` option).
