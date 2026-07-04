import * as React from "react";
import { FolderPlus, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/blocks/empty-state";

export interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  units: number;
  updated: string;
}

/**
 * Renders the projects grid, or the empty state when there are none. Pure
 * presentational component so both paths are directly testable.
 */
export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderPlus}
        title="No projects yet"
        description="Launch the menu-driven builder to generate your first full-stack app. Pick your features and the local model does the rest."
        action={{ label: "New project", href: "/dashboard" }}
        secondaryAction={{
          label: "Read the docs",
          href: "/docs",
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <Card key={p.id} className="group flex flex-col transition-colors hover:border-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{p.name}</CardTitle>
              <Badge variant="secondary">{p.type}</Badge>
            </div>
            <CardDescription>{p.description}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
            <span>{p.units} units</span>
            <span className="inline-flex items-center gap-1">
              Updated {p.updated}
              <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
