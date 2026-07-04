import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as plaid from "./index";

const OLD_ENV = { ...process.env };

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}

describe("plaid adapter", () => {
  beforeEach(() => {
    process.env.PLAID_CLIENT_ID = "cid";
    process.env.PLAID_SECRET = "sec";
    process.env.PLAID_ENV = "sandbox";
  });
  afterEach(() => {
    process.env = { ...OLD_ENV };
    plaid.__setFetch(null);
    vi.restoreAllMocks();
  });

  it("isConfigured requires client id + secret", () => {
    expect(plaid.isConfigured()).toBe(true);
    delete process.env.PLAID_SECRET;
    expect(plaid.isConfigured()).toBe(false);
  });

  it("resolves the base url from PLAID_ENV", () => {
    expect(plaid.baseUrl()).toContain("sandbox.plaid.com");
    process.env.PLAID_ENV = "production";
    expect(plaid.baseUrl()).toContain("production.plaid.com");
  });

  it("creates a link token and injects credentials", async () => {
    const f = vi.fn().mockResolvedValue(jsonResponse({ link_token: "lt_1", expiration: "2026-01-01" }));
    plaid.__setFetch(f as unknown as typeof fetch);
    const res = await plaid.createLinkToken({ userId: "u1" });
    expect(res.linkToken).toBe("lt_1");
    const body = JSON.parse(f.mock.calls[0][1].body as string);
    expect(body).toMatchObject({ client_id: "cid", secret: "sec" });
    expect(body.user.client_user_id).toBe("u1");
  });

  it("exchanges a public token", async () => {
    plaid.__setFetch(vi.fn().mockResolvedValue(jsonResponse({ access_token: "at_1", item_id: "it_1" })) as unknown as typeof fetch);
    const res = await plaid.exchangePublicToken("public-sandbox-x");
    expect(res).toEqual({ accessToken: "at_1", itemId: "it_1" });
  });

  it("fetches accounts", async () => {
    plaid.__setFetch(
      vi.fn().mockResolvedValue(jsonResponse({ accounts: [{ account_id: "a1", name: "Checking", type: "depository" }] })) as unknown as typeof fetch,
    );
    const accts = await plaid.getAccounts("at_1");
    expect(accts[0].account_id).toBe("a1");
  });
});
