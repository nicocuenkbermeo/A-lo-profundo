import { Card, CardContent } from "@/components/ui/card"
import { StreakBadge } from "./StreakBadge"
import { cn } from "@/lib/utils"

export interface TipsterData {
  id: string
  name: string
  initials: string
  streak: number
  record: string
  winPct: number
  roi: number
  profit: number
}

export function TipsterProfile({ tipster }: { tipster: TipsterData }) {
  return (
    <Card className="w-56 shrink-0">
      <CardContent className="flex flex-col items-center gap-3 pt-2">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
          {tipster.initials}
        </div>
        <div className="text-center">
          <p className="font-semibold text-sm">{tipster.name}</p>
          {tipster.streak > 0 && (
            <div className="mt-1">
              <StreakBadge count={tipster.streak} />
            </div>
          )}
        </div>
        <div className="grid w-full grid-cols-3 gap-1 text-center text-xs">
          <div>
            <p className="text-muted-foreground">Record</p>
            <p className="font-semibold">{tipster.record}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Win%</p>
            <p className={cn("font-semibold", tipster.winPct >= 55 ? "text-win" : "text-foreground")}>
              {tipster.winPct}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">ROI</p>
            <p className={cn("font-semibold", tipster.roi > 0 ? "text-win" : "text-loss")}>
              {tipster.roi > 0 ? "+" : ""}{tipster.roi}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
