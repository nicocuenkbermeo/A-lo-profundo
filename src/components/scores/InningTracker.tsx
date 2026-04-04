import { cn } from "@/lib/utils";
import type { InningHalf } from "@/types/game";

interface InningTrackerProps {
  inning: number;
  inningHalf: InningHalf;
  outs: number;
  className?: string;
}

export function InningTracker({
  inning,
  inningHalf,
  outs,
  className,
}: InningTrackerProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span className="text-base leading-none">
          {inningHalf === "TOP" ? "▲" : "▼"}
        </span>
        <span className="font-mono font-semibold text-foreground">
          {inning}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-2 rounded-full border border-amber-500/50",
              i < outs ? "bg-amber-500" : "bg-transparent"
            )}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">
          {outs} out{outs !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
