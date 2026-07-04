import type { Metadata } from "next";

import { listProjects } from "../_data/projects-actions";
import { ProjectsManager } from "../_components/projects-manager";

export const metadata: Metadata = {
  title: "Projects — Syntheon",
};

// Reads per-request session + store; opt out of static rendering.
export const dynamic = "force-dynamic";

/**
 * The example app's Projects feature: a real CRUD surface backed by the local
 * projects store and server actions, scoped to the signed-in user via
 * `@/lib/auth`. Renders with no env keys (the store falls back to in-memory and
 * auth falls back to a preview identity in dev).
 */
export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Every app you&apos;ve generated with Syntheon. Create, edit, and manage
          them here — each change is validated and persisted.
        </p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
