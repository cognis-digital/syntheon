"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface NewsletterFormProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  heading?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  buttonLabel?: string;
  /** Called with the entered email on submit. May be async. */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Message shown after a successful submit. */
  successMessage?: string;
  layout?: "inline" | "stacked";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function NewsletterForm({
  heading,
  description,
  placeholder = "you@example.com",
  buttonLabel = "Join the waitlist",
  onSubmit,
  successMessage = "You're on the list. Check your inbox.",
  layout = "inline",
  className,
  ...props
}: NewsletterFormProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      await onSubmit?.(email);
      setStatus("success");
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {heading && <h3 className="text-2xl font-bold tracking-tight">{heading}</h3>}
      {description && <p className="text-muted-foreground">{description}</p>}
      {status === "success" ? (
        <p role="status" className="text-sm font-medium text-primary">
          {successMessage}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex gap-2",
            layout === "stacked" ? "flex-col" : "flex-col sm:flex-row",
          )}
          noValidate
        >
          <div className="flex-1">
            <Label htmlFor="newsletter-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              aria-invalid={status === "error"}
              disabled={status === "loading"}
            />
          </div>
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" && <Loader2 className="animate-spin" />}
            {buttonLabel}
          </Button>
        </form>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
