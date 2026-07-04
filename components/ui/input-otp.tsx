"use client";

// A dependency-free one-time-code input. Renders N single-character boxes backed by a
// hidden aggregate value; fully keyboard- and paste-friendly.
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputOTPProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ length = 6, value, defaultValue = "", onChange, onComplete, disabled, className, ...props }, ref) => {
    const [internal, setInternal] = React.useState(defaultValue.slice(0, length));
    const isControlled = value !== undefined;
    const current = (isControlled ? value : internal).slice(0, length);
    const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

    const setValue = React.useCallback(
      (next: string) => {
        const clamped = next.slice(0, length);
        if (!isControlled) setInternal(clamped);
        onChange?.(clamped);
        if (clamped.length === length) onComplete?.(clamped);
      },
      [isControlled, length, onChange, onComplete],
    );

    function handleChange(index: number, raw: string) {
      const char = raw.replace(/\D?/g, "").slice(-1);
      const chars = current.split("");
      chars[index] = char;
      const next = chars.join("").slice(0, length);
      setValue(next);
      if (char && index < length - 1) inputsRef.current[index + 1]?.focus();
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Backspace" && !current[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
      if (pasted) setValue(pasted);
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label="One-time code"
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            aria-label={`Digit ${i + 1}`}
            value={current[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="h-10 w-10 rounded-md border border-input bg-transparent text-center text-sm shadow-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        ))}
      </div>
    );
  },
);
InputOTP.displayName = "InputOTP";

export { InputOTP };
