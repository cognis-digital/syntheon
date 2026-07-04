"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  defaultMonth?: Date;
  className?: string;
}

function Calendar({
  selected,
  onSelect,
  month,
  defaultMonth,
  className,
}: CalendarProps) {
  const isControlled = month !== undefined;
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    () => startOfMonth(defaultMonth ?? selected ?? new Date()),
  );
  const currentMonth = isControlled
    ? startOfMonth(month as Date)
    : internalMonth;

  const goToMonth = (next: Date) => {
    if (!isControlled) {
      setInternalMonth(startOfMonth(next));
    }
  };

  const days = React.useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(currentMonth));
    const gridEnd = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  const today = new Date();

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between pb-4">
        <button
          type="button"
          aria-label="Go to previous month"
          onClick={() => goToMonth(addMonths(currentMonth, -1))}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium" aria-live="polite">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          type="button"
          aria-label="Go to next month"
          onClick={() => goToMonth(addMonths(currentMonth, 1))}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        role="grid"
        className="grid grid-cols-7 gap-1"
        aria-label={format(currentMonth, "MMMM yyyy")}
      >
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            role="columnheader"
            className="text-center text-[0.8rem] font-normal text-muted-foreground"
          >
            {wd}
          </div>
        ))}

        {days.map((day) => {
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isToday = isSameDay(day, today);
          const outside = !isSameMonth(day, currentMonth);

          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              aria-label={format(day, "PPPP")}
              aria-selected={isSelected}
              onClick={() => onSelect?.(day)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md p-0 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                !isSelected && isToday && "bg-accent text-accent-foreground",
                outside && "text-muted-foreground opacity-50",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
