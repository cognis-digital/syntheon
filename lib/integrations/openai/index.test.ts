import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as openaiAdapter from "./index";
import type OpenAI from "openai";

const OLD_ENV = { ...process.env };

function mockOpenAI(opts: {
  create?: unknown;
  embeddings?: unknown;
} = {}) {
  return {
    chat: {
      completions: {
        create:
          opts.create ??
          vi.fn().mockResolvedValue({
            choices: [{ message: { content: "hi" }, finish_reason: "stop" }],
          }),
      },
    },
    embeddings: {
      create:
        opts.embeddings ??
        vi.fn().mockResolvedValue({ data: [{ embedding: [0.1, 0.2] }] }),
    },
  } as unknown as OpenAI;
}

describe("openai adapter", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "sk-test";
    openaiAdapter.__setOpenAI(mockOpenAI());
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    openaiAdapter.__setOpenAI(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the api key", () => {
    expect(openaiAdapter.isConfigured()).toBe(true);
    delete process.env.OPENAI_API_KEY;
    expect(openaiAdapter.isConfigured()).toBe(false);
  });

  it("chat returns the first choice text", async () => {
    const res = await openaiAdapter.chat({
      messages: [{ role: "user", content: "hi" }],
    });
    expect(res.text).toBe("hi");
    expect(res.finishReason).toBe("stop");
  });

  it("rejects empty messages", async () => {
    await expect(openaiAdapter.chat({ messages: [] })).rejects.toThrow(/messages/);
  });

  it("embeds input into vectors", async () => {
    const vecs = await openaiAdapter.embed(["a", "b"]);
    expect(vecs).toEqual([[0.1, 0.2]]);
  });

  it("streams content deltas", async () => {
    async function* fakeStream() {
      yield { choices: [{ delta: { content: "x" } }] };
      yield { choices: [{ delta: { content: "y" } }] };
      yield { choices: [{ delta: {} }] };
    }
    const create = vi.fn().mockResolvedValue(fakeStream());
    openaiAdapter.__setOpenAI(mockOpenAI({ create }));
    const chunks: string[] = [];
    for await (const c of openaiAdapter.stream({ messages: [{ role: "user", content: "hi" }] })) {
      chunks.push(c);
    }
    expect(chunks.join("")).toBe("xy");
  });
});
