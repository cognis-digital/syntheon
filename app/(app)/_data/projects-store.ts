import "server-only";

/**
 * Projects store for the Syntheon example SaaS app.
 *
 * This is the persistence layer behind the example dashboard's CRUD feature. It
 * mirrors the pattern in `lib/auth/store.ts`: a `node:sqlite` backend when a
 * server-side SQLite handle can be opened, transparently falling back to an
 * in-process Map so the same API works in tests, in a static build, and on Node
 * versions without `node:sqlite`. Nothing here throws at import time and it
 * needs no env keys, so the example app renders and builds with zero config.
 *
 * Records are scoped by `ownerId` so each signed-in user sees only their own
 * projects; the anonymous preview user gets a seeded, read-through demo set.
 */

/** A project record owned by a single user. */
export interface ProjectRecord {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  /** Project archetype label, e.g. "SaaS" | "Directory" | "Internal tool". */
  type: string;
  /** Publish state — drives the status badge and filtering. */
  status: "draft" | "building" | "live";
  /** Count of generation units in the project (illustrative metric). */
  units: number;
  createdAt: number;
  updatedAt: number;
}

/** Fields a caller may set when creating a project. */
export interface CreateProjectInput {
  ownerId: string;
  name: string;
  description?: string;
  type?: string;
  status?: ProjectRecord["status"];
}

/** Fields a caller may change on an existing project. */
export interface UpdateProjectInput {
  name?: string;
  description?: string;
  type?: string;
  status?: ProjectRecord["status"];
  units?: number;
}

/** The backend the store persists through. */
export interface ProjectsBackend {
  insert(p: ProjectRecord): void;
  update(id: string, patch: Partial<ProjectRecord>): ProjectRecord | null;
  remove(id: string): boolean;
  findById(id: string): ProjectRecord | null;
  listByOwner(ownerId: string): ProjectRecord[];
  clear(): void;
}

/* -------------------------------------------------------------------------- */
/* In-memory backend (test / build / no-sqlite fallback)                      */
/* -------------------------------------------------------------------------- */

function memoryBackend(): ProjectsBackend {
  const rows = new Map<string, ProjectRecord>();
  return {
    insert: (p) => void rows.set(p.id, { ...p }),
    update: (id, patch) => {
      const cur = rows.get(id);
      if (!cur) return null;
      const next = { ...cur, ...patch, id: cur.id, ownerId: cur.ownerId };
      rows.set(id, next);
      return next;
    },
    remove: (id) => rows.delete(id),
    findById: (id) => (rows.has(id) ? { ...rows.get(id)! } : null),
    listByOwner: (ownerId) =>
      [...rows.values()]
        .filter((p) => p.ownerId === ownerId)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map((p) => ({ ...p })),
    clear: () => rows.clear(),
  };
}

/* -------------------------------------------------------------------------- */
/* node:sqlite backend (server, when available)                              */
/* -------------------------------------------------------------------------- */

function sqliteBackend(): ProjectsBackend | null {
  if (typeof window !== "undefined") return null;
  try {
    // Indirect require so bundlers don't try to resolve node:sqlite for the
    // client, and so a missing module is a caught runtime error, not a crash.
    const req = eval(
      "typeof require === 'function' ? require : null",
    ) as NodeRequire | null;
    if (!req) return null;
    const { DatabaseSync } = req("node:sqlite") as typeof import("node:sqlite");
    const file =
      (typeof process !== "undefined" && process.env?.DATABASE_URL
        ? process.env.DATABASE_URL.replace(/^file:/, "")
        : undefined) ?? ":memory:";
    const db = new DatabaseSync(file);
    db.exec(`
      CREATE TABLE IF NOT EXISTS syntheon_projects (
        id TEXT PRIMARY KEY,
        ownerId TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        units INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);
    const toRecord = (
      r: Record<string, unknown> | undefined,
    ): ProjectRecord | null =>
      r
        ? {
            id: String(r.id),
            ownerId: String(r.ownerId),
            name: String(r.name),
            description: String(r.description),
            type: String(r.type),
            status: String(r.status) as ProjectRecord["status"],
            units: Number(r.units),
            createdAt: Number(r.createdAt),
            updatedAt: Number(r.updatedAt),
          }
        : null;
    return {
      insert: (p) =>
        void db
          .prepare(
            `INSERT INTO syntheon_projects
             (id,ownerId,name,description,type,status,units,createdAt,updatedAt)
             VALUES (?,?,?,?,?,?,?,?,?)`,
          )
          .run(
            p.id,
            p.ownerId,
            p.name,
            p.description,
            p.type,
            p.status,
            p.units,
            p.createdAt,
            p.updatedAt,
          ),
      update: (id, patch) => {
        const cur = toRecord(
          db
            .prepare(`SELECT * FROM syntheon_projects WHERE id = ?`)
            .get(id) as Record<string, unknown> | undefined,
        );
        if (!cur) return null;
        const next = { ...cur, ...patch, id: cur.id, ownerId: cur.ownerId };
        db.prepare(
          `UPDATE syntheon_projects
           SET name=?, description=?, type=?, status=?, units=?, updatedAt=?
           WHERE id=?`,
        ).run(
          next.name,
          next.description,
          next.type,
          next.status,
          next.units,
          next.updatedAt,
          id,
        );
        return next;
      },
      remove: (id) => {
        const res = db
          .prepare(`DELETE FROM syntheon_projects WHERE id = ?`)
          .run(id);
        return Number(res.changes) > 0;
      },
      findById: (id) =>
        toRecord(
          db
            .prepare(`SELECT * FROM syntheon_projects WHERE id = ?`)
            .get(id) as Record<string, unknown> | undefined,
        ),
      listByOwner: (ownerId) =>
        (
          db
            .prepare(
              `SELECT * FROM syntheon_projects WHERE ownerId = ? ORDER BY updatedAt DESC`,
            )
            .all(ownerId) as Record<string, unknown>[]
        )
          .map(toRecord)
          .filter((p): p is ProjectRecord => p !== null),
      clear: () => void db.exec(`DELETE FROM syntheon_projects;`),
    };
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Public store                                                               */
/* -------------------------------------------------------------------------- */

let _backend: ProjectsBackend | null = null;
const _seeded = new Set<string>();

function backend(): ProjectsBackend {
  if (!_backend) _backend = sqliteBackend() ?? memoryBackend();
  return _backend;
}

/** Test seam: inject a backend (or reset to auto-detect with `null`). */
export function __setProjectsBackend(b: ProjectsBackend | null): void {
  _backend = b;
  _seeded.clear();
}

function id(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `prj_${Date.now().toString(36)}${rand}`;
}

const DEMO_PROJECTS: Omit<ProjectRecord, "ownerId" | "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Aurora Analytics",
    description:
      "Marketing site, Stripe billing, and an authenticated dashboard for a B2B analytics product.",
    type: "SaaS",
    status: "live",
    units: 412,
  },
  {
    name: "Harbor Directory",
    description:
      "A listings directory with search, submissions, and Stripe-gated premium placement.",
    type: "Directory",
    status: "building",
    units: 268,
  },
  {
    name: "Fieldnote",
    description:
      "Internal tool with forms, data tables, and a Notion + Airtable sync.",
    type: "Internal tool",
    status: "draft",
    units: 190,
  },
];

/**
 * Seed a first-time owner with a small demo set so the example dashboard has
 * something to show out of the box. Runs once per owner per process; a caller
 * who deletes everything then sees the genuine empty state.
 */
function seedOwner(ownerId: string): void {
  if (_seeded.has(ownerId)) return;
  _seeded.add(ownerId);
  const existing = backend().listByOwner(ownerId);
  if (existing.length > 0) return;
  const base = Date.now();
  DEMO_PROJECTS.forEach((p, i) => {
    backend().insert({
      ...p,
      id: id(),
      ownerId,
      createdAt: base - (i + 1) * 86_400_000,
      updatedAt: base - i * 3_600_000,
    });
  });
}

export const projectsStore = {
  /** List a user's projects, newest first. Seeds a demo set on first read. */
  list(ownerId: string): ProjectRecord[] {
    seedOwner(ownerId);
    return backend().listByOwner(ownerId);
  },

  /** Look up one project (regardless of owner). */
  find(id: string): ProjectRecord | null {
    return backend().findById(id);
  },

  /** Create a project for an owner and return the stored record. */
  create(input: CreateProjectInput): ProjectRecord {
    const now = Date.now();
    const record: ProjectRecord = {
      id: id(),
      ownerId: input.ownerId,
      name: input.name.trim(),
      description: input.description?.trim() ?? "",
      type: input.type?.trim() || "SaaS",
      status: input.status ?? "draft",
      units: 0,
      createdAt: now,
      updatedAt: now,
    };
    backend().insert(record);
    return record;
  },

  /**
   * Update a project, enforcing ownership. Returns the updated record, or null
   * if the project does not exist or is owned by someone else.
   */
  update(
    id: string,
    ownerId: string,
    patch: UpdateProjectInput,
  ): ProjectRecord | null {
    const cur = backend().findById(id);
    if (!cur || cur.ownerId !== ownerId) return null;
    const clean: Partial<ProjectRecord> = { updatedAt: Date.now() };
    if (patch.name !== undefined) clean.name = patch.name.trim();
    if (patch.description !== undefined)
      clean.description = patch.description.trim();
    if (patch.type !== undefined) clean.type = patch.type.trim();
    if (patch.status !== undefined) clean.status = patch.status;
    if (patch.units !== undefined) clean.units = patch.units;
    return backend().update(id, clean);
  },

  /** Delete a project, enforcing ownership. Returns true if a row was removed. */
  remove(id: string, ownerId: string): boolean {
    const cur = backend().findById(id);
    if (!cur || cur.ownerId !== ownerId) return false;
    return backend().remove(id);
  },

  /** Test/dev helper: wipe all projects. */
  reset(): void {
    backend().clear();
    _seeded.clear();
  },
};
