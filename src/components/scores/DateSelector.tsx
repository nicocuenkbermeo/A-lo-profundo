"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = new Date();
  const dates: Date[] = [];

  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }

  function shiftDays(offset: number) {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + offset);
    onDateChange(next);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => shiftDays(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
        {dates.map((date) => {
          const isToday = isSameDay(date, today);
          const isSelected = isSameDay(date, selectedDate);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={cn(
                "flex flex-col items-center px-3 py-2 rounded-lg min-w-[52px] transition-colors",
                isSelected
                  ? "bg-amber-500 text-black"
                  : isToday
                    ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                    : "text-muted-foreground hover:bg-[#1e1e2e] hover:text-foreground"
              )}
            >
              <span className="text-[10px] font-medium uppercase">
                {DAY_NAMES[date.getDay()]}
              </span>
              <span className="text-lg font-bold leading-tight">
                {date.getDate()}
              </span>
              <span className="text-[10px]">
                {MONTH_NAMES[date.getMonth()]}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => shiftDays(1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
