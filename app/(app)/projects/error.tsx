"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/blocks/empty-state";

/**
 * Route-level error boundary for the Projects feature. Next renders this when
 * the server component or an action throws, keeping the app shell intact and
 * offering a retry.
 */
export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Surface for local debugging; swap for your telemetry sink at integration.
    console.error("Projects route error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl">
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="We couldn't load your projects. This is usually transient — try again."
        action={{ label: "Try again", onClick: () => reset() }}
        secondaryAction={{ label: "Back to dashboard", href: "/dashboard" }}
      />
    </div>
  );
}
