"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface RetroChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function RetroChip({ children, active = false, onClick }: RetroChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-[family-name:var(--font-display)] text-xs uppercase tracking-wider",
        "rounded-sm px-3 py-1 transition-all duration-150 cursor-pointer",
        active
          ? "bg-[#C41E3A] text-white border-2 border-[#C41E3A]"
          : "bg-transparent border-2 border-[#8B7355] text-[#8FBCE6] hover:bg-[#1A3A5C]"
      )}
    >
      {children}
    </button>
  );
}
