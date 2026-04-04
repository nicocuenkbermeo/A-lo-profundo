import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PickResult } from "@/components/picks/PickResult"
import { ChevronRight, Flame, TrendingUp, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

const mockPick = {
  id: "1",
  tipster: { name: "Carlos Rivera", initials: "CR", streak: 7, record: "45-18", winPct: 71.4, roi: 18.5 },
  game: { away: "NYY", home: "BOS", date: "Abr 4, 2026", time: "7:05 PM ET", awayFull: "New York Yankees", homeFull: "Boston Red Sox" },
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
  { id: "r1", tipster: "Maria Lopez", selection: "Over 8.5", odds: "+100", result: "LOSS", pickType: "TOTAL" },
  { id: "r2", tipster: "Diego Martinez", selection: "Red Sox +1.5", odds: "-130", result: "WIN", pickType: "RUNLINE" },
  { id: "r3", tipster: "Ana Gutierrez", selection: "Judge 1+ HR", odds: "+250", result: "WIN", pickType: "PROP" },
]

export async function generateMetadata({ params }: { params: Promise<{ pickId: string }> }): Promise<Metadata> {
  const { pickId } = await params
  return {
    title: `Pick #${pickId} - ${mockPick.selection}`,
    description: `${mockPick.tipster.name}: ${mockPick.selection} (${mockPick.odds}) - ${mockPick.game.awayFull} vs ${mockPick.game.homeFull}`,
  }
}

export default async function PickDetailPage({ params }: { params: Promise<{ pickId: string }> }) {
  await params

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/picks" className="hover:text-foreground transition-colors">Picks</Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{mockPick.selection}</span>
      </nav>

      {/* Main pick card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                {mockPick.tipster.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{mockPick.tipster.name}</span>
                  <span className="inline-flex items-center gap-0.5 text-sm text-primary font-medium">
                    <Flame className="size-3.5 fill-primary text-primary" />
                    {mockPick.tipster.streak}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{mockPick.timestamp}</span>
              </div>
            </div>
            <PickResult result={mockPick.result} />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Game info */}
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-lg font-bold">{mockPick.game.away} vs {mockPick.game.home}</p>
                <p className="text-sm text-muted-foreground">{mockPick.game.awayFull} vs {mockPick.game.homeFull}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {mockPick.game.date}
                </div>
                <p>{mockPick.game.time}</p>
              </div>
            </div>
          </div>

          {/* Pick details */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-blue-500/15 text-blue-400 border-blue-500/20">
              {mockPick.pickType}
            </Badge>
            <span className="text-lg font-bold">{mockPick.selection}</span>
            <span className="font-mono text-muted-foreground">({mockPick.odds})</span>
          </div>

          {/* Stake */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Stake:</span>
            <span className="inline-flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Flame
                  key={i}
                  className={cn(
                    "size-4",
                    i < mockPick.stake ? "fill-primary text-primary" : "text-muted-foreground/30"
                  )}
                />
              ))}
            </span>
            <span className="text-sm font-medium">{mockPick.stake}/5</span>
          </div>

          {/* Profit */}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
            <TrendingUp className={cn("size-4", mockPick.profit > 0 ? "text-win" : "text-loss")} />
            <span className="text-sm text-muted-foreground">Profit:</span>
            <span className={cn("font-mono font-bold", mockPick.profit > 0 ? "text-win" : "text-loss")}>
              {mockPick.profit > 0 ? "+" : ""}{mockPick.profit.toFixed(2)} unidades
            </span>
          </div>

          {/* Full analysis */}
          <div className="space-y-2">
            <h3 className="font-semibold">Analisis</h3>
            <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {mockPick.analysis}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipster mini profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4" />
            Perfil del Tipster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
              {mockPick.tipster.initials}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{mockPick.tipster.name}</p>
              <div className="mt-1 flex flex-wrap gap-4 text-sm">
                <span>Record: <strong>{mockPick.tipster.record}</strong></span>
                <span>Win%: <strong className="text-win">{mockPick.tipster.winPct}%</strong></span>
                <span>ROI: <strong className="text-win">+{mockPick.tipster.roi}%</strong></span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related picks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Otros Picks para este juego</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {relatedPicks.map((rp) => (
              <div key={rp.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-blue-500/15 text-blue-400 border-blue-500/20 text-[10px]">
                    {rp.pickType}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{rp.selection} <span className="font-mono text-xs text-muted-foreground">({rp.odds})</span></p>
                    <p className="text-xs text-muted-foreground">{rp.tipster}</p>
                  </div>
                </div>
                <PickResult result={rp.result} size="sm" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
