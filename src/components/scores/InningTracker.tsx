import { cn } from "@/lib/utils";
import type { InningHalf } from "@/types/game";

interface InningTrackerProps {
  inning: number;
  inningHalf: InningHalf;
  outs: number;
  className?: string;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function InningTracker({
  inning,
  inningHalf,
  outs,
  className,
}: InningTrackerProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Inning display */}
      <div className="flex items-center gap-1.5 font-display text-sm text-[#F5C842]">
        <span className="text-base leading-none">
          {inningHalf === "TOP" ? "▲" : "▼"}
        </span>
        <span className="tracking-wide">
          {ordinal(inning)}
        </span>
      </div>

      {/* Outs as diamonds */}
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="text-sm leading-none"
            style={{ color: "#F5C842" }}
          >
            {i < outs ? "◆" : "◇"}
          </span>
        ))}
      </div>
    </div>
  );
}
