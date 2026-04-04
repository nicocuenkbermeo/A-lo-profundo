import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
    <div
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:bg-muted/30"
      style={{ borderLeftColor: team.color, borderLeftWidth: 3 }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{team.name}</span>
          <span className="text-xs text-muted-foreground">
            {team.abbreviation}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <div>
            <span className="text-xl font-bold font-mono text-foreground">
              {team.wins}-{team.losses}
            </span>
            <span className="ml-2 text-sm font-mono text-muted-foreground">
              {team.pct}
            </span>
          </div>
          <Badge variant="outline" className="text-[10px]">
            L10: {team.last10}
          </Badge>
          <Badge
            variant={isWinStreak ? "default" : "destructive"}
            className="text-[10px]"
          >
            {team.streak}
          </Badge>
        </div>
      </div>
    </div>
  )
}
