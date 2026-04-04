import { cn } from "@/lib/utils"

const resultConfig: Record<string, { label: string; className: string }> = {
  WIN: {
    label: "VICTORIA \u2713",
    className: "bg-[#2E7D32] text-white",
  },
  LOSS: {
    label: "DERROTA \u2717",
    className: "bg-[#C62828] text-white",
  },
  PUSH: {
    label: "EMPATE",
    className: "bg-[#8B7355] text-[#FDF6E3]",
  },
  PENDING: {
    label: "PENDIENTE",
    className: "bg-[#F5C842] text-[#3D2B1F] animate-pulse",
  },
  VOID: {
    label: "ANULADO",
    className: "bg-[#666] text-white",
  },
}

export function PickResult({
  result,
  size = "default",
}: {
  result: string
  size?: "sm" | "default"
}) {
  const config = resultConfig[result.toUpperCase()] ?? resultConfig.VOID

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-display uppercase tracking-wider text-xs px-3 py-1 rounded-sm",
        size === "sm" && "text-[10px] px-2 py-0.5",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
