"use client"

import { useState } from "react"
import { PickResult } from "./PickResult"
import { cn } from "@/lib/utils"

export interface Pick {
  id: string
  tipster: { name: string; emoji: string; streak: number }
  game: { away: string; home: string; awayColor: string; homeColor: string; date: string }
  pickType: "MONEYLINE" | "RUNLINE" | "TOTAL" | "PROP"
  selection: string
  odds: string
  stake: number
  analysis: string
  result: string
  profit: number
  timestamp: string
}

export function PickCard({ pick }: { pick: Pick }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
      {/* Corner ornaments */}
      <div className="absolute top-[6px] left-[6px] w-4 h-4 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute top-[6px] right-[6px] w-4 h-4 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute bottom-[6px] left-[6px] w-4 h-4 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute bottom-[6px] right-[6px] w-4 h-4 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

      <div className="p-5 space-y-3">
        {/* Header: tipster */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0D2240] text-lg border-2 border-[#8B7355]">
            {pick.tipster.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-heading font-bold text-sm text-[#3D2B1F]">{pick.tipster.name}</span>
          </div>
          {pick.tipster.streak > 0 && (
            <span className="inline-flex items-center gap-1 font-display text-xs bg-[#C41E3A]/10 text-[#C41E3A] px-2 py-0.5 rounded-sm">
              <span>&#x1F525;</span> x{pick.tipster.streak}
            </span>
          )}
        </div>

        {/* Red stitch separator */}
        <div className="border-t-2 border-dashed border-[#C41E3A]/50" />

        {/* Game line */}
        <div className="flex items-center gap-2 text-sm">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white border border-[#8B7355]"
            style={{ backgroundColor: pick.game.awayColor }}
          >
            {pick.game.away}
          </div>
          <span className="font-display text-[#8B7355] text-xs">vs</span>
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white border border-[#8B7355]"
            style={{ backgroundColor: pick.game.homeColor }}
          >
            {pick.game.home}
          </div>
          <span className="ml-auto font-display text-xs text-[#8B7355]">{pick.game.date}</span>
        </div>

        {/* Pick details */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#0D2240] text-[#F5C842] font-display text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm">
            {pick.pickType}
          </span>
          <span className="font-sans font-bold text-sm text-[#3D2B1F]">{pick.selection}</span>
          <span className="font-mono text-xs text-[#8B7355]">({pick.odds})</span>
        </div>

        {/* Stake */}
        <div className="flex items-center gap-2">
          <span className="inline-flex gap-0.5 text-base">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < pick.stake ? "opacity-100" : "opacity-20"}>
                &#x1F525;
              </span>
            ))}
          </span>
          <span className="font-display text-xs text-[#3D2B1F]">{pick.stake} unidades</span>
        </div>

        {/* Analysis */}
        <div className="font-sans text-sm text-[#3D2B1F]/80 italic">
          <p className={cn(!expanded && "line-clamp-2")}>{pick.analysis}</p>
          {pick.analysis.length > 100 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-1 font-display text-xs text-[#C41E3A] uppercase tracking-wider hover:underline not-italic"
            >
              {expanded ? "Leer menos" : "Leer m\u00e1s"}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t-2 border-[#8B7355]/30 pt-3">
          <PickResult result={pick.result} />
          <span
            className={cn(
              "font-mono text-sm font-bold",
              pick.profit > 0 ? "text-[#2E7D32]" : pick.profit < 0 ? "text-[#C62828]" : "text-[#8B7355]"
            )}
          >
            {pick.profit > 0 ? "+" : ""}
            {pick.profit.toFixed(2)}u
          </span>
        </div>
      </div>
    </div>
  )
}
