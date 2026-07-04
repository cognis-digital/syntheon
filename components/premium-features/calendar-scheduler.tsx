'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, X, Clock, Trash2, Check, AlertCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'meeting' | 'reminder' | 'deadline' | 'personal';
  color?: string;
}

interface CalendarSchedulerProps {
  initialDate?: Date;
  selectedDates?: Set<string>;
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => Promise<void> | void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
}

const EVENT_COLORS = {
  meeting: 'bg-blue-500/10 text-blue-600 border-blue-200',
  reminder: 'bg-orange-500/10 text-orange-600 border-orange-200',
  deadline: 'bg-red-500/10 text-red-600 border-red-200',
  personal: 'bg-violet-500/10 text-violet-600 border-violet-200',
};

const EVENT_COLORS_DARK = {
  meeting: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  reminder: 'bg-orange-400/20 text-orange-300 border-orange-400/30',
  deadline: 'bg-red-400/20 text-red-300 border-red-400/30',
  personal: 'bg-violet-400/20 text-violet-300 border-violet-400/30',
};

const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getWeekStartDay = (): number => new Date().getDay();

export interface CalendarSchedulerProps extends CalendarSchedulerProps {}

export default function CalendarScheduler({
  initialDate = new Date(),
  selectedDates = new Set<string>(),
  events: initialEvents = [],
  onDateSelect,
  onEventCreate,
  onEventDelete,
  className = '',
}: CalendarSchedulerProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [selectedDatesState, setSelectedDatesState] = useState(selectedDates);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  useEffect(() => {
    if (onDateSelect) {
      onDateSelect(new Date(currentYear, currentMonth));
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    setSelectedDatesState(selectedDates);
  }, [selectedDates]);

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startOffset = getWeekStartDay();
  const prevMonthDays = 42 - (startOffset + daysInMonth.length) % 7;

  const handleDateClick = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    if (selectedDatesState.has(key)) {
      setSelectedDatesState(new Set(selectedDatesState).delete(key));
    } else {
      setSelectedDatesState(new Set(selectedDatesState).add(key));
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth((m) => (m === 0 ? 11 : m - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const selectedDateCount = selectedDatesState.size;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground font-semibold text-lg">
              {monthName} {currentYear}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              Select dates to schedule events. {selectedDateCount} selected.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className={`h-9 px-3 text-sm rounded-md border border-border bg-background hover:bg-muted transition-colors ${buttonVariants({ variant: 'ghost' })}`}
            >
              Today
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className={`h-9 w-9 flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted transition-colors ${buttonVariants({ variant: 'ghost' })}`}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={handleNextMonth}
                className={`h-9 w-9 flex items-center justify-center rounded-md border border-border bg-background hover:bg-muted transition-colors ${buttonVariants({ variant: 'ghost' })}`}
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Previous month padding days */}
          {Array.from({ length: prevMonthDays }).map((_, i) => (
            <motion.div
              key={`prev-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="h-24 bg-muted/20 rounded-md border border-border/50"
            />
          ))}

          {/* Current month days */}
          {daysInMonth.map((date, index) => {
            const isSelected = selectedDatesState.has(date.toISOString().split('T')[0]);
            const isToday = date.getDate() === new Date().getDate() &&
                          date.getMonth() === new Date().getMonth() &&
                          date.getFullYear() === new Date().getFullYear();

            return (
              <motion.button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`h-24 p-2 rounded-lg border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-primary/10 border-primary ring-2 ring-primary/30'
                    : isToday
                      ? 'bg-background border-primary/50 shadow-sm'
                      : 'bg-background border-border hover:bg-muted/40'
                }`}
              >
                <span className={`text-sm font-medium ${isToday ? 'font-bold text-foreground' : 'text-foreground'}`}>
                  {date.getDate()}
                </span>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute inset-0 bg-primary/5 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Events preview */}
                {events.filter(e => {
                  const day = new Date(currentYear, currentMonth, date.getDate());
                  return e.startTime.toDateString() === day.toDateString();
                }).slice(0, 3).map((event) => (
                  <motion.div
                    key={event.id}
                    layoutId={`event-${event.id}`}
                    className="absolute bottom-1 left-2 right-2 py-1 px-2 rounded text-xs truncate pointer-events-none"
                    initial={{ y: 0 }}
                    animate={{ y: isSelected ? -4 : 0 }}
                  >
                    <span className={`inline-block w-2 h-2 mr-1 rounded-full ${EVENT_COLORS[event.type] || EVENT_COLORS.personal}`}></span>
                    <span className="truncate">{event.title}</span>
                  </motion.div>
                ))}

                {/* More indicator */}
                {events.filter(e => {
                  const day = new Date(currentYear, currentMonth, date.getDate());
                  return e.startTime.toDateString() === day.toDateString();
                }).length > 3 && (
                  <div className="absolute bottom-1 right-2">
                    <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center text-xs rounded-full bg-background border-border">
                      +{events.filter(e => {
                        const day = new Date(currentYear, currentMonth, date.getDate());
                        return e.startTime.toDateString() === day.toDateString();
                      }).length - 3}
                    </Badge>
                  </div>
                )}

                {/* Hover overlay */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-primary/5 pointer-events-none flex items-center justify-center"
                    >
                      <Plus className="w-6 h-6 text-primary rotate-45" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* Next month padding days */}
          {Array.from({ length: 7 - (prevMonthDays + daysInMonth.length) % 7 }).map((_, i) => (
            <motion.div
              key={`next-${i}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: prevMonthDays + daysInMonth.length * 0.03 + i * 0.03 }}
              className="h-24 bg-muted/20 rounded-md border border-border/50"
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 py-3 border-t border-border">
          {Object.entries(EVENT_COLORS).map(([type, styles]) => (
            <div key={type} className="flex items-center gap-2 text-xs">
              <span className={`w-3 h-3 rounded-full ${styles}`}></span>
              <span className="text-muted-foreground capitalize">{type}</span>
            </div>
          ))}
        </div>

        {/* Selected dates summary */}
        {selectedDateCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-muted/50 rounded-lg border border-border flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {selectedDateCount === 1 ? '1 date selected' : `${selectedDateCount} dates selected`}
            </span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
