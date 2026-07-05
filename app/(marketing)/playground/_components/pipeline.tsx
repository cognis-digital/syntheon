"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleDashed, Loader2, Play, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  GREEN_INDEX,
  SIMULATION_STEPS,
  statusAt,
  VERIFY_GATES,
  type VerifyGate,
} from "@/lib/playground/simulation";

const GATE_LABEL: Record<VerifyGate, string> = {
  typecheck: "tsc",
  lint: "lint",
  test: "test",
  build: "build",
};

export interface PipelineProps {
  /** File count for the header (from the resolved plan). */
  fileCount: number;
  className?: string;
}

/**
 * The generation simulation: PLAN → GENERATE → VERIFY → GREEN with a satisfying
 * progress + checkmark animation. Timings are illustrative (labelled "preview")
 * — the *stages and gates* are exactly what the real harness runs. Fully
 * client-side; no backend. Honors prefers-reduced-motion (jumps straight to the
 * green end-state and disables the auto-runner).
 */
export function Pipeline({ fileCount, className }: PipelineProps) {
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [running, setRunning] = React.useState(false);

  // Kick off automatically once (unless reduced motion), and loop gently.
  React.useEffect(() => {
    if (reduce) {
      setStep(GREEN_INDEX);
      return;
    }
    setRunning(true);
  }, [reduce]);

  React.useEffect(() => {
    if (!running || reduce) return;
    const current = SIMULATION_STEPS[Math.min(step, GREEN_INDEX)];
    const id = window.setTimeout(() => {
      setStep((s) => {
        if (s >= GREEN_INDEX) {
          setRunning(false);
          return s;
        }
        return s + 1;
      });
    }, current.ms);
    return () => window.clearTimeout(id);
  }, [running, step, reduce]);

  const status = statusAt(step);

  const start = () => {
    setStep(0);
    setRunning(true);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CircleDashed className="h-3.5 w-3.5 text-primary/70" aria-hidden />
          Generation pipeline
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] text-muted-foreground">
          preview
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={status.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Generation progress"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={false}
              animate={{ width: `${status.percent}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.4 }}
            />
          </div>
          <span className="w-10 text-right font-mono text-xs tabular-nums text-muted-foreground">
            {status.percent}%
          </span>
        </div>

        {/* Active step / status line */}
        <div className="flex min-h-[1.5rem] items-center gap-2 text-sm">
          {status.done ? (
            <>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                All gates green — {fileCount} files verified
              </span>
            </>
          ) : (
            <AnimatePresence mode="wait">
              <motion.span
                key={status.activeLabel}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="font-mono text-xs">{status.activeLabel}</span>
              </motion.span>
            </AnimatePresence>
          )}
        </div>

        {/* Verify gates */}
        <div className="grid grid-cols-4 gap-2">
          {VERIFY_GATES.map((gate) => {
            const passed = status.gates[gate];
            return (
              <div
                key={gate}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-center transition-colors",
                  passed
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-border bg-muted/40",
                )}
              >
                <motion.span
                  initial={false}
                  animate={
                    reduce || !passed ? { scale: 1 } : { scale: [1, 1.25, 1] }
                  }
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full",
                    passed
                      ? "bg-green-500 text-white"
                      : "bg-muted-foreground/20 text-muted-foreground",
                  )}
                >
                  <Check className="h-3 w-3" />
                </motion.span>
                <span
                  className={cn(
                    "font-mono text-[0.7rem]",
                    passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground",
                  )}
                >
                  {GATE_LABEL[gate]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] text-muted-foreground">
            Simulated timing — real runs vary with your model.
          </span>
          <Button
            size="sm"
            variant={status.done ? "outline" : "secondary"}
            onClick={start}
            disabled={running}
          >
            {status.done ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Replay
              </>
            ) : running ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Building
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Run
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
