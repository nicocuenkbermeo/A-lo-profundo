"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PickResult } from "./PickResult"
import { Flame, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Pick {
  id: string
  tipster: { name: string; initials: string; streak: number }
  game: { away: string; home: string; date: string }
  pickType: "MONEYLINE" | "RUNLINE" | "TOTAL" | "PROP"
  selection: string
  odds: string
  stake: number
  analysis: string
  result: string
  profit: number
  timestamp: string
}

function StakeFlames({ stake }: { stake: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Flame
          key={i}
          className={cn(
            "size-3.5",
            i < stake ? "fill-primary text-primary" : "text-muted-foreground/30"
          )}
        />
      ))}
    </span>
  )
}

export function PickCard({ pick }: { pick: Pick }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="transition-colors hover:ring-primary/20">
      <CardContent className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            {pick.tipster.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">{pick.tipster.name}</span>
              {pick.tipster.streak > 0 && (
                <span className="inline-flex items-center gap-0.5 text-xs text-primary font-medium">
                  <Flame className="size-3 fill-primary text-primary" />
                  {pick.tipster.streak}
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{pick.timestamp}</span>
        </div>

        {/* Game info */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-semibold">
            {pick.game.away} vs {pick.game.home}
          </span>
          <span className="text-xs text-muted-foreground">{pick.game.date}</span>
        </div>

        {/* Pick details */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="bg-blue-500/15 text-blue-400 border-blue-500/20 text-[11px]">
            {pick.pickType}
          </Badge>
          <span className="font-semibold text-sm">{pick.selection}</span>
          <span className="font-mono text-xs text-muted-foreground">({pick.odds})</span>
        </div>

        {/* Stake */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Stake:</span>
          <StakeFlames stake={pick.stake} />
        </div>

        {/* Analysis */}
        <div className="text-sm text-muted-foreground">
          <p className={cn(!expanded && "line-clamp-2")}>{pick.analysis}</p>
          {pick.analysis.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              {expanded ? (
                <>
                  Ver menos <ChevronUp className="size-3" />
                </>
              ) : (
                <>
                  Ver mas <ChevronDown className="size-3" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <PickResult result={pick.result} />
          <span
            className={cn(
              "font-mono text-sm font-semibold",
              pick.profit > 0 ? "text-win" : pick.profit < 0 ? "text-loss" : "text-muted-foreground"
            )}
          >
            {pick.profit > 0 ? "+" : ""}
            {pick.profit.toFixed(2)}u
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
