import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Flame, TrendingUp, Target, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Tendencias",
  description: "Tendencias de equipos, pitchers y apuestas MLB.",
}

const hotTeams = [
  { team: "BAL", name: "Orioles", last10: "8-2", streak: "W5", runDiff: "+22" },
  { team: "LAD", name: "Dodgers", last10: "7-3", streak: "W3", runDiff: "+18" },
  { team: "NYY", name: "Yankees", last10: "7-3", streak: "W4", runDiff: "+15" },
  { team: "ATL", name: "Braves", last10: "7-3", streak: "W2", runDiff: "+12" },
  { team: "HOU", name: "Astros", last10: "6-4", streak: "W1", runDiff: "+8" },
]

const topPitchers = [
  { name: "Gerrit Cole", team: "NYY", era: "1.89", whip: "0.92", kPer9: "11.2", record: "5-1" },
  { name: "Spencer Strider", team: "ATL", era: "2.05", whip: "0.88", kPer9: "12.8", record: "4-1" },
  { name: "Corbin Burnes", team: "BAL", era: "2.18", whip: "0.95", kPer9: "10.1", record: "5-0" },
  { name: "Zack Wheeler", team: "PHI", era: "2.34", whip: "0.98", kPer9: "9.8", record: "4-2" },
  { name: "Yu Darvish", team: "SD", era: "2.51", whip: "1.01", kPer9: "9.5", record: "3-2" },
]

const runLineTrends = [
  { team: "BAL", name: "Orioles", coverPct: 62.5, games: 24 },
  { team: "LAD", name: "Dodgers", coverPct: 58.3, games: 24 },
  { team: "NYY", name: "Yankees", coverPct: 56.0, games: 25 },
  { team: "PHI", name: "Phillies", coverPct: 54.2, games: 24 },
  { team: "ATL", name: "Braves", coverPct: 52.0, games: 25 },
]

const overUnderTrends = [
  { team: "COL", name: "Rockies", overPct: 68.0, underPct: 32.0 },
  { team: "CIN", name: "Reds", overPct: 62.5, underPct: 37.5 },
  { team: "MIA", name: "Marlins", overPct: 29.2, underPct: 70.8 },
  { team: "CLE", name: "Guardians", overPct: 33.3, underPct: 66.7 },
]

const todayMatchups = [
  {
    away: "NYY", home: "BOS",
    awayFull: "Yankees", homeFull: "Red Sox",
    time: "7:05 PM",
    awayPitcher: "Cole (5-1, 1.89)",
    homePitcher: "Pivetta (2-3, 4.12)",
    analysis: "Cole ha dominado a Boston en sus ultimas 5 salidas. Ventaja clara para New York con el mejor abridor de la liga.",
  },
  {
    away: "LAD", home: "SF",
    awayFull: "Dodgers", homeFull: "Giants",
    time: "9:45 PM",
    awayPitcher: "Glasnow (4-1, 2.45)",
    homePitcher: "Webb (3-2, 3.10)",
    analysis: "Duelo de pitcheo de calidad. Webb ha sido fuerte en casa pero el lineup de los Dodgers es elite contra derechos.",
  },
  {
    away: "ATL", home: "NYM",
    awayFull: "Braves", homeFull: "Mets",
    time: "7:10 PM",
    awayPitcher: "Strider (4-1, 2.05)",
    homePitcher: "Senga (2-2, 3.55)",
    analysis: "Strider viene imparable con 42 K en su ultimo mes. Los Mets han tenido problemas contra fastballs de alta velocidad.",
  },
  {
    away: "HOU", home: "TEX",
    awayFull: "Astros", homeFull: "Rangers",
    time: "8:10 PM",
    awayPitcher: "Valdez (3-2, 2.88)",
    homePitcher: "Eovaldi (2-3, 3.92)",
    analysis: "Rivalidad texana siempre competitiva. Valdez tiene ventaja en la loma pero Arlington favorece la ofensiva.",
  },
]

export default function TrendsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold">Tendencias</h1>

      {/* Hot teams */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Flame className="size-5 fill-primary text-primary" />
          Equipos Calientes
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {hotTeams.map((t, i) => (
            <Card key={t.team} className={cn(i === 0 && "ring-1 ring-primary/30")}>
              <CardContent className="flex flex-col items-center gap-1 py-4">
                <span className="font-mono text-2xl font-black text-primary">{t.team}</span>
                <span className="text-xs text-muted-foreground">{t.name}</span>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="font-mono font-bold">{t.last10}</span>
                  <Badge variant="secondary" className="bg-win/15 text-win text-[10px]">
                    {t.streak}
                  </Badge>
                </div>
                <span className="text-xs text-win font-mono">{t.runDiff}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dominant pitchers */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Target className="size-5 text-primary" />
          Pitchers Dominantes
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Pitcher</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>ERA</TableHead>
                  <TableHead>WHIP</TableHead>
                  <TableHead className="hidden sm:table-cell">K/9</TableHead>
                  <TableHead>Record</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPitchers.map((p, i) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-mono text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="font-mono text-primary">{p.team}</TableCell>
                    <TableCell className="font-mono text-win font-medium">{p.era}</TableCell>
                    <TableCell className="font-mono text-sm">{p.whip}</TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-sm">{p.kPer9}</TableCell>
                    <TableCell className="font-mono text-sm">{p.record}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Betting trends */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="size-5 text-primary" />
          Tendencias de Apuesta
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Run line cover */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Run Line Cover %</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {runLineTrends.map((t) => (
                  <div key={t.team} className="flex items-center gap-3">
                    <span className="w-10 font-mono text-sm font-bold text-primary">{t.team}</span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${t.coverPct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-14 text-right font-mono text-sm font-medium">{t.coverPct}%</span>
                    <span className="w-14 text-right text-xs text-muted-foreground">{t.games}G</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Over/Under */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Over / Under Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {overUnderTrends.map((t) => (
                  <div key={t.team} className="flex items-center gap-3">
                    <span className="w-10 font-mono text-sm font-bold text-primary">{t.team}</span>
                    <div className="flex-1">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div className="bg-win" style={{ width: `${t.overPct}%` }} />
                        <div className="bg-loss" style={{ width: `${t.underPct}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs font-mono">
                      <span className="text-win">O {t.overPct}%</span>
                      <span className="text-loss">U {t.underPct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Today's matchups */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="size-5 text-primary" />
          Matchups del Dia
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {todayMatchups.map((m) => (
            <Card key={`${m.away}-${m.home}`}>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold">
                    {m.away} <span className="text-muted-foreground text-sm">vs</span> {m.home}
                  </span>
                  <span className="text-xs text-muted-foreground">{m.time}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-background p-2">
                    <p className="text-muted-foreground">Abridor {m.awayFull}</p>
                    <p className="font-medium">{m.awayPitcher}</p>
                  </div>
                  <div className="rounded-md bg-background p-2">
                    <p className="text-muted-foreground">Abridor {m.homeFull}</p>
                    <p className="font-medium">{m.homePitcher}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{m.analysis}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
