"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  STATUS_META,
  projectFormSchema,
  type ProjectFormValues,
} from "../_data/projects-schema";
import type { ActionResult } from "../_data/projects-actions";
import type { ProjectRecord } from "../_data/projects-store";

export interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this project; otherwise it creates a new one. */
  project?: ProjectRecord | null;
  /** Submits the payload. Returns the action result so we can surface errors. */
  action: (form: FormData) => Promise<ActionResult<ProjectRecord>>;
}

const EMPTY: ProjectFormValues = {
  name: "",
  description: "",
  type: "SaaS",
  status: "draft",
};

/**
 * Create / edit dialog for a project, wired to react-hook-form + the shared zod
 * schema and a server action. Field errors returned by the server are mapped
 * back onto the form; success closes the dialog and fires a toast.
 */
export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  action,
}: ProjectFormDialogProps) {
  const isEdit = Boolean(project);
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: EMPTY,
  });

  // Reset the form to the active project (or blank) whenever the dialog opens.
  React.useEffect(() => {
    if (!open) return;
    form.reset(
      project
        ? {
            name: project.name,
            description: project.description,
            type: PROJECT_TYPES.includes(project.type as (typeof PROJECT_TYPES)[number])
              ? (project.type as (typeof PROJECT_TYPES)[number])
              : "SaaS",
            status: project.status,
          }
        : EMPTY,
    );
  }, [open, project, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const fd = new FormData();
    fd.set("name", values.name);
    fd.set("description", values.description ?? "");
    fd.set("type", values.type);
    fd.set("status", values.status);
    const result = await action(fd);
    if (result.ok) {
      toast.success(isEdit ? "Project updated" : "Project created", {
        description: result.data?.name,
      });
      onOpenChange(false);
      return;
    }
    if (result.fieldErrors) {
      for (const [key, message] of Object.entries(result.fieldErrors)) {
        form.setError(key as keyof ProjectFormValues, { message });
      }
    }
    toast.error(result.error ?? "Please fix the errors and try again.");
  });

  const pending = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={onSubmit} noValidate>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit project" : "New project"}</DialogTitle>
              <DialogDescription>
                {isEdit
                  ? "Update the details for this Syntheon project."
                  : "Describe the app you want to build with Syntheon."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Aurora Analytics" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="What does this app do?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_META[s].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Save changes" : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
