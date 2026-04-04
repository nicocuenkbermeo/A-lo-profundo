import Link from "next/link"
import { PickResult } from "@/components/picks/PickResult"
import { StreakBadge } from "@/components/rachas/StreakBadge"
import { ScoreCard } from "@/components/scores/ScoreCard"
import StitchDivider from "@/components/vintage/StitchDivider"
import RetroButton from "@/components/vintage/RetroButton"
import { cn } from "@/lib/utils"
import type { Game } from "@/types/game"

const baseTeam = {
  id: "", externalId: "", logoUrl: "", secondaryColor: "",
}

const todayGames: Game[] = [
  {
    id: "g1", externalId: "g1", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "bos", name: "Red Sox", abbreviation: "BOS", city: "Boston", primaryColor: "#BD3039" },
    awayTeam: { ...baseTeam, id: "nyy", name: "Yankees", abbreviation: "NYY", city: "New York", primaryColor: "#003087" },
    status: "LIVE", homeScore: 2, awayScore: 4, inning: 6, inningHalf: "TOP", outs: 1,
    innings: [], startTime: "7:05 PM", venue: "Fenway Park",
  },
  {
    id: "g2", externalId: "g2", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "sf", name: "Giants", abbreviation: "SF", city: "San Francisco", primaryColor: "#FD5A1E" },
    awayTeam: { ...baseTeam, id: "lad", name: "Dodgers", abbreviation: "LAD", city: "Los Angeles", primaryColor: "#005A9C" },
    status: "SCHEDULED", homeScore: 0, awayScore: 0, inning: null, inningHalf: null, outs: 0,
    innings: [], startTime: "9:45 PM", venue: "Oracle Park",
  },
  {
    id: "g3", externalId: "g3", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "tex", name: "Rangers", abbreviation: "TEX", city: "Texas", primaryColor: "#C0111F" },
    awayTeam: { ...baseTeam, id: "hou", name: "Astros", abbreviation: "HOU", city: "Houston", primaryColor: "#002D62" },
    status: "FINAL", homeScore: 3, awayScore: 5, inning: 9, inningHalf: null, outs: 0,
    innings: [], startTime: "8:10 PM", venue: "Globe Life Field",
  },
  {
    id: "g4", externalId: "g4", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "nym", name: "Mets", abbreviation: "NYM", city: "New York", primaryColor: "#002D72" },
    awayTeam: { ...baseTeam, id: "atl", name: "Braves", abbreviation: "ATL", city: "Atlanta", primaryColor: "#CE1141" },
    status: "LIVE", homeScore: 1, awayScore: 3, inning: 4, inningHalf: "BOTTOM", outs: 2,
    innings: [], startTime: "7:10 PM", venue: "Citi Field",
  },
  {
    id: "g5", externalId: "g5", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "mil", name: "Brewers", abbreviation: "MIL", city: "Milwaukee", primaryColor: "#12284B" },
    awayTeam: { ...baseTeam, id: "chc", name: "Cubs", abbreviation: "CHC", city: "Chicago", primaryColor: "#0E3386" },
    status: "SCHEDULED", homeScore: 0, awayScore: 0, inning: null, inningHalf: null, outs: 0,
    innings: [], startTime: "7:40 PM", venue: "American Family Field",
  },
  {
    id: "g6", externalId: "g6", date: "2026-04-04",
    homeTeam: { ...baseTeam, id: "bal", name: "Orioles", abbreviation: "BAL", city: "Baltimore", primaryColor: "#DF4601" },
    awayTeam: { ...baseTeam, id: "tb", name: "Rays", abbreviation: "TB", city: "Tampa Bay", primaryColor: "#092C5C" },
    status: "FINAL", homeScore: 6, awayScore: 2, inning: 9, inningHalf: null, outs: 0,
    innings: [], startTime: "7:05 PM", venue: "Camden Yards",
  },
]

const featuredPicks = [
  { id: "1", tipster: "El Profeta", emoji: "\u26be", selection: "Yankees ML", odds: "-135", pickType: "MONEYLINE", result: "WIN", profit: 2.96, streak: 8 },
  { id: "2", tipster: "BatFlip King", emoji: "\ud83d\udc51", selection: "Dodgers -1.5", odds: "+110", pickType: "RUNLINE", result: "WIN", profit: 3.30, streak: 5 },
  { id: "3", tipster: "El Zurdo", emoji: "\ud83e\udde4", selection: "Contreras 2+ hits", odds: "+180", pickType: "PROP", result: "PENDING", profit: 0, streak: 2 },
]

const topStreakers = [
  { name: "El Profeta", emoji: "\u26be", streak: 8, winPct: 74.3 },
  { name: "BatFlip King", emoji: "\ud83d\udc51", streak: 5, winPct: 67.7 },
  { name: "La M\u00e1quina", emoji: "\u2699\ufe0f", streak: 3, winPct: 65.5 },
]

const standings = [
  { team: "BAL", name: "Orioles", w: 18, l: 8, pct: ".692" },
  { team: "NYY", name: "Yankees", w: 17, l: 9, pct: ".654" },
  { team: "LAD", name: "Dodgers", w: 16, l: 10, pct: ".615" },
  { team: "ATL", name: "Braves", w: 15, l: 11, pct: ".577" },
  { team: "HOU", name: "Astros", w: 14, l: 12, pct: ".538" },
]

const battingLeaders = [
  { name: "J. Soto", team: "NYY", stat: ".348" },
  { name: "M. Betts", team: "LAD", stat: ".342" },
  { name: "R. Acuna", team: "ATL", stat: ".335" },
]

const pitchingLeaders = [
  { name: "G. Cole", team: "NYY", stat: "1.89" },
  { name: "S. Strider", team: "ATL", stat: "2.05" },
  { name: "C. Burnes", team: "BAL", stat: "2.18" },
]

const bettingLeaders = [
  { name: "El Profeta", stat: "+38.5u" },
  { name: "BatFlip King", stat: "+28.3u" },
  { name: "La M\u00e1quina", stat: "+22.1u" },
]

const allTeams = [
  { abbr: "ARI", color: "#A71930" }, { abbr: "ATL", color: "#CE1141" }, { abbr: "BAL", color: "#DF4601" },
  { abbr: "BOS", color: "#BD3039" }, { abbr: "CHC", color: "#0E3386" }, { abbr: "CHW", color: "#27251F" },
  { abbr: "CIN", color: "#C6011F" }, { abbr: "CLE", color: "#00385D" }, { abbr: "COL", color: "#33006F" },
  { abbr: "DET", color: "#0C2340" }, { abbr: "HOU", color: "#002D62" }, { abbr: "KC", color: "#004687" },
  { abbr: "LAA", color: "#BA0021" }, { abbr: "LAD", color: "#005A9C" }, { abbr: "MIA", color: "#00A3E0" },
  { abbr: "MIL", color: "#12284B" }, { abbr: "MIN", color: "#002B5C" }, { abbr: "NYM", color: "#002D72" },
  { abbr: "NYY", color: "#003087" }, { abbr: "OAK", color: "#003831" }, { abbr: "PHI", color: "#E81828" },
  { abbr: "PIT", color: "#27251F" }, { abbr: "SD", color: "#2F241D" }, { abbr: "SEA", color: "#0C2C56" },
  { abbr: "SF", color: "#FD5A1E" }, { abbr: "STL", color: "#C41E3A" }, { abbr: "TB", color: "#092C5C" },
  { abbr: "TEX", color: "#C0111F" }, { abbr: "TOR", color: "#134A8E" }, { abbr: "WSH", color: "#AB0003" },
]

export default function HomePage() {
  return (
    <div className="space-y-0 pb-12">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#0D2240] to-[#162d4d] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, #FDF6E3 20px, #FDF6E3 21px)" }} />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-none">
            <span className="text-[#F5C842]">A LO</span>{" "}
            <span className="text-[#C41E3A]">PROFUNDO</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-display text-lg text-[#8FBCE6] tracking-wider">
            Tu fuente de b\u00e9isbol profundo
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/scores">
              <RetroButton variant="red" size="lg">VER SCORES</RetroButton>
            </Link>
            <Link href="/picks">
              <RetroButton variant="gold" size="lg">VER PICKS</RetroButton>
            </Link>
          </div>
        </div>
      </section>

      <StitchDivider className="my-0" />

      {/* Today's games */}
      <section className="mx-auto max-w-5xl px-4 py-10 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[#F5C842]">JUEGOS DE HOY</h2>
          <Link href="/scores" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Ver todos &rarr;
          </Link>
        </div>
        <p className="font-display text-sm text-[#8B7355]">Abril 4, 2026</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {todayGames.map((game) => (
            <ScoreCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <StitchDivider />

      {/* Two column: Featured picks + Standings */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Featured picks - 3 cols */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-[#F5C842]">PICKS DESTACADOS</h2>
              <Link href="/picks" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
                Ver todos &rarr;
              </Link>
            </div>
            <div className="space-y-4">
              {featuredPicks.map((p) => (
                <Link key={p.id} href={`/picks/${p.id}`} className="block">
                  <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 hover:-translate-y-[1px] hover:shadow-[6px_6px_0px_#5C4A32] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0D2240] text-base border border-[#8B7355]">
                        {p.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-[#3D2B1F]">{p.tipster}</span>
                          {p.streak > 0 && (
                            <span className="font-display text-[10px] text-[#C41E3A]">&#x1F525; x{p.streak}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="bg-[#0D2240] text-[#F5C842] font-display text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm">
                            {p.pickType}
                          </span>
                          <span className="font-sans font-bold text-sm text-[#3D2B1F]">{p.selection}</span>
                          <span className="font-mono text-xs text-[#8B7355]">({p.odds})</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <PickResult result={p.result} size="sm" />
                        <span className={cn(
                          "font-mono text-xs font-bold",
                          p.profit > 0 ? "text-[#2E7D32]" : p.profit < 0 ? "text-[#C62828]" : "text-[#8B7355]"
                        )}>
                          {p.profit > 0 ? "+" : ""}{p.profit.toFixed(2)}u
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mini standings - 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            <h2 className="font-heading text-2xl font-bold text-[#F5C842]">CLASIFICACI\u00d3N</h2>
            <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
              <div className="absolute top-[5px] left-[5px] w-3 h-3 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
              <div className="absolute top-[5px] right-[5px] w-3 h-3 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0D2240] text-[#F5C842]">
                    <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">Equipo</th>
                    <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">W</th>
                    <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">L</th>
                    <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-right">PCT</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => (
                    <tr key={s.team} className={cn("border-b border-[#8B7355]/20", i === 0 && "bg-[#F5C842]/10")}>
                      <td className="px-3 py-2">
                        <span className="font-heading font-bold text-sm text-[#3D2B1F]">{s.team}</span>
                        <span className="font-display text-xs text-[#8B7355] ml-1.5">{s.name}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-sm text-[#3D2B1F] text-center">{s.w}</td>
                      <td className="px-3 py-2 font-mono text-sm text-[#3D2B1F] text-center">{s.l}</td>
                      <td className="px-3 py-2 font-mono text-sm font-bold text-[#3D2B1F] text-right">{s.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <StitchDivider />

      {/* Rachas en fuego */}
      <section className="mx-auto max-w-5xl px-4 py-10 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-[#F5C842]">RACHAS EN FUEGO &#x1F525;</h2>
          <Link href="/rachas" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Leaderboard &rarr;
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {topStreakers.map((t) => (
            <div key={t.name} className="relative w-48 shrink-0 bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#0D2240] text-xl border-2 border-[#8B7355]">
                  {t.emoji}
                </div>
                <p className="font-heading font-bold text-sm text-[#3D2B1F]">{t.name}</p>
                <StreakBadge count={t.streak} />
                <span className="font-mono text-xs text-[#8B7355]">Win% {t.winPct}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <StitchDivider />

      {/* Leaders section */}
      <section className="mx-auto max-w-5xl px-4 py-10 space-y-5">
        <h2 className="font-heading text-2xl font-bold text-[#F5C842]">L\u00cdDERES</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Batting */}
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
            <div className="bg-[#0D2240] text-[#F5C842] px-4 py-2 font-display text-xs uppercase tracking-wider">Bateo (AVG)</div>
            <div className="p-3 space-y-2">
              {battingLeaders.map((l, i) => (
                <div key={l.name} className="flex items-center justify-between">
                  <span className="font-sans text-sm text-[#3D2B1F]">
                    <span className="font-mono text-xs text-[#8B7355] mr-2">{i + 1}.</span>
                    {l.name} <span className="font-display text-[10px] text-[#8B7355]">{l.team}</span>
                  </span>
                  <span className="font-mono text-sm font-bold text-[#C41E3A]">{l.stat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pitching */}
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
            <div className="bg-[#0D2240] text-[#F5C842] px-4 py-2 font-display text-xs uppercase tracking-wider">Pitcheo (ERA)</div>
            <div className="p-3 space-y-2">
              {pitchingLeaders.map((l, i) => (
                <div key={l.name} className="flex items-center justify-between">
                  <span className="font-sans text-sm text-[#3D2B1F]">
                    <span className="font-mono text-xs text-[#8B7355] mr-2">{i + 1}.</span>
                    {l.name} <span className="font-display text-[10px] text-[#8B7355]">{l.team}</span>
                  </span>
                  <span className="font-mono text-sm font-bold text-[#2E7D32]">{l.stat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Betting */}
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
            <div className="bg-[#0D2240] text-[#F5C842] px-4 py-2 font-display text-xs uppercase tracking-wider">Apuestas (Profit)</div>
            <div className="p-3 space-y-2">
              {bettingLeaders.map((l, i) => (
                <div key={l.name} className="flex items-center justify-between">
                  <span className="font-sans text-sm text-[#3D2B1F]">
                    <span className="font-mono text-xs text-[#8B7355] mr-2">{i + 1}.</span>
                    {l.name}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#2E7D32]">{l.stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StitchDivider />

      {/* 30 team badges */}
      <section className="mx-auto max-w-5xl px-4 py-10 space-y-5">
        <h2 className="font-heading text-xl font-bold text-[#F5C842] text-center">MLB TEAMS</h2>
        <div className="grid grid-cols-6 sm:grid-cols-6 gap-3 justify-items-center">
          {allTeams.map((t) => (
            <div
              key={t.abbr}
              className="flex size-11 items-center justify-center rounded-full text-[9px] font-bold text-white border-2 border-[#8B7355] hover:scale-110 transition-transform"
              style={{ backgroundColor: t.color }}
            >
              {t.abbr}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
