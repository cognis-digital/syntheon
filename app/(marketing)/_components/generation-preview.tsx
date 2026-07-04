"use client";

import * as React from "react";
import { Check, Terminal } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The hero centerpiece: a two-pane "menu → generated app" visual. The left
 * pane is the Syntheon TUI selecting features; the right pane is the app those
 * selections compile into. A single check sweep animates the pipeline, gated
 * entirely by `prefers-reduced-motion` (no motion, no dependency — pure CSS +
 * a small self-contained timer that respects the media query).
 */

const MENU: { label: string; value: string }[] = [
  { label: "Project type", value: "SaaS" },
  { label: "Auth", value: "Clerk + waitlist" },
  { label: "Payments", value: "Stripe Billing" },
  { label: "Scheduling", value: "Calendly" },
  { label: "Email", value: "Resend + sequences" },
  { label: "CRM", value: "HubSpot" },
  { label: "AI", value: "local Ollama" },
];

const GATES = ["typecheck", "lint", "test", "build"];

export function GenerationPreview({ className }: { className?: string }) {
  const [step, setStep] = React.useState(MENU.length); // start fully "built" (SSR-safe)

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // honor the user; leave the static, complete state

    setStep(0);
    const id = window.setInterval(() => {
      setStep((s) => (s >= MENU.length ? 0 : s + 1));
    }, 700);
    return () => window.clearInterval(id);
  }, []);

  const built = step >= MENU.length;

  return (
    <div
      className={cn(
        "grid w-full gap-4 rounded-2xl border bg-card/60 p-4 shadow-xl backdrop-blur md:grid-cols-2",
        className,
      )}
    >
      {/* Left: the builder TUI */}
      <div className="overflow-hidden rounded-xl border bg-[hsl(260_30%_8%)] font-mono text-xs text-violet-100/90 shadow-inner">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-2 inline-flex items-center gap-1.5 text-[0.7rem] text-violet-200/60">
            <Terminal className="h-3 w-3" /> npm run studio
          </span>
        </div>
        <ul className="flex flex-col gap-1.5 p-4">
          {MENU.map((item, i) => {
            const done = i < step;
            return (
              <li
                key={item.label}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-md px-2 py-1 transition-colors",
                  i === step && !built ? "bg-primary/20" : "",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-sm border",
                      done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-white/20 text-transparent",
                    )}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-violet-200/70">{item.label}</span>
                </span>
                <span className={cn(done ? "text-violet-100" : "text-violet-200/30")}>
                  {item.value}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-white/10 px-4 py-2 text-[0.7rem] text-violet-200/50">
          {built ? (
            <span className="text-green-300">
              → studio.config.json written · generating…
            </span>
          ) : (
            <span>
              selecting features&nbsp;
              <span className="animate-pulse">▌</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: the generated app + verification gates */}
      <div className="flex flex-col overflow-hidden rounded-xl border bg-background">
        <div className="flex items-center gap-2 border-b px-3 py-2 text-[0.7rem] text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          localhost:3000
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="h-3 w-24 rounded bg-gradient-to-r from-primary to-accent" />
          <div className="h-2 w-3/4 rounded bg-muted" />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex h-14 flex-col justify-between rounded-lg border bg-card p-2"
              >
                <span className="h-1.5 w-8 rounded bg-muted" />
                <span className="h-3 w-10 rounded bg-primary/30" />
              </div>
            ))}
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2">
            {GATES.map((gate, i) => {
              const passed = built || step > i + 2;
              return (
                <span
                  key={gate}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[0.7rem] transition-colors",
                    passed
                      ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
                      : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  <Check
                    className={cn("h-3 w-3", passed ? "opacity-100" : "opacity-30")}
                  />
                  {gate}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
