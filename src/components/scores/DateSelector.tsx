"use client";

import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
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
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] rounded-sm shadow-[4px_4px_0px_#5C4A32] p-3">
      <div className="flex items-center gap-2">
        {/* Left arrow */}
        <button
          onClick={() => shiftDays(-1)}
          className="shrink-0 flex items-center justify-center h-10 w-10 bg-[#0D2240] border-2 border-[#8B7355] text-[#F5C842] font-display text-lg rounded-sm hover:bg-[#1a3a5c] transition-colors"
        >
          &#9664;
        </button>

        {/* Scrollable dates */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 flex-1">
          {dates.map((date) => {
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selectedDate);

            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateChange(date)}
                className={cn(
                  "flex flex-col items-center px-3 py-2 min-w-[56px] rounded-sm border-2 transition-all",
                  isSelected
                    ? "bg-[#C41E3A] text-white border-[#8B0000] shadow-[2px_2px_0px_#5C4A32]"
                    : isToday
                      ? "bg-[#0D2240] text-[#F5C842] border-[#8B7355] hover:bg-[#1a3a5c]"
                      : "bg-[#0D2240] text-[#8FBCE6] border-[#8B7355] hover:bg-[#1a3a5c] hover:text-[#F5C842]"
                )}
              >
                <span className="font-display text-[10px] uppercase tracking-wider">
                  {DAY_NAMES[date.getDay()]}
                </span>
                <span className="font-mono text-lg font-bold leading-tight">
                  {date.getDate()}
                </span>
                <span className="font-display text-[10px] uppercase">
                  {MONTH_NAMES[date.getMonth()]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => shiftDays(1)}
          className="shrink-0 flex items-center justify-center h-10 w-10 bg-[#0D2240] border-2 border-[#8B7355] text-[#F5C842] font-display text-lg rounded-sm hover:bg-[#1a3a5c] transition-colors"
        >
          &#9654;
        </button>
      </div>
    </div>
  );
}
