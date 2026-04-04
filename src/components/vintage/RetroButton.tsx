"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface RetroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "red" | "gold" | "navy" | "outline";
  size?: "sm" | "default" | "lg";
}

const variantStyles = {
  red: "bg-[#C41E3A] text-white border-2 border-[#8B0000] shadow-[2px_2px_0px_#5C4A32] hover:shadow-[3px_3px_0px_#5C4A32]",
  gold: "bg-[#F5C842] text-[#3D2B1F] border-2 border-[#D4A820] shadow-[2px_2px_0px_#5C4A32] hover:shadow-[3px_3px_0px_#5C4A32]",
  navy: "bg-[#0D2240] text-[#FDF6E3] border-2 border-[#8FBCE6] shadow-[2px_2px_0px_#5C4A32] hover:shadow-[3px_3px_0px_#5C4A32]",
  outline: "bg-transparent border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10",
};

const sizeStyles = {
  sm: "px-3 py-1 text-xs",
  default: "px-5 py-2 text-sm",
  lg: "px-7 py-3 text-base",
};

export default function RetroButton({
  children,
  variant = "red",
  size = "default",
  className,
  ...props
}: RetroButtonProps) {
  return (
    <button
      className={cn(
        "rounded-sm font-[family-name:var(--font-display)] uppercase tracking-wider",
        "transition-all duration-150 cursor-pointer",
        "hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#5C4A32]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
