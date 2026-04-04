import { cn } from "@/lib/utils"

const resultConfig: Record<string, { label: string; className: string }> = {
  WIN: {
    label: "WIN",
    className: "bg-win/20 text-win border-win/30",
  },
  LOSS: {
    label: "LOSS",
    className: "bg-loss/20 text-loss border-loss/30",
  },
  PUSH: {
    label: "PUSH",
    className: "bg-push/20 text-push border-push/30",
  },
  PENDING: {
    label: "PENDIENTE",
    className: "bg-pending/20 text-pending border-pending/30 animate-pulse",
  },
  VOID: {
    label: "VOID",
    className: "bg-muted text-muted-foreground border-border",
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
        "inline-flex items-center justify-center rounded-md border font-mono font-semibold uppercase tracking-wider",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        config.className
      )}
    >
      {size === "sm" && (result.toUpperCase() === "WIN" || result.toUpperCase() === "LOSS")
        ? result.toUpperCase()[0]
        : config.label}
    </span>
  )
}
