"use client";

import * as React from "react";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

type RadioGroupContextValue = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  name: string;
  registerItem: (value: string) => void;
  unregisterItem: (value: string) => void;
  getOrderedValues: () => string[];
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled,
      name,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<
      string | undefined
    >(defaultValue);
    const value = isControlled ? valueProp : uncontrolledValue;

    const generatedName = React.useId();
    const groupName = name ?? generatedName;

    // Preserve DOM order of registered items for roving/arrow navigation.
    const itemsRef = React.useRef<string[]>([]);

    const registerItem = React.useCallback((itemValue: string) => {
      if (!itemsRef.current.includes(itemValue)) {
        itemsRef.current.push(itemValue);
      }
    }, []);

    const unregisterItem = React.useCallback((itemValue: string) => {
      itemsRef.current = itemsRef.current.filter((v) => v !== itemValue);
    }, []);

    const getOrderedValues = React.useCallback(
      () => itemsRef.current.slice(),
      [],
    );

    const handleValueChange = React.useCallback(
      (next: string) => {
        if (!isControlled) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const contextValue = React.useMemo<RadioGroupContextValue>(
      () => ({
        value,
        onValueChange: handleValueChange,
        disabled,
        name: groupName,
        registerItem,
        unregisterItem,
        getOrderedValues,
      }),
      [
        value,
        handleValueChange,
        disabled,
        groupName,
        registerItem,
        unregisterItem,
        getOrderedValues,
      ],
    );

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="radiogroup"
          className={cn("grid gap-2", className)}
          {...props}
        />
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, value, disabled, onClick, onKeyDown, id, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }

    const {
      value: selectedValue,
      onValueChange,
      disabled: groupDisabled,
      registerItem,
      unregisterItem,
      getOrderedValues,
    } = context;

    const isDisabled = disabled || groupDisabled;
    const checked = selectedValue === value;

    const innerRef = React.useRef<HTMLButtonElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node;
        }
      },
      [ref],
    );

    React.useEffect(() => {
      registerItem(value);
      return () => unregisterItem(value);
    }, [value, registerItem, unregisterItem]);

    // Roving tabindex: focusable if selected, or if nothing selected and this is
    // the first registered item.
    const orderedValues = getOrderedValues();
    const noSelection = selectedValue === undefined || selectedValue === "";
    const isFirst = orderedValues[0] === value;
    const tabIndex = isDisabled
      ? -1
      : checked || (noSelection && isFirst)
        ? 0
        : -1;

    const focusByOffset = (offset: number) => {
      const values = getOrderedValues();
      const currentIndex = values.indexOf(value);
      if (currentIndex === -1 || values.length === 0) return;
      const nextIndex =
        (currentIndex + offset + values.length) % values.length;
      const nextValue = values[nextIndex];
      onValueChange(nextValue);
      // Move focus to the newly selected item.
      requestAnimationFrame(() => {
        const el = innerRef.current?.parentElement?.querySelector<HTMLButtonElement>(
          `[data-radix-radio-value="${CSS.escape(nextValue)}"]`,
        );
        el?.focus();
      });
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || isDisabled) return;
      onValueChange(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isDisabled) return;

      switch (event.key) {
        case " ":
        case "Enter":
          event.preventDefault();
          onValueChange(value);
          break;
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          focusByOffset(1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          event.preventDefault();
          focusByOffset(-1);
          break;
        default:
          break;
      }
    };

    return (
      <button
        ref={setRefs}
        type="button"
        role="radio"
        id={id}
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        data-radix-radio-value={value}
        disabled={isDisabled}
        tabIndex={tabIndex}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {checked ? (
          <span className="flex items-center justify-center">
            <Circle className="h-3.5 w-3.5 fill-primary" />
          </span>
        ) : null}
      </button>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
