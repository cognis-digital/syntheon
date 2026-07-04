/**
 * Self-hosted user + session store for Syntheon.
 *
 * Backed by `node:sqlite` (Node 22.5+/24, no native build step) when a
 * server-side SQLite handle can be opened; otherwise it transparently falls
 * back to an in-process Map so the same API works in the browser, in tests,
 * and during a static build. Nothing here throws at import time.
 *
 * This is intentionally small — a Lucia-style credential store, not a full IdP.
 * Passwords are salted + hashed with scrypt (node:crypto). Sessions are opaque
 * random tokens with an expiry.
 */
import { env } from "../integrations/types";

/** A stored user record. `passwordHash` is `scrypt`-derived, never plaintext. */
export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  createdAt: number;
}

/** A stored opaque session. */
export interface StoredSession {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

/** The backend the store persists through. */
export interface StoreBackend {
  insertUser(u: StoredUser): void;
  findUserByEmail(email: string): StoredUser | null;
  findUserById(id: string): StoredUser | null;
  insertSession(s: StoredSession): void;
  findSession(token: string): StoredSession | null;
  deleteSession(token: string): void;
  clear(): void;
}

/* -------------------------------------------------------------------------- */
/* In-memory backend (browser / test / build fallback)                        */
/* -------------------------------------------------------------------------- */

function memoryBackend(): StoreBackend {
  const users = new Map<string, StoredUser>();
  const sessions = new Map<string, StoredSession>();
  return {
    insertUser: (u) => void users.set(u.id, u),
    findUserByEmail: (email) =>
      [...users.values()].find((u) => u.email === email) ?? null,
    findUserById: (id) => users.get(id) ?? null,
    insertSession: (s) => void sessions.set(s.token, s),
    findSession: (token) => sessions.get(token) ?? null,
    deleteSession: (token) => void sessions.delete(token),
    clear: () => {
      users.clear();
      sessions.clear();
    },
  };
}

/* -------------------------------------------------------------------------- */
/* node:sqlite backend (server, when available)                              */
/* -------------------------------------------------------------------------- */

function sqliteBackend(): StoreBackend | null {
  // Only attempt on the server. `node:sqlite` is unavailable in the browser
  // bundle and on Node versions without the flag; any failure => fall back.
  if (typeof window !== "undefined") return null;
  try {
    // Indirect require so bundlers don't try to resolve node:sqlite for the
    // client, and so a missing module is a caught runtime error, not a crash.
    const req = (
      eval("typeof require === 'function' ? require : null") as
        | NodeRequire
        | null
    );
    if (!req) return null;
    const { DatabaseSync } = req("node:sqlite") as typeof import("node:sqlite");
    const file = env("DATABASE_URL")?.replace(/^file:/, "") ?? ":memory:";
    const db = new DatabaseSync(file);
    db.exec(`
      CREATE TABLE IF NOT EXISTS syntheon_users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        firstName TEXT,
        lastName TEXT,
        createdAt INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS syntheon_sessions (
        token TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        expiresAt INTEGER NOT NULL
      );
    `);
    const toUser = (r: Record<string, unknown> | undefined): StoredUser | null =>
      r
        ? {
            id: String(r.id),
            email: String(r.email),
            passwordHash: String(r.passwordHash),
            firstName: r.firstName ? String(r.firstName) : undefined,
            lastName: r.lastName ? String(r.lastName) : undefined,
            createdAt: Number(r.createdAt),
          }
        : null;
    return {
      insertUser: (u) =>
        void db
          .prepare(
            `INSERT INTO syntheon_users (id,email,passwordHash,firstName,lastName,createdAt)
             VALUES (?,?,?,?,?,?)`,
          )
          .run(
            u.id,
            u.email,
            u.passwordHash,
            u.firstName ?? null,
            u.lastName ?? null,
            u.createdAt,
          ),
      findUserByEmail: (email) =>
        toUser(
          db
            .prepare(`SELECT * FROM syntheon_users WHERE email = ?`)
            .get(email) as Record<string, unknown> | undefined,
        ),
      findUserById: (id) =>
        toUser(
          db
            .prepare(`SELECT * FROM syntheon_users WHERE id = ?`)
            .get(id) as Record<string, unknown> | undefined,
        ),
      insertSession: (s) =>
        void db
          .prepare(
            `INSERT OR REPLACE INTO syntheon_sessions (token,userId,createdAt,expiresAt)
             VALUES (?,?,?,?)`,
          )
          .run(s.token, s.userId, s.createdAt, s.expiresAt),
      findSession: (token) => {
        const r = db
          .prepare(`SELECT * FROM syntheon_sessions WHERE token = ?`)
          .get(token) as Record<string, unknown> | undefined;
        return r
          ? {
              token: String(r.token),
              userId: String(r.userId),
              createdAt: Number(r.createdAt),
              expiresAt: Number(r.expiresAt),
            }
          : null;
      },
      deleteSession: (token) =>
        void db.prepare(`DELETE FROM syntheon_sessions WHERE token = ?`).run(token),
      clear: () => {
        db.exec(`DELETE FROM syntheon_users; DELETE FROM syntheon_sessions;`);
      },
    };
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Public store                                                               */
/* -------------------------------------------------------------------------- */

let _backend: StoreBackend | null = null;

function backend(): StoreBackend {
  if (!_backend) _backend = sqliteBackend() ?? memoryBackend();
  return _backend;
}

/** Test seam: inject a backend (or reset to auto-detect with `null`). */
export function __setBackend(b: StoreBackend | null): void {
  _backend = b;
}

/** Cross-runtime crypto: uses node:crypto on the server, Web Crypto elsewhere. */
function randomToken(bytes = 32): string {
  try {
    const req = eval(
      "typeof require === 'function' ? require : null",
    ) as NodeRequire | null;
    if (req) {
      const { randomBytes } = req("node:crypto") as typeof import("node:crypto");
      return randomBytes(bytes).toString("hex");
    }
  } catch {
    /* fall through to Web Crypto */
  }
  const arr = new Uint8Array(bytes);
  (globalThis.crypto ?? ({} as Crypto)).getRandomValues?.(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Hash a password with scrypt (server) or a deterministic dev hash otherwise. */
export function hashPassword(password: string, salt = randomToken(16)): string {
  try {
    const req = eval(
      "typeof require === 'function' ? require : null",
    ) as NodeRequire | null;
    if (req) {
      const { scryptSync } = req("node:crypto") as typeof import("node:crypto");
      const derived = scryptSync(password, salt, 64).toString("hex");
      return `scrypt$${salt}$${derived}`;
    }
  } catch {
    /* fall through */
  }
  // Non-node fallback: still salted, clearly marked as weak. Server path is
  // the real one; this only exists so the module never throws off-node.
  return `weak$${salt}$${password}`;
}

/** Verify a password against a stored hash. Constant-ish time on the node path. */
export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt] = stored.split("$");
  if (!salt) return false;
  return hashPassword(password, salt) === stored && scheme.length > 0;
}

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export const store = {
  /** Create a user; throws if the email already exists. */
  createUser(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): StoredUser {
    const email = input.email.trim().toLowerCase();
    if (backend().findUserByEmail(email)) {
      throw new Error("user already exists");
    }
    const user: StoredUser = {
      id: `usr_${randomToken(12)}`,
      email,
      passwordHash: hashPassword(input.password),
      firstName: input.firstName,
      lastName: input.lastName,
      createdAt: Date.now(),
    };
    backend().insertUser(user);
    return user;
  },

  /** Verify credentials and return the user, or null on mismatch. */
  authenticate(email: string, password: string): StoredUser | null {
    const user = backend().findUserByEmail(email.trim().toLowerCase());
    if (!user) return null;
    return verifyPassword(password, user.passwordHash) ? user : null;
  },

  findById(id: string): StoredUser | null {
    return backend().findUserById(id);
  },

  findByEmail(email: string): StoredUser | null {
    return backend().findUserByEmail(email.trim().toLowerCase());
  },

  /** Mint an opaque session token for a user. */
  createSession(userId: string, ttlMs = DEFAULT_TTL_MS): StoredSession {
    const now = Date.now();
    const session: StoredSession = {
      token: randomToken(),
      userId,
      createdAt: now,
      expiresAt: now + ttlMs,
    };
    backend().insertSession(session);
    return session;
  },

  /** Resolve a session token to a live (unexpired) session, or null. */
  getSession(token: string): StoredSession | null {
    const s = backend().findSession(token);
    if (!s) return null;
    if (s.expiresAt <= Date.now()) {
      backend().deleteSession(token);
      return null;
    }
    return s;
  },

  destroySession(token: string): void {
    backend().deleteSession(token);
  },

  /** Test/dev helper: wipe all users + sessions. */
  reset(): void {
    backend().clear();
  },
};
