import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ENGINE_STAGES } from "./content";

/**
 * "How the generation engine works" — mirrors DESIGN.md §4. A horizontal
 * pipeline (planner → coder → harness → integrate) with the repair loop called
 * out. Page-specific composition; not a reusable block.
 */
export function EngineSection() {
  return (
    <section id="engine" className="w-full scroll-mt-20 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            How a small local model builds a large, correct app
          </h2>
          <p className="text-pretty text-muted-foreground">
            Not one heroic prompt — decomposition, verification, and iteration. Every unit is
            generated against a typed contract and repaired until four gates pass.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {ENGINE_STAGES.map((stage, i) => (
            <li key={stage.name} className="relative">
              <div className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold tracking-tight">{stage.name}</h3>
                </div>
                <p className="font-mono text-xs text-primary/80">{stage.role}</p>
                <p className="text-sm text-muted-foreground">{stage.detail}</p>
              </div>
              {i < ENGINE_STAGES.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className={cn(
                    "absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground/50 md:block",
                  )}
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-dashed bg-muted/40 p-5 text-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">The repair loop:</span> the harness returns
          structured errors (file, line, message); the coder regenerates. Bounded to six retries —
          on exhaustion, the unit falls back to its curated template and is flagged for review. The
          build never stays red.
        </div>
      </div>
    </section>
  );
}
