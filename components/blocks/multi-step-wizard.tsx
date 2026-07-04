"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
}

export interface MultiStepWizardProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: WizardStep[];
  /** Controlled current step index. */
  currentStep?: number;
  defaultStep?: number;
  onStepChange?: (index: number) => void;
  onComplete?: () => void | Promise<void>;
  nextLabel?: string;
  backLabel?: string;
  finishLabel?: string;
}

export function MultiStepWizard({
  steps,
  currentStep,
  defaultStep = 0,
  onStepChange,
  onComplete,
  nextLabel = "Next",
  backLabel = "Back",
  finishLabel = "Finish",
  className,
  ...props
}: MultiStepWizardProps) {
  const [internal, setInternal] = React.useState(defaultStep);
  const [pending, setPending] = React.useState(false);
  const isControlled = currentStep !== undefined;
  const active = isControlled ? currentStep : internal;

  const setActive = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, steps.length - 1));
      if (!isControlled) setInternal(clamped);
      onStepChange?.(clamped);
    },
    [isControlled, onStepChange, steps.length],
  );

  const isLast = active === steps.length - 1;
  const progress = steps.length > 1 ? ((active + 1) / steps.length) * 100 : 100;

  async function handleNext() {
    if (isLast) {
      setPending(true);
      try {
        await onComplete?.();
      } finally {
        setPending(false);
      }
      return;
    }
    setActive(active + 1);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-3">
        <ol className="flex items-center gap-2" aria-label="Progress">
          {steps.map((step, i) => {
            const complete = i < active;
            const current = i === active;
            return (
              <li key={step.id} className="flex flex-1 items-center gap-2">
                <span
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    complete && "border-primary bg-primary text-primary-foreground",
                    current && "border-primary text-primary",
                    !complete && !current && "text-muted-foreground",
                  )}
                >
                  {complete ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "hidden text-sm sm:inline",
                    current ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
              </li>
            );
          })}
        </ol>
        <Progress value={progress} />
      </div>

      <div>
        <h3 className="text-lg font-semibold tracking-tight">{steps[active]?.title}</h3>
        {steps[active]?.description && (
          <p className="text-sm text-muted-foreground">{steps[active]?.description}</p>
        )}
        <div className="mt-4">{steps[active]?.content}</div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setActive(active - 1)}
          disabled={active === 0 || pending}
        >
          {backLabel}
        </Button>
        <Button onClick={handleNext} disabled={pending}>
          {isLast ? finishLabel : nextLabel}
        </Button>
      </div>
    </div>
  );
}
