import { StreakBadge } from "./StreakBadge"
import { cn } from "@/lib/utils"

export interface TipsterData {
  id: string
  name: string
  emoji: string
  streak: number
  record: string
  winPct: number
  roi: number
  profit: number
}

export function TipsterProfile({ tipster }: { tipster: TipsterData }) {
  return (
    <div className="relative w-56 shrink-0 bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
      {/* Corner ornaments */}
      <div className="absolute top-[5px] left-[5px] w-3 h-3 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute top-[5px] right-[5px] w-3 h-3 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute bottom-[5px] left-[5px] w-3 h-3 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute bottom-[5px] right-[5px] w-3 h-3 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

      <div className="flex flex-col items-center gap-2 p-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-[#0D2240] text-2xl border-2 border-[#8B7355]">
          {tipster.emoji}
        </div>
        <p className="font-heading font-bold text-sm text-[#3D2B1F]">{tipster.name}</p>
        {tipster.streak > 0 && <StreakBadge count={tipster.streak} />}
        <div className="grid w-full grid-cols-3 gap-1 text-center text-xs border-t border-[#8B7355]/30 pt-2">
          <div>
            <p className="font-display text-[10px] uppercase text-[#8B7355]">W-L</p>
            <p className="font-mono font-bold text-[#3D2B1F]">{tipster.record}</p>
          </div>
          <div>
            <p className="font-display text-[10px] uppercase text-[#8B7355]">Win%</p>
            <p className={cn("font-mono font-bold", tipster.winPct >= 55 ? "text-[#2E7D32]" : "text-[#3D2B1F]")}>
              {tipster.winPct}%
            </p>
          </div>
          <div>
            <p className="font-display text-[10px] uppercase text-[#8B7355]">ROI</p>
            <p className={cn("font-mono font-bold", tipster.roi > 0 ? "text-[#2E7D32]" : "text-[#C62828]")}>
              {tipster.roi > 0 ? "+" : ""}{tipster.roi}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
