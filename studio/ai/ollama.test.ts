import { describe, it, expect, vi, afterEach } from "vitest";
import {
  OllamaClient,
  CloudClient,
  isOllamaUp,
  listOllamaModels,
} from "./ollama.js";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
  vi.restoreAllMocks();
});

function mockFetch(impl: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  globalThis.fetch = vi.fn(impl as never) as never;
}

describe("isOllamaUp", () => {
  it("returns true on a 200 from /api/tags", async () => {
    mockFetch(() => new Response("{}", { status: 200 }));
    expect(await isOllamaUp("http://x")).toBe(true);
  });

  it("returns false when fetch rejects", async () => {
    mockFetch(() => {
      throw new Error("ECONNREFUSED");
    });
    expect(await isOllamaUp("http://x")).toBe(false);
  });

  it("returns false on a non-ok status", async () => {
    mockFetch(() => new Response("", { status: 500 }));
    expect(await isOllamaUp("http://x")).toBe(false);
  });
});

describe("listOllamaModels", () => {
  it("maps the /api/tags model names", async () => {
    mockFetch(() =>
      new Response(JSON.stringify({ models: [{ name: "a" }, { name: "b" }] }), {
        status: 200,
      }),
    );
    expect(await listOllamaModels("http://x")).toEqual(["a", "b"]);
  });

  it("returns [] when down", async () => {
    mockFetch(() => {
      throw new Error("down");
    });
    expect(await listOllamaModels("http://x")).toEqual([]);
  });
});

describe("OllamaClient.chat (non-streaming)", () => {
  it("posts to /api/chat and returns message content", async () => {
    let captured: unknown;
    mockFetch((url, init) => {
      captured = { url, body: JSON.parse(String(init?.body)) };
      return new Response(JSON.stringify({ message: { content: "hello" } }), {
        status: 200,
      });
    });
    const c = new OllamaClient({ host: "http://x", defaultModel: "m" });
    const out = await c.chat([{ role: "user", content: "hi" }], { model: "m" });
    expect(out).toBe("hello");
    expect((captured as { url: string }).url).toContain("/api/chat");
  });

  it("sets format:json when json option is on", async () => {
    let body: { format?: string } = {};
    mockFetch((_url, init) => {
      body = JSON.parse(String(init?.body));
      return new Response(JSON.stringify({ message: { content: "{}" } }), { status: 200 });
    });
    const c = new OllamaClient({ host: "http://x", defaultModel: "m" });
    await c.chat([{ role: "user", content: "hi" }], { model: "m", json: true });
    expect(body.format).toBe("json");
  });

  it("retries on a transient failure then succeeds", async () => {
    let n = 0;
    mockFetch(() => {
      n++;
      if (n === 1) throw new Error("transient");
      return new Response(JSON.stringify({ message: { content: "ok" } }), { status: 200 });
    });
    const c = new OllamaClient({ host: "http://x", defaultModel: "m", retries: 2 });
    expect(await c.chat([{ role: "user", content: "hi" }], { model: "m" })).toBe("ok");
    expect(n).toBe(2);
  });

  it("throws a clear error after exhausting retries", async () => {
    mockFetch(() => new Response("boom", { status: 500 }));
    const c = new OllamaClient({ host: "http://x", defaultModel: "m", retries: 1 });
    await expect(c.chat([{ role: "user", content: "hi" }], { model: "m" })).rejects.toThrow(
      /Ollama chat failed/,
    );
  });
});

describe("OllamaClient.chat (streaming)", () => {
  it("accumulates tokens and invokes onToken", async () => {
    const lines =
      JSON.stringify({ message: { content: "he" } }) +
      "\n" +
      JSON.stringify({ message: { content: "llo" } }) +
      "\n";
    mockFetch(
      () =>
        new Response(new TextEncoder().encode(lines), {
          status: 200,
          headers: { "content-type": "application/x-ndjson" },
        }),
    );
    const c = new OllamaClient({ host: "http://x", defaultModel: "m" });
    const toks: string[] = [];
    const out = await c.chat([{ role: "user", content: "hi" }], {
      model: "m",
      onToken: (t) => toks.push(t),
    });
    expect(out).toBe("hello");
    expect(toks).toEqual(["he", "llo"]);
  });
});

describe("CloudClient", () => {
  it("is unavailable without an API key", () => {
    const c = new CloudClient({ provider: "anthropic", apiKey: "" });
    expect(c.available).toBe(false);
  });

  it("reports available with a key and refuses to chat without one", async () => {
    const withKey = new CloudClient({ provider: "openai", apiKey: "sk-test" });
    expect(withKey.available).toBe(true);
    const without = new CloudClient({ provider: "openai", apiKey: "" });
    await expect(without.chat([], { model: "x" })).rejects.toThrow(/no API key/);
  });

  it("defaults the model per provider", () => {
    expect(new CloudClient({ provider: "anthropic", apiKey: "k" }).defaultModel).toContain(
      "claude",
    );
    expect(new CloudClient({ provider: "openai", apiKey: "k" }).defaultModel).toContain("gpt");
  });
});
