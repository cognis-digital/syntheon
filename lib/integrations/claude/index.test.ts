import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as claude from "./index";
import type Anthropic from "@anthropic-ai/sdk";

const OLD_ENV = { ...process.env };

function mockClaude(createImpl?: unknown, streamImpl?: unknown) {
  return {
    messages: {
      create:
        createImpl ??
        vi.fn().mockResolvedValue({
          content: [{ type: "text", text: "hi there" }],
          stop_reason: "end_turn",
        }),
      stream: streamImpl,
    },
  } as unknown as Anthropic;
}

describe("claude adapter", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    claude.__setClaude(mockClaude());
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    claude.__setClaude(null);
    vi.restoreAllMocks();
  });

  it("defaults to claude-opus-4-8", () => {
    expect(claude.DEFAULT_MODEL).toBe("claude-opus-4-8");
  });

  it("isConfigured requires the api key", () => {
    expect(claude.isConfigured()).toBe(true);
    delete process.env.ANTHROPIC_API_KEY;
    expect(claude.isConfigured()).toBe(false);
  });

  it("chat returns concatenated text and enables adaptive thinking", async () => {
    const create = vi.fn().mockResolvedValue({
      content: [
        { type: "thinking", thinking: "" },
        { type: "text", text: "hello " },
        { type: "text", text: "world" },
      ],
      stop_reason: "end_turn",
    });
    claude.__setClaude(mockClaude(create));
    const res = await claude.chat({ messages: [{ role: "user", content: "hi" }] });
    expect(res.text).toBe("hello world");
    expect(res.stopReason).toBe("end_turn");
    const params = create.mock.calls[0][0];
    expect(params.model).toBe("claude-opus-4-8");
    expect(params.thinking).toEqual({ type: "adaptive" });
  });

  it("disables thinking when requested", async () => {
    const create = vi.fn().mockResolvedValue({ content: [], stop_reason: "end_turn" });
    claude.__setClaude(mockClaude(create));
    await claude.chat({ messages: [{ role: "user", content: "hi" }], thinking: false });
    expect(create.mock.calls[0][0].thinking).toEqual({ type: "disabled" });
  });

  it("handles a refusal stop reason without indexing content", async () => {
    const create = vi.fn().mockResolvedValue({ content: [], stop_reason: "refusal" });
    claude.__setClaude(mockClaude(create));
    const res = await claude.chat({ messages: [{ role: "user", content: "x" }] });
    expect(res).toMatchObject({ text: "", stopReason: "refusal" });
  });

  it("rejects empty messages", async () => {
    await expect(claude.chat({ messages: [] })).rejects.toThrow(/messages/);
  });

  it("streams text deltas", async () => {
    async function* fakeStream() {
      yield { type: "content_block_delta", delta: { type: "text_delta", text: "a" } };
      yield { type: "content_block_delta", delta: { type: "text_delta", text: "b" } };
      yield { type: "message_stop" };
    }
    const streamFn = vi.fn().mockReturnValue(fakeStream());
    claude.__setClaude(mockClaude(undefined, streamFn));
    const chunks: string[] = [];
    for await (const c of claude.stream({ messages: [{ role: "user", content: "hi" }] })) {
      chunks.push(c);
    }
    expect(chunks.join("")).toBe("ab");
  });
});
