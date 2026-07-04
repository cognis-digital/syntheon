"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "type"
  > {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<number>(
      defaultValue ?? min,
    );
    const current = isControlled ? (value as number) : internal;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      if (!isControlled) {
        setInternal(next);
      }
      onValueChange?.(next);
    };

    const percent = max > min ? ((current - min) / (max - min)) * 100 : 0;

    return (
      <div
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50",
          className,
        )}
      >
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute inset-y-0 left-0 bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          disabled={disabled}
          onChange={handleChange}
          className={cn(
            "absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent accent-primary",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed",
          )}
          {...props}
        />
      </div>
    );
  },
);
Slider.displayName = "Slider";

export { Slider };
