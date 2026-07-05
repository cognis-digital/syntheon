"use client";

import * as React from "react";
import { toast } from "sonner";
import { Check, Copy, FileJson, Terminal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CopyBlockProps {
  title: string;
  icon: React.ReactNode;
  code: string;
  label: string;
  className?: string;
}

function CopyBlock({ title, icon, code, label, className }: CopyBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`${title} copied`);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Clipboard unavailable — select and copy manually.");
    }
  };

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border bg-card", className)}>
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {icon}
          {title}
        </span>
        <Button size="sm" variant="ghost" onClick={copy} aria-label={label}>
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </Button>
      </div>
      <pre className="max-h-72 overflow-auto bg-[hsl(260_30%_8%)] p-4 text-xs leading-relaxed text-violet-100/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export interface ConfigPanelProps {
  configJson: string;
  runCommand: string;
  className?: string;
}

/**
 * The "take it with you" panel: the real `syntheon.config.json` for the current
 * selection and the exact commands to generate the app locally, each with a
 * one-click copy.
 */
export function ConfigPanel({ configJson, runCommand, className }: ConfigPanelProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <CopyBlock
        title="syntheon.config.json"
        label="Copy syntheon.config.json"
        icon={<FileJson className="h-3.5 w-3.5 text-primary/70" />}
        code={configJson}
      />
      <CopyBlock
        title="Run this locally"
        label="Copy the run command"
        icon={<Terminal className="h-3.5 w-3.5 text-primary/70" />}
        code={runCommand}
      />
    </div>
  );
}
