"use client";

// Native accessible toggle-group (single or multiple) without @radix-ui/react-toggle-group.
import * as React from "react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

type ToggleGroupContextValue = {
  value: string[];
  toggle: (value: string) => void;
  variant?: VariantProps<typeof toggleVariants>["variant"];
  size?: VariantProps<typeof toggleVariants>["size"];
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

export interface ToggleGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof toggleVariants> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    { type = "single", value, defaultValue, onValueChange, variant, size, className, children, ...props },
    ref,
  ) => {
    const toArray = (v: string | string[] | undefined): string[] =>
      v === undefined ? [] : Array.isArray(v) ? v : [v];

    const [internal, setInternal] = React.useState<string[]>(toArray(defaultValue));
    const isControlled = value !== undefined;
    const current = isControlled ? toArray(value) : internal;

    const toggle = React.useCallback(
      (item: string) => {
        let next: string[];
        if (type === "single") {
          next = current.includes(item) ? [] : [item];
        } else {
          next = current.includes(item)
            ? current.filter((v) => v !== item)
            : [...current, item];
        }
        if (!isControlled) setInternal(next);
        onValueChange?.(type === "single" ? (next[0] ?? "") : next);
      },
      [current, isControlled, onValueChange, type],
    );

    return (
      <ToggleGroupContext.Provider value={{ value: current, toggle, variant, size }}>
        <div
          ref={ref}
          role="group"
          className={cn("flex items-center justify-center gap-1", className)}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);
ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  value: string;
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, variant, size, className, onClick, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    const on = context?.value.includes(value) ?? false;
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={on}
        data-state={on ? "on" : "off"}
        className={cn(
          toggleVariants({ variant: variant ?? context?.variant, size: size ?? context?.size }),
          className,
        )}
        onClick={(event) => {
          context?.toggle(value);
          onClick?.(event);
        }}
        {...props}
      />
    );
  },
);
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
