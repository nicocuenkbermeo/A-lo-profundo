import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "default" | "lg";
}

const sizeStyles = {
  sm: "text-sm px-2 py-0.5",
  default: "text-base px-3 py-1",
  lg: "text-lg px-4 py-1.5",
};

export default function StreakBadge({ count, size = "default" }: StreakBadgeProps) {
  const intensity =
    count >= 10 ? "blazing-max" : count >= 6 ? "blazing" : count >= 3 ? "hot" : "warm";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono font-bold rounded-full",
        sizeStyles[size],
        intensity === "warm" && "text-[#F5C842] bg-[#F5C842]/10",
        intensity === "hot" && "text-[#EB6E1F] bg-[#EB6E1F]/10 shadow-[0_0_8px_rgba(235,110,31,0.3)]",
        intensity === "blazing" && "text-[#C41E3A] bg-[#C41E3A]/10 shadow-[0_0_12px_rgba(196,30,58,0.4)]",
        intensity === "blazing-max" &&
          "text-[#C41E3A] bg-[#C41E3A]/15 shadow-[0_0_16px_rgba(196,30,58,0.5)] animate-pulse ring-1 ring-[#F5C842]"
      )}
    >
      <span className={cn(intensity === "blazing-max" && "animate-bounce")}>
        🔥
      </span>
      {count}
    </span>
  );
}
