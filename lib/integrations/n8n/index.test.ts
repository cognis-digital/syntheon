import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as n8n from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}

describe("n8n adapter", () => {
  beforeEach(() => {
    process.env.N8N_WEBHOOK_URL = "https://n8n.example.com/webhook/abc";
    process.env.N8N_API_KEY = "n8n_key";
    process.env.N8N_BASE_URL = "https://n8n.example.com";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    n8n.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured when webhook OR api creds present", () => {
    expect(n8n.isConfigured()).toBe(true);
    delete process.env.N8N_WEBHOOK_URL;
    expect(n8n.isConfigured()).toBe(true); // still has api creds
    delete process.env.N8N_API_KEY;
    expect(n8n.isConfigured()).toBe(false);
  });

  it("triggers a workflow webhook", async () => {
    n8n.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ ok: 1 })) as unknown as typeof fetch);
    const res = await n8n.trigger({ hello: "world" });
    expect(res.ok).toBe(true);
    expect(res.body).toEqual({ ok: 1 });
  });

  it("lists workflows with the api key header", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ data: [{ id: "1", name: "wf", active: true }] }));
    n8n.__setFetch(f as unknown as typeof fetch);
    const wfs = await n8n.listWorkflows();
    expect(wfs[0].id).toBe("1");
    expect((f.mock.calls[0][1].headers as Record<string, string>)["X-N8N-API-KEY"]).toBe("n8n_key");
  });

  it("activates a workflow", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ id: "1", name: "wf", active: true }));
    n8n.__setFetch(f as unknown as typeof fetch);
    const wf = await n8n.setWorkflowActive("1", true);
    expect(wf.active).toBe(true);
    expect(f.mock.calls[0][0]).toContain("/workflows/1/activate");
  });
});
