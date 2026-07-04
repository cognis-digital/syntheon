"use client";

import * as React from "react";
import {
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/blocks/empty-state";
import { ConfirmDialog } from "@/components/blocks/confirm-dialog";

import { STATUS_META, type ProjectStatus } from "../_data/projects-schema";
import type { ProjectRecord } from "../_data/projects-store";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../_data/projects-actions";
import { ProjectFormDialog } from "./project-form-dialog";

type StatusFilter = "all" | ProjectStatus;

/**
 * The interactive Projects surface for the example SaaS app: search + status
 * filter, a create/edit dialog, and per-row delete with confirmation — all
 * backed by real server actions against the local store. Receives the owner's
 * projects from the server and keeps a local mirror updated optimistically via
 * router refresh, so the list stays in sync without a full reload.
 */
export function ProjectsManager({
  initialProjects,
}: {
  initialProjects: ProjectRecord[];
}) {
  const [projects, setProjects] = React.useState(initialProjects);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProjectRecord | null>(null);
  const [deleting, setDeleting] = React.useState<ProjectRecord | null>(null);

  React.useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      const matchesStatus = status === "all" || p.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(project: ProjectRecord) {
    setEditing(project);
    setFormOpen(true);
  }

  // Wrap the create/update actions so the local list updates on success.
  const submitAction = React.useCallback(
    async (form: FormData) => {
      const result = editing
        ? await updateProject(editing.id, form)
        : await createProject(form);
      if (result.ok && result.data) {
        setProjects((prev) => {
          const next = prev.filter((p) => p.id !== result.data!.id);
          return [result.data!, ...next].sort(
            (a, b) => b.updatedAt - a.updatedAt,
          );
        });
      }
      return result;
    },
    [editing],
  );

  async function confirmDelete() {
    if (!deleting) return;
    const target = deleting;
    const result = await deleteProject(target.id);
    if (result.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== target.id));
      toast.success("Project deleted", { description: target.name });
    } else {
      toast.error(result.error ?? "Could not delete the project.");
    }
    setDeleting(null);
  }

  const hasProjects = projects.length > 0;
  const hasResults = filtered.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              className="pl-9"
              aria-label="Search projects"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as StatusFilter)}
          >
            <SelectTrigger className="sm:w-40" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="building">Building</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate}>
          <Plus />
          New project
        </Button>
      </div>

      {!hasProjects ? (
        <EmptyState
          icon={FolderPlus}
          title="No projects yet"
          description="Create your first project to see how Syntheon turns a menu of features into a verified, full-stack app you own."
          action={{ label: "New project", onClick: openCreate }}
          secondaryAction={{ label: "Read the docs", href: "/docs" }}
        />
      ) : !hasResults ? (
        <EmptyState
          icon={Search}
          title="No matching projects"
          description="Try a different search term or clear the status filter."
          action={{
            label: "Clear filters",
            onClick: () => {
              setQuery("");
              setStatus("all");
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const meta = STATUS_META[p.status];
            return (
              <Card
                key={p.id}
                className="group flex flex-col transition-colors hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label={`Actions for ${p.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => openEdit(p)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => setDeleting(p)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardDescription>{p.description || "No description."}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline">{p.type}</Badge>
                  <span>{p.units} units</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editing}
        action={submitAction}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
        title={`Delete ${deleting?.name ?? "project"}?`}
        description="This permanently removes the project from your workspace. This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
