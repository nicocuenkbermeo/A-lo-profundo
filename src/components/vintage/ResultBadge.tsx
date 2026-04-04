import { cn } from "@/lib/utils";

interface ResultBadgeProps {
  result: "WIN" | "LOSS" | "PUSH" | "PENDING" | "VOID";
}

const resultConfig = {
  WIN: { classes: "bg-[#2E7D32] text-white", label: "VICTORIA \u2713" },
  LOSS: { classes: "bg-[#C62828] text-white", label: "DERROTA \u2717" },
  PUSH: { classes: "bg-[#8B7355] text-[#FDF6E3]", label: "EMPATE" },
  PENDING: { classes: "bg-[#F5C842] text-[#3D2B1F] animate-pulse", label: "PENDIENTE" },
  VOID: { classes: "bg-[#666] text-white", label: "ANULADO" },
};

export default function ResultBadge({ result }: ResultBadgeProps) {
  const config = resultConfig[result];

  return (
    <span
      className={cn(
        "inline-flex items-center font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-3 py-1 rounded-sm",
        config.classes
      )}
    >
      {config.label}
    </span>
  );
}
