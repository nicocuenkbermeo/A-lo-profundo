import { Flame } from "lucide-react"
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
      ? "bg-red-500/20 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
      : count >= 6
        ? "bg-orange-500/20 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.2)]"
        : "bg-primary/15 text-primary"

  const sizeClasses =
    size === "lg"
      ? "gap-1.5 px-3 py-1.5 text-base"
      : size === "sm"
        ? "gap-0.5 px-1.5 py-0.5 text-[10px]"
        : "gap-1 px-2 py-1 text-xs"

  const iconSize = size === "lg" ? "size-5" : size === "sm" ? "size-3" : "size-3.5"

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold transition-all",
        intensity,
        sizeClasses
      )}
    >
      <Flame className={cn(iconSize, "fill-current")} />
      {count}
    </span>
  )
}
