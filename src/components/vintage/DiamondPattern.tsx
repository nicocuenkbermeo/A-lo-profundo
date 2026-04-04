import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DiamondPatternProps {
  children: ReactNode;
  className?: string;
}

export default function DiamondPattern({ children, className }: DiamondPatternProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `repeating-conic-gradient(#F5C842 0% 25%, transparent 0% 50%)`,
          backgroundSize: "24px 24px",
          transform: "rotate(45deg) scale(1.5)",
          opacity: 0.03,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
