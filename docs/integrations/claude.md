# Claude

Chat + streaming via `@anthropic-ai/sdk`. Default model **`claude-opus-4-8`**
with **adaptive thinking** — the correct on-mode for this model.

## Setup

Get an API key at [console.anthropic.com](https://console.anthropic.com).

## Env

```
ANTHROPIC_API_KEY=sk-ant-...
```

`isConfigured()` requires `ANTHROPIC_API_KEY`.

## Usage

```ts
import { chat, stream } from "@/lib/integrations/claude";

const { text, stopReason } = await chat({
  messages: [{ role: "user", content: "Summarize this repo" }],
  effort: "high",           // low | medium | high | xhigh | max
});

for await (const delta of stream({ messages: [{ role: "user", content: "Write a story" }] })) {
  process.stdout.write(delta);
}
```

## Notes

- Adaptive thinking (`thinking: {type: "adaptive"}`) is on by default; pass
  `thinking: false` to disable.
- `chat` handles the `refusal` stop reason — it returns `text: ""` with
  `stopReason: "refusal"` instead of indexing empty content.
- Streaming defaults to a larger `max_tokens` to avoid request timeouts on long
  outputs.
- The installed SDK version may not yet type the adaptive-thinking fields; see
  `DEPS_NEEDED.md` for the optional SDK upgrade (no code change needed).
