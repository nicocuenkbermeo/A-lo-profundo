import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PlayerCardProps {
  player: {
    id: string
    name: string
    team: string
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

  return (
    <Link href={`/stats/players/${player.id}`}>
      <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-amber-500/30 hover:bg-muted/30">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-500">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground truncate">
              {player.name}
            </span>
            <Badge variant="secondary" className="text-[10px] shrink-0">
              {player.position}
            </Badge>
            <span className="text-xs text-muted-foreground shrink-0">
              {player.team}
            </span>
          </div>
          <div className="mt-2 flex gap-4">
            {player.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-mono text-sm font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
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
