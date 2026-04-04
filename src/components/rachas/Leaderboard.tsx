"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StreakBadge } from "./StreakBadge"
import { Crown, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LeaderboardEntry {
  rank: number
  name: string
  initials: string
  streak: number
  bestStreak: number
  wins: number
  losses: number
  winPct: number
  roi: number
  profit: number
}

const borderColors: Record<number, string> = {
  1: "border-l-2 border-l-yellow-500",
  2: "border-l-2 border-l-gray-400",
  3: "border-l-2 border-l-amber-700",
}

type SortKey = "rank" | "streak" | "bestStreak" | "winPct" | "roi" | "profit"

export function Leaderboard({ data }: { data: LeaderboardEntry[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("rank")
  const [sortAsc, setSortAsc] = useState(true)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(key === "rank")
    }
  }

  const sorted = [...data].sort((a, b) => {
    const diff = (a[sortKey] as number) - (b[sortKey] as number)
    return sortAsc ? diff : -diff
  })

  function SortHeader({ label, sKey }: { label: string; sKey: SortKey }) {
    return (
      <button
        onClick={() => handleSort(sKey)}
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {label}
        <ArrowUpDown className="size-3" />
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Tipster</TableHead>
              <TableHead><SortHeader label="Racha" sKey="streak" /></TableHead>
              <TableHead className="hidden sm:table-cell"><SortHeader label="Mejor" sKey="bestStreak" /></TableHead>
              <TableHead>Record</TableHead>
              <TableHead><SortHeader label="Win%" sKey="winPct" /></TableHead>
              <TableHead><SortHeader label="ROI%" sKey="roi" /></TableHead>
              <TableHead><SortHeader label="Profit" sKey="profit" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((entry) => (
              <TableRow key={entry.rank} className={cn(borderColors[entry.rank])}>
                <TableCell className="font-mono font-bold text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {entry.rank === 1 && <Crown className="size-3.5 text-yellow-500" />}
                    {entry.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      {entry.initials}
                    </div>
                    <span className="font-medium text-sm">{entry.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {entry.streak > 0 ? <StreakBadge count={entry.streak} size="sm" /> : <span className="text-xs text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="hidden sm:table-cell font-mono text-xs">{entry.bestStreak}</TableCell>
                <TableCell className="font-mono text-xs">{entry.wins}-{entry.losses}</TableCell>
                <TableCell className={cn("font-mono text-xs font-medium", entry.winPct >= 55 ? "text-win" : "text-foreground")}>
                  {entry.winPct.toFixed(1)}%
                </TableCell>
                <TableCell className={cn("font-mono text-xs font-medium", entry.roi > 0 ? "text-win" : "text-loss")}>
                  {entry.roi > 0 ? "+" : ""}{entry.roi.toFixed(1)}%
                </TableCell>
                <TableCell className={cn("font-mono text-xs font-medium", entry.profit > 0 ? "text-win" : "text-loss")}>
                  {entry.profit > 0 ? "+" : ""}{entry.profit.toFixed(1)}u
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
