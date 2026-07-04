import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as notion from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}

describe("notion adapter", () => {
  beforeEach(() => {
    process.env.NOTION_API_KEY = "secret_x";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    notion.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires the api key", () => {
    expect(notion.isConfigured()).toBe(true);
    delete process.env.NOTION_API_KEY;
    expect(notion.isConfigured()).toBe(false);
  });

  it("creates a page with bearer + version headers", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ id: "p1", url: "https://notion.so/p1" }));
    notion.__setFetch(f as unknown as typeof fetch);
    const page = await notion.createPage(
      { database_id: "db1" },
      { Name: { title: [{ text: { content: "Hi" } }] } },
    );
    expect(page.id).toBe("p1");
    const headers = f.mock.calls[0][1].headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer secret_x");
    expect(headers["Notion-Version"]).toBe("2022-06-28");
  });

  it("creates a database", async () => {
    notion.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ id: "db2" })) as unknown as typeof fetch);
    const db = await notion.createDatabase("p1", "Leads", { Name: { title: {} } });
    expect(db.id).toBe("db2");
  });

  it("queries a database", async () => {
    notion.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ results: [{ id: "p9" }] })) as unknown as typeof fetch);
    const res = await notion.queryDatabase("db1");
    expect(res.results[0].id).toBe("p9");
  });

  it("throws on non-ok", async () => {
    notion.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ message: "no" }, false, 401)) as unknown as typeof fetch);
    await expect(notion.queryDatabase("db1")).rejects.toThrow(/notion.*401/);
  });
});
