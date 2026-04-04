"use client"

import { useState } from "react"
import { StreakBadge } from "./StreakBadge"
import { cn } from "@/lib/utils"

export interface LeaderboardEntry {
  rank: number
  name: string
  emoji: string
  streak: number
  bestStreak: number
  wins: number
  losses: number
  winPct: number
  roi: number
  profit: number
}

const medals: Record<number, string> = { 1: "\ud83e\udd47", 2: "\ud83e\udd48", 3: "\ud83e\udd49" }

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
        type="button"
        onClick={() => handleSort(sKey)}
        className="inline-flex items-center gap-1 hover:text-[#F5C842] transition-colors font-display text-[10px] uppercase tracking-wider"
      >
        {label}
        <span className="text-[8px]">{sortKey === sKey ? (sortAsc ? "\u25b2" : "\u25bc") : "\u25b4\u25be"}</span>
      </button>
    )
  }

  return (
    <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#0D2240] text-[#F5C842]">
              <th className="px-3 py-3 font-display text-[10px] uppercase tracking-wider w-12">#</th>
              <th className="px-3 py-3 font-display text-[10px] uppercase tracking-wider">Tipster</th>
              <th className="px-3 py-3"><SortHeader label="Racha" sKey="streak" /></th>
              <th className="px-3 py-3 hidden sm:table-cell"><SortHeader label="Mejor" sKey="bestStreak" /></th>
              <th className="px-3 py-3 font-display text-[10px] uppercase tracking-wider">Record</th>
              <th className="px-3 py-3"><SortHeader label="Win%" sKey="winPct" /></th>
              <th className="px-3 py-3"><SortHeader label="ROI" sKey="roi" /></th>
              <th className="px-3 py-3"><SortHeader label="Profit" sKey="profit" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry) => (
              <tr
                key={entry.rank}
                className={cn(
                  "border-b border-[#8B7355]/20 text-[#3D2B1F]",
                  entry.rank === 1 && "bg-[#F5C842]/10"
                )}
              >
                <td className="px-3 py-3 font-mono font-bold text-sm">
                  {medals[entry.rank] ?? entry.rank}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0D2240] text-sm border border-[#8B7355]">
                      {entry.emoji}
                    </div>
                    <span className="font-heading font-bold text-sm">{entry.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {entry.streak > 0 ? <StreakBadge count={entry.streak} size="sm" /> : <span className="text-xs text-[#8B7355]">-</span>}
                </td>
                <td className="px-3 py-3 hidden sm:table-cell font-mono text-xs">{entry.bestStreak}</td>
                <td className="px-3 py-3 font-mono text-xs">{entry.wins}-{entry.losses}</td>
                <td className={cn("px-3 py-3 font-mono text-xs font-bold", entry.winPct >= 55 ? "text-[#2E7D32]" : "text-[#3D2B1F]")}>
                  {entry.winPct.toFixed(1)}%
                </td>
                <td className={cn("px-3 py-3 font-mono text-xs font-bold", entry.roi > 0 ? "text-[#2E7D32]" : "text-[#C62828]")}>
                  {entry.roi > 0 ? "+" : ""}{entry.roi.toFixed(1)}%
                </td>
                <td className={cn("px-3 py-3 font-mono text-xs font-bold", entry.profit > 0 ? "text-[#2E7D32]" : "text-[#C62828]")}>
                  {entry.profit > 0 ? "+" : ""}{entry.profit.toFixed(1)}u
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
