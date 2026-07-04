"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface FormModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  /** Called on submit. Return/throw controls the pending + close behaviour. */
  onSubmit?: () => void | Promise<void>;
  /** When true, closes the modal on a successful submit. Defaults to true. */
  closeOnSubmit?: boolean;
}

export function FormModal({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  closeOnSubmit = true,
}: FormModalProps) {
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await onSubmit?.();
      if (closeOnSubmit) onOpenChange?.(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="py-4">{children}</div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange?.(false)}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
