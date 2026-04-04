import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PickResult } from "@/components/picks/PickResult"
import { StreakBadge } from "@/components/rachas/StreakBadge"
import { ScoreCard } from "@/components/scores/ScoreCard"
import {
  Flame,
  ArrowRight,
  Zap,
  BarChart3,
  Users,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Game } from "@/types/game"

const baseTeam = {
  id: "", externalId: "", logoUrl: "", primaryColor: "", secondaryColor: "",
}

const todayGames: Game[] = [
  {
    id: "g1", externalId: "g1", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "bos", name: "Red Sox", abbreviation: "BOS", city: "Boston" },
    awayTeam: { ...baseTeam, id: "nyy", name: "Yankees", abbreviation: "NYY", city: "New York" },
    status: "LIVE", homeScore: 2, awayScore: 4, inning: 6, inningHalf: "TOP", outs: 1,
    innings: [], startTime: "7:05 PM", venue: "Fenway Park",
  },
  {
    id: "g2", externalId: "g2", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "sf", name: "Giants", abbreviation: "SF", city: "San Francisco" },
    awayTeam: { ...baseTeam, id: "lad", name: "Dodgers", abbreviation: "LAD", city: "Los Angeles" },
    status: "SCHEDULED", homeScore: 0, awayScore: 0, inning: null, inningHalf: null, outs: 0,
    innings: [], startTime: "9:45 PM", venue: "Oracle Park",
  },
  {
    id: "g3", externalId: "g3", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "tex", name: "Rangers", abbreviation: "TEX", city: "Texas" },
    awayTeam: { ...baseTeam, id: "hou", name: "Astros", abbreviation: "HOU", city: "Houston" },
    status: "FINAL", homeScore: 3, awayScore: 5, inning: 9, inningHalf: null, outs: 0,
    innings: [], startTime: "8:10 PM", venue: "Globe Life Field",
  },
  {
    id: "g4", externalId: "g4", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "nym", name: "Mets", abbreviation: "NYM", city: "New York" },
    awayTeam: { ...baseTeam, id: "atl", name: "Braves", abbreviation: "ATL", city: "Atlanta" },
    status: "LIVE", homeScore: 1, awayScore: 3, inning: 4, inningHalf: "BOTTOM", outs: 2,
    innings: [], startTime: "7:10 PM", venue: "Citi Field",
  },
  {
    id: "g5", externalId: "g5", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "mil", name: "Brewers", abbreviation: "MIL", city: "Milwaukee" },
    awayTeam: { ...baseTeam, id: "chc", name: "Cubs", abbreviation: "CHC", city: "Chicago" },
    status: "SCHEDULED", homeScore: 0, awayScore: 0, inning: null, inningHalf: null, outs: 0,
    innings: [], startTime: "7:40 PM", venue: "American Family Field",
  },
  {
    id: "g6", externalId: "g6", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "bal", name: "Orioles", abbreviation: "BAL", city: "Baltimore" },
    awayTeam: { ...baseTeam, id: "tb", name: "Rays", abbreviation: "TB", city: "Tampa Bay" },
    status: "FINAL", homeScore: 6, awayScore: 2, inning: 9, inningHalf: null, outs: 0,
    innings: [], startTime: "7:05 PM", venue: "Camden Yards",
  },
]

const featuredPicks = [
  {
    id: "1", tipster: "Carlos Rivera", initials: "CR",
    selection: "Yankees ML", odds: "-135", pickType: "MONEYLINE",
    result: "WIN", profit: 2.96, streak: 7,
  },
  {
    id: "2", tipster: "Maria Lopez", initials: "ML",
    selection: "Dodgers -1.5", odds: "+110", pickType: "RUNLINE",
    result: "WIN", profit: 3.30, streak: 4,
  },
  {
    id: "3", tipster: "Ana Gutierrez", initials: "AG",
    selection: "Contreras 2+ hits", odds: "+180", pickType: "PROP",
    result: "PENDING", profit: 0, streak: 2,
  },
]

const topStreakers = [
  { name: "Carlos Rivera", initials: "CR", streak: 7, winPct: 71.4 },
  { name: "Maria Lopez", initials: "ML", streak: 4, winPct: 63.3 },
  { name: "Ana Gutierrez", initials: "AG", streak: 3, winPct: 60.0 },
]

const trendHighlights = [
  { label: "BAL Orioles", stat: "8-2 L10", detail: "+22 run diff", positive: true },
  { label: "Gerrit Cole", stat: "1.89 ERA", detail: "11.2 K/9", positive: true },
  { label: "COL Over", stat: "68%", detail: "Mas carreras en la liga", positive: true },
  { label: "MIA Under", stat: "71%", detail: "Ofensiva mas fria", positive: false },
]

export default function HomePage() {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            A LO <span className="text-primary">PROFUNDO</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Scores en vivo, estadisticas avanzadas, picks de expertos y rachas de tipsters. Todo lo que necesitas para el beisbol MLB.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/scores">
              <Button size="lg">
                <Zap className="mr-2 size-4" />
                Ver Scores
              </Button>
            </Link>
            <Link href="/picks">
              <Button variant="outline" size="lg">
                <Target className="mr-2 size-4" />
                Ver Picks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Today's games */}
      <section className="mx-auto max-w-5xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Juegos de Hoy</h2>
          <Link href="/scores" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Ver todos <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {todayGames.map((game) => (
            <ScoreCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Featured picks */}
      <section className="mx-auto max-w-5xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Picks Destacados</h2>
          <Link href="/picks" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Ver todos <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredPicks.map((p) => (
            <Link key={p.id} href={`/picks/${p.id}`}>
              <Card className="transition-colors hover:ring-primary/20 h-full">
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {p.initials}
                    </div>
                    <span className="font-semibold text-sm">{p.tipster}</span>
                    {p.streak > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-primary">
                        <Flame className="size-3 fill-primary text-primary" />
                        {p.streak}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-500/15 text-blue-400 border-blue-500/20 text-[10px]">
                      {p.pickType}
                    </Badge>
                    <span className="font-semibold text-sm">{p.selection}</span>
                    <span className="font-mono text-xs text-muted-foreground">({p.odds})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <PickResult result={p.result} size="sm" />
                    <span className={cn(
                      "font-mono text-sm font-semibold",
                      p.profit > 0 ? "text-win" : p.profit < 0 ? "text-loss" : "text-muted-foreground"
                    )}>
                      {p.profit > 0 ? "+" : ""}{p.profit.toFixed(2)}u
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot streaks */}
      <section className="mx-auto max-w-5xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Flame className="size-5 fill-primary text-primary" />
            Rachas en Fuego
          </h2>
          <Link href="/rachas" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Leaderboard <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {topStreakers.map((t) => (
            <Card key={t.name} className="w-48 shrink-0">
              <CardContent className="flex flex-col items-center gap-2 py-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  {t.initials}
                </div>
                <p className="font-semibold text-sm">{t.name}</p>
                <StreakBadge count={t.streak} />
                <span className="text-xs text-muted-foreground">Win% {t.winPct}%</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trends */}
      <section className="mx-auto max-w-5xl px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <BarChart3 className="size-5 text-primary" />
            Tendencias
          </h2>
          <Link href="/trends" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            Ver todas <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {trendHighlights.map((t) => (
            <Card key={t.label}>
              <CardContent className="py-4 text-center">
                <p className="text-xs text-muted-foreground">{t.label}</p>
                <p className={cn("text-xl font-bold font-mono", t.positive ? "text-win" : "text-loss")}>
                  {t.stat}
                </p>
                <p className="text-xs text-muted-foreground">{t.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4">
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <Users className="size-10 text-primary" />
            <h2 className="text-2xl font-bold">Unete a la Comunidad</h2>
            <p className="max-w-md text-muted-foreground">
              Accede a picks premium, compite en el leaderboard y sigue las mejores rachas del beisbol.
            </p>
            <Button size="lg">
              Crear Cuenta Gratis
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
