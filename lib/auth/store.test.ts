import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { store, hashPassword, verifyPassword, __setBackend } from "./store";
import { selfHostedAdapter, setCookieResolver } from "./adapters/self-hosted";
import { SESSION_COOKIE, type CookieStore } from "./cookies";

/** In-memory cookie stub. */
function cookieStub(initial: Record<string, string> = {}): CookieStore & {
  jar: Record<string, string>;
} {
  const jar: Record<string, string> = { ...initial };
  return {
    jar,
    get: (name) => (name in jar ? { name, value: jar[name] } : undefined),
    set: (name, value) => {
      jar[name] = value;
    },
    delete: (name) => {
      delete jar[name];
    },
  };
}

describe("self-hosted user store", () => {
  beforeEach(() => {
    // Force the in-memory backend for deterministic tests.
    __setBackend(null);
    store.reset();
  });
  afterEach(() => {
    setCookieResolver(null);
    __setBackend(null);
  });

  it("hashes + verifies passwords", () => {
    const h = hashPassword("hunter2");
    expect(h).not.toContain("hunter2"); // node path: scrypt, no plaintext
    expect(verifyPassword("hunter2", h)).toBe(true);
    expect(verifyPassword("wrong", h)).toBe(false);
  });

  it("creates a user and authenticates", () => {
    const u = store.createUser({ email: "A@B.co", password: "pw12345" });
    expect(u.email).toBe("a@b.co"); // normalized
    expect(store.authenticate("a@b.co", "pw12345")?.id).toBe(u.id);
    expect(store.authenticate("a@b.co", "nope")).toBeNull();
  });

  it("rejects duplicate emails", () => {
    store.createUser({ email: "dup@x.co", password: "pw12345" });
    expect(() => store.createUser({ email: "dup@x.co", password: "pw12345" })).toThrow(
      /already exists/,
    );
  });

  it("mints and resolves a session", () => {
    const u = store.createUser({ email: "s@x.co", password: "pw12345" });
    const sess = store.createSession(u.id);
    expect(store.getSession(sess.token)?.userId).toBe(u.id);
  });

  it("expires sessions", () => {
    const u = store.createUser({ email: "e@x.co", password: "pw12345" });
    const sess = store.createSession(u.id, -1); // already expired
    expect(store.getSession(sess.token)).toBeNull();
  });

  it("destroys sessions", () => {
    const u = store.createUser({ email: "d@x.co", password: "pw12345" });
    const sess = store.createSession(u.id);
    store.destroySession(sess.token);
    expect(store.getSession(sess.token)).toBeNull();
  });
});

describe("self-hosted adapter", () => {
  beforeEach(() => {
    __setBackend(null);
    store.reset();
  });
  afterEach(() => {
    setCookieResolver(null);
    __setBackend(null);
  });

  it("returns anonymous when no cookie resolver is wired", async () => {
    setCookieResolver(null);
    const s = await selfHostedAdapter.getSession();
    expect(s.isAuthenticated).toBe(false);
  });

  it("resolves an authenticated session from the cookie", async () => {
    const u = store.createUser({ email: "c@x.co", password: "pw12345" });
    const sess = store.createSession(u.id);
    const cookies = cookieStub({ [SESSION_COOKIE]: sess.token });
    setCookieResolver(() => cookies);
    const s = await selfHostedAdapter.getSession();
    expect(s.isAuthenticated).toBe(true);
    expect(s.user?.email).toBe("c@x.co");
  });

  it("signOut destroys the session and clears the cookie", async () => {
    const u = store.createUser({ email: "o@x.co", password: "pw12345" });
    const sess = store.createSession(u.id);
    const cookies = cookieStub({ [SESSION_COOKIE]: sess.token });
    setCookieResolver(() => cookies);
    await selfHostedAdapter.signOut();
    expect(cookies.jar[SESSION_COOKIE]).toBeUndefined();
    expect(store.getSession(sess.token)).toBeNull();
  });

  it("treats an unknown token as anonymous", async () => {
    const cookies = cookieStub({ [SESSION_COOKIE]: "bogus" });
    setCookieResolver(() => cookies);
    const s = await selfHostedAdapter.getSession();
    expect(s.isAuthenticated).toBe(false);
  });
});
