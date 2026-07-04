"use server";

import { revalidatePath } from "next/cache";

import { resolveSession, ownerIdOf } from "../_components/session";
import { projectsStore, type ProjectRecord } from "./projects-store";
import { parseProjectForm } from "./projects-schema";

/**
 * Server actions for the example app's Projects CRUD feature.
 *
 * Each action resolves the current session via `@/lib/auth`, enforces
 * ownership through the store, validates input with the shared zod schema, and
 * revalidates the projects route so the UI reflects the change. Actions return
 * a small typed result object (never throw to the client) so the form can show
 * inline errors and toasts.
 */

export interface ActionResult<T = undefined> {
  ok: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

async function currentOwner(): Promise<string> {
  const session = await resolveSession();
  return ownerIdOf(session);
}

function formToObject(form: FormData): Record<string, unknown> {
  return {
    name: form.get("name") ?? undefined,
    description: form.get("description") ?? undefined,
    type: form.get("type") ?? undefined,
    status: form.get("status") ?? undefined,
  };
}

/** List the current owner's projects (server-callable read). */
export async function listProjects(): Promise<ProjectRecord[]> {
  const ownerId = await currentOwner();
  return projectsStore.list(ownerId);
}

/** Create a project from a validated form payload. */
export async function createProject(
  form: FormData,
): Promise<ActionResult<ProjectRecord>> {
  const parsed = parseProjectForm(formToObject(form));
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.errors };
  const ownerId = await currentOwner();
  const record = projectsStore.create({ ownerId, ...parsed.values });
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { ok: true, data: record };
}

/** Update an existing project the current owner owns. */
export async function updateProject(
  id: string,
  form: FormData,
): Promise<ActionResult<ProjectRecord>> {
  const parsed = parseProjectForm(formToObject(form));
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.errors };
  const ownerId = await currentOwner();
  const record = projectsStore.update(id, ownerId, parsed.values);
  if (!record)
    return { ok: false, error: "Project not found or you don't have access." };
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { ok: true, data: record };
}

/** Delete a project the current owner owns. */
export async function deleteProject(id: string): Promise<ActionResult> {
  const ownerId = await currentOwner();
  const removed = projectsStore.remove(id, ownerId);
  if (!removed)
    return { ok: false, error: "Project not found or already deleted." };
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { ok: true };
}
