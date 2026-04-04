import { cn } from "@/lib/utils"

interface TeamCardProps {
  team: {
    name: string
    abbreviation: string
    wins: number
    losses: number
    pct: string
    last10: string
    streak: string
    color: string
  }
}

export function TeamCard({ team }: TeamCardProps) {
  const isWinStreak = team.streak.startsWith("W")

  return (
    <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#5C4A32]">
      {/* Corner ornaments */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#8B7355]/40" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#8B7355]/40" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#8B7355]/40" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#8B7355]/40" />

      <div className="flex items-center gap-4 p-4" style={{ borderLeft: `4px solid ${team.color}` }}>
        {/* Team badge */}
        <div
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-white text-xs font-[family-name:var(--font-display)] font-bold"
          style={{ backgroundColor: team.color }}
        >
          {team.abbreviation}
        </div>

        {/* Team name */}
        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#3D2B1F] text-sm truncate">
            {team.name}
          </h3>
        </div>

        {/* W-L record */}
        <div className="text-right shrink-0">
          <span className="font-[family-name:var(--font-mono)] text-xl font-bold text-[#0D2240]">
            {team.wins}-{team.losses}
          </span>
        </div>

        {/* PCT badge */}
        <div className="shrink-0 bg-[#F5C842] text-[#0D2240] font-[family-name:var(--font-mono)] font-bold text-xs px-2 py-1 rounded-sm">
          {team.pct}
        </div>

        {/* L10 & Streak */}
        <div className="shrink-0 flex items-center gap-2">
          <span className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-wider text-[#8B7355] bg-[#F5E6C8] px-2 py-0.5 rounded-sm">
            L10: {team.last10}
          </span>
          <span
            className={cn(
              "font-[family-name:var(--font-display)] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold",
              isWinStreak
                ? "bg-[#0D2240] text-[#F5C842]"
                : "bg-[#C41E3A] text-[#FDF6E3]"
            )}
          >
            {team.streak}
          </span>
        </div>
      </div>
    </div>
  )
}
