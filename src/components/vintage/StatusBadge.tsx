import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "LIVE" | "FINAL" | "SCHEDULED" | "POSTPONED";
}

const statusConfig = {
  LIVE: {
    classes: "bg-[#C41E3A] text-white",
    label: "EN VIVO",
  },
  FINAL: {
    classes: "bg-[#3D2B1F] text-[#FDF6E3]",
    label: "FINAL",
  },
  SCHEDULED: {
    classes: "bg-[#0D2240] text-[#8FBCE6] border border-[#8FBCE6]",
    label: "PROGRAMADO",
  },
  POSTPONED: {
    classes: "bg-[#8B7355] text-[#FDF6E3]",
    label: "APLAZADO",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-3 py-1 rounded-sm",
        config.classes
      )}
    >
      {status === "LIVE" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
      )}
      {config.label}
    </span>
  );
}
