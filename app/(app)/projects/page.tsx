import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectList, type Project } from "../_components/project-list";

export const metadata: Metadata = {
  title: "Projects — Syntheon",
};

/** Sample projects. Swap for real data from your store at integration; pass an
 * empty array to see the empty state. */
const PROJECTS: Project[] = [
  {
    id: "prj_1",
    name: "Aurora SaaS",
    description: "Marketing site + billing + dashboard for a B2B analytics product.",
    type: "SaaS",
    units: 412,
    updated: "2h ago",
  },
  {
    id: "prj_2",
    name: "Harbor Directory",
    description: "Listings directory with search, submissions, and Stripe-gated features.",
    type: "Directory",
    units: 268,
    updated: "yesterday",
  },
  {
    id: "prj_3",
    name: "Fieldnote",
    description: "Internal tool: forms, tables, and a Notion + Airtable sync.",
    type: "Internal tool",
    units: 190,
    updated: "3d ago",
  },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Every app you&apos;ve generated with Syntheon.
          </p>
        </div>
        <Button asChild>
          <a href="/dashboard">
            <Plus />
            New project
          </a>
        </Button>
      </div>

      <ProjectList projects={PROJECTS} />
    </div>
  );
}
