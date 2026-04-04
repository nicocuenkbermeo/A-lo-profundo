"use client";

import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  className?: string;
}

export function LiveIndicator({ className }: LiveIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#C41E3A] animate-pulse-live" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C41E3A]" />
      </span>
      <span className="text-xs font-display uppercase tracking-wider text-[#C41E3A]">
        EN VIVO
      </span>
    </div>
  );
}
