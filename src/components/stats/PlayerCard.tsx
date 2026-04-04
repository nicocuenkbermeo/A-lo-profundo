import Link from "next/link"
import { cn } from "@/lib/utils"

interface PlayerCardProps {
  player: {
    id: string
    name: string
    team: string
    teamColor?: string
    position: string
    number: number
    stats: { label: string; value: string }[]
  }
}

export function PlayerCard({ player }: PlayerCardProps) {
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  const teamColor = player.teamColor || "#0D2240"

  return (
    <Link href={`/stats/players/${player.id}`} className="block group">
      <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#5C4A32]">
        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#8B7355]/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#8B7355]/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#8B7355]/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#8B7355]/40" />

        {/* Photo area */}
        <div
          className="relative h-28 flex items-center justify-center"
          style={{ backgroundColor: teamColor }}
        >
          <span className="text-white/20 text-6xl font-[family-name:var(--font-mono)] font-bold absolute right-3 bottom-0 leading-none">
            {player.number}
          </span>
          <span className="text-white text-3xl font-[family-name:var(--font-heading)] font-bold tracking-wide relative z-10">
            {initials}
          </span>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#3D2B1F] text-sm leading-tight truncate">
              {player.name}
            </h3>
            <div
              className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-white text-[9px] font-[family-name:var(--font-display)] font-bold"
              style={{ backgroundColor: teamColor }}
            >
              {player.team.slice(0, 3)}
            </div>
          </div>

          <span className="font-[family-name:var(--font-display)] uppercase text-[10px] tracking-wider text-[#8B7355]">
            {player.position}
          </span>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-1 mt-3 pt-3 border-t border-[#8B7355]/20">
            {player.stats.slice(0, 4).map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#C41E3A]">
                  {stat.value}
                </div>
                <div className="font-[family-name:var(--font-display)] text-[9px] uppercase tracking-wider text-[#8B7355]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
