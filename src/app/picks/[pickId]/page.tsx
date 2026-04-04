import type { Metadata } from "next"
import Link from "next/link"
import { PickResult } from "@/components/picks/PickResult"
import { cn } from "@/lib/utils"

const mockPick = {
  id: "1",
  tipster: { name: "El Profeta", emoji: "\u26be", streak: 8, record: "52-18", winPct: 74.3, roi: 22.1 },
  game: {
    away: "NYY", home: "BOS", date: "Abr 4, 2026", time: "7:05 PM ET",
    awayFull: "New York Yankees", homeFull: "Boston Red Sox",
    awayColor: "#003087", homeColor: "#BD3039",
    awayPitcher: "Gerrit Cole (5-1, 1.89 ERA)",
    homePitcher: "Nick Pivetta (2-3, 4.12 ERA)",
  },
  pickType: "MONEYLINE" as const,
  selection: "Yankees ML",
  odds: "-135",
  stake: 4,
  analysis: "Los Yankees llegan con Gerrit Cole en la loma, quien tiene un ERA de 2.15 en sus ultimas 5 salidas contra Boston. Los Red Sox alinean a un bullpen cansado tras la serie con Toronto. Espero que Cole domine las primeras 6 entradas y el bullpen cierre sin problemas.\n\nFactores clave:\n- Cole tiene 38 K y solo 5 BB en sus ultimas 30 IP contra Boston\n- El bullpen de los Red Sox ha permitido un ERA de 5.20 en la ultima semana\n- Los Yankees han ganado 8 de sus ultimos 10 enfrentamientos en Fenway\n- El lineup de New York batea .290 colectivamente contra zurdos del bullpen de Boston\n\nRiesgo principal: El factor Fenway siempre es impredecible, pero la ventaja en pitcheo es demasiado grande para ignorar.",
  result: "WIN",
  profit: 2.96,
  timestamp: "Hace 2h",
}

const relatedPicks = [
  { id: "r1", tipster: "BatFlip King", selection: "Over 8.5", odds: "+100", result: "LOSS", pickType: "TOTAL" },
  { id: "r2", tipster: "La M\u00e1quina", selection: "Red Sox +1.5", odds: "-130", result: "WIN", pickType: "RUNLINE" },
  { id: "r3", tipster: "El Zurdo", selection: "Judge 1+ HR", odds: "+250", result: "WIN", pickType: "PROP" },
]

export async function generateMetadata({ params }: { params: Promise<{ pickId: string }> }): Promise<Metadata> {
  const { pickId } = await params
  return {
    title: `Pick #${pickId} - ${mockPick.selection}`,
    description: `${mockPick.tipster.name}: ${mockPick.selection} (${mockPick.odds})`,
  }
}

export default async function PickDetailPage({ params }: { params: Promise<{ pickId: string }> }) {
  await params

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-[#8B7355]">
        <Link href="/picks" className="hover:text-[#F5C842] transition-colors">Picks</Link>
        <span className="text-[#8B7355]/50">&gt;</span>
        <span className="text-[#FDF6E3]">{mockPick.selection}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main pick card - large */}
        <div className="lg:col-span-2">
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
            <div className="absolute top-[6px] left-[6px] w-5 h-5 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
            <div className="absolute top-[6px] right-[6px] w-5 h-5 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
            <div className="absolute bottom-[6px] left-[6px] w-5 h-5 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
            <div className="absolute bottom-[6px] right-[6px] w-5 h-5 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#0D2240] text-xl border-2 border-[#8B7355]">
                    {mockPick.tipster.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-[#3D2B1F]">{mockPick.tipster.name}</span>
                      <span className="inline-flex items-center gap-1 font-display text-xs bg-[#C41E3A]/10 text-[#C41E3A] px-2 py-0.5 rounded-sm">
                        &#x1F525; x{mockPick.tipster.streak}
                      </span>
                    </div>
                    <span className="font-display text-xs text-[#8B7355]">{mockPick.timestamp}</span>
                  </div>
                </div>
                <PickResult result={mockPick.result} />
              </div>

              <div className="border-t-2 border-dashed border-[#C41E3A]/50" />

              {/* Pick details */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#0D2240] text-[#F5C842] font-display text-xs uppercase tracking-wider px-3 py-1 rounded-sm">
                  {mockPick.pickType}
                </span>
                <span className="font-sans font-bold text-lg text-[#3D2B1F]">{mockPick.selection}</span>
                <span className="font-mono text-sm text-[#8B7355]">({mockPick.odds})</span>
              </div>

              {/* Stake */}
              <div className="flex items-center gap-2">
                <span className="inline-flex gap-0.5 text-lg">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < mockPick.stake ? "opacity-100" : "opacity-20"}>&#x1F525;</span>
                  ))}
                </span>
                <span className="font-display text-sm text-[#3D2B1F]">{mockPick.stake} unidades</span>
              </div>

              {/* Profit */}
              <div className="flex items-center gap-3 bg-[#0D2240]/5 border-2 border-[#8B7355]/30 rounded-sm p-3">
                <span className="font-display text-xs uppercase text-[#8B7355]">Profit:</span>
                <span className={cn("font-mono font-bold text-lg", mockPick.profit > 0 ? "text-[#2E7D32]" : "text-[#C62828]")}>
                  {mockPick.profit > 0 ? "+" : ""}{mockPick.profit.toFixed(2)} unidades
                </span>
              </div>

              {/* Full analysis */}
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-[#3D2B1F]">An\u00e1lisis</h3>
                <div className="font-sans text-sm leading-relaxed text-[#3D2B1F]/80 whitespace-pre-line">
                  {mockPick.analysis}
                </div>
              </div>

              {/* Related picks */}
              <div className="border-t-2 border-[#8B7355]/30 pt-4 space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#3D2B1F]">Otros Picks para este juego</h3>
                {relatedPicks.map((rp) => (
                  <div key={rp.id} className="flex items-center justify-between bg-[#0D2240]/5 border border-[#8B7355]/30 rounded-sm p-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#0D2240] text-[#F5C842] font-display text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        {rp.pickType}
                      </span>
                      <div>
                        <p className="font-sans text-sm font-medium text-[#3D2B1F]">{rp.selection} <span className="font-mono text-xs text-[#8B7355]">({rp.odds})</span></p>
                        <p className="font-display text-xs text-[#8B7355]">{rp.tipster}</p>
                      </div>
                    </div>
                    <PickResult result={rp.result} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Game info card */}
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
            <div className="absolute top-[6px] left-[6px] w-4 h-4 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
            <div className="absolute top-[6px] right-[6px] w-4 h-4 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
            <div className="p-4 space-y-3">
              <h3 className="font-heading font-bold text-sm text-[#3D2B1F] text-center">INFO DEL JUEGO</h3>
              <div className="border-t-2 border-dashed border-[#C41E3A]/40" />
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full text-[10px] font-bold text-white border-2 border-[#8B7355]" style={{ backgroundColor: mockPick.game.awayColor }}>
                  {mockPick.game.away}
                </div>
                <span className="font-display text-xs text-[#8B7355]">vs</span>
                <div className="flex size-10 items-center justify-center rounded-full text-[10px] font-bold text-white border-2 border-[#8B7355]" style={{ backgroundColor: mockPick.game.homeColor }}>
                  {mockPick.game.home}
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="font-sans text-xs text-[#3D2B1F]/70">{mockPick.game.awayFull}</p>
                <p className="font-sans text-xs text-[#3D2B1F]/70">vs {mockPick.game.homeFull}</p>
              </div>
              <div className="font-display text-xs text-[#8B7355] text-center space-y-0.5">
                <p>{mockPick.game.date}</p>
                <p>{mockPick.game.time}</p>
              </div>
              <div className="border-t border-[#8B7355]/30 pt-2 space-y-1">
                <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">Abridores</p>
                <p className="font-sans text-xs text-[#3D2B1F]">{mockPick.game.awayPitcher}</p>
                <p className="font-sans text-xs text-[#3D2B1F]">{mockPick.game.homePitcher}</p>
              </div>
            </div>
          </div>

          {/* Tipster mini profile */}
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
            <div className="absolute top-[6px] left-[6px] w-4 h-4 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
            <div className="absolute top-[6px] right-[6px] w-4 h-4 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
            <div className="p-4 space-y-3">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-14 items-center justify-center rounded-full bg-[#0D2240] text-2xl border-2 border-[#8B7355]">
                  {mockPick.tipster.emoji}
                </div>
                <h3 className="font-heading font-bold text-[#3D2B1F]">{mockPick.tipster.name}</h3>
                <span className="inline-flex items-center gap-1 font-display text-xs bg-[#C41E3A]/10 text-[#C41E3A] px-2 py-0.5 rounded-sm">
                  &#x1F525; x{mockPick.tipster.streak}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div>
                  <p className="font-display text-[10px] uppercase text-[#8B7355]">Record</p>
                  <p className="font-mono text-sm font-bold text-[#3D2B1F]">{mockPick.tipster.record}</p>
                </div>
                <div>
                  <p className="font-display text-[10px] uppercase text-[#8B7355]">Win%</p>
                  <p className="font-mono text-sm font-bold text-[#2E7D32]">{mockPick.tipster.winPct}%</p>
                </div>
                <div>
                  <p className="font-display text-[10px] uppercase text-[#8B7355]">ROI</p>
                  <p className="font-mono text-sm font-bold text-[#2E7D32]">+{mockPick.tipster.roi}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
