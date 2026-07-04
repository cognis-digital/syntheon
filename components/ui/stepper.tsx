import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
  description?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepperStep[];
  /** Zero-based index of the current step. */
  currentStep: number;
  orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  ({ steps, currentStep, orientation = "horizontal", className, ...props }, ref) => (
    <ol
      ref={ref}
      aria-label="Progress"
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row items-center gap-2" : "flex-col gap-4",
        className,
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const complete = i < currentStep;
        const current = i === currentStep;
        return (
          <li
            key={i}
            aria-current={current ? "step" : undefined}
            className={cn(
              "flex items-center gap-2",
              orientation === "horizontal" && "flex-1",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                complete && "border-primary bg-primary text-primary-foreground",
                current && "border-primary text-primary",
                !complete && !current && "border-border text-muted-foreground",
              )}
            >
              {complete ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-sm font-medium",
                  current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="truncate text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  ),
);
Stepper.displayName = "Stepper";

export { Stepper };
