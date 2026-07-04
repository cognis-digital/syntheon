"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  disabled,
  className,
}: DatePickerProps) {
  const [internal, setInternal] = React.useState<Date | undefined>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;

  function handleSelect(date: Date) {
    if (!isControlled) setInternal(date);
    onChange?.(date);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
