import { cn } from "@/lib/utils"

export function StreakBadge({
  count,
  size = "default",
}: {
  count: number
  size?: "sm" | "default" | "lg"
}) {
  if (count <= 0) return null

  const intensity =
    count >= 10
      ? "bg-[#C41E3A]/20 text-[#C41E3A] shadow-[0_0_12px_rgba(196,30,58,0.3)]"
      : count >= 6
        ? "bg-[#F5C842]/20 text-[#F5C842] shadow-[0_0_8px_rgba(245,200,66,0.2)]"
        : "bg-[#8B7355]/20 text-[#F5C842]"

  const sizeClasses =
    size === "lg"
      ? "gap-1.5 px-3 py-1.5 text-base"
      : size === "sm"
        ? "gap-0.5 px-1.5 py-0.5 text-[10px]"
        : "gap-1 px-2 py-1 text-xs"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm font-display font-bold uppercase tracking-wider transition-all border border-[#8B7355]/30",
        intensity,
        sizeClasses
      )}
    >
      &#x1F525; x{count}
    </span>
  )
}
