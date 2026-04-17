import type { Metadata } from "next"
import { ResponsibleGamingNotice } from "@/components/ui/ResponsibleGamingNotice"
import { BullpenWidget } from "@/components/mlb/BullpenWidget"
import { fetchStandings, fetchLeaders, fetchMlbGames } from "@/lib/mlb-api"

export const metadata: Metadata = {
  title: "Tendencias",
  description: "Tendencias de equipos, pitchers y apuestas MLB.",
}

export const revalidate = 900 // 15 min

const TEAM_COLORS: Record<string, string> = {
  ARI: "#A71930", ATL: "#CE1141", BAL: "#DF4601", BOS: "#BD3039",
  CHC: "#0E3386", CHW: "#27251F", CIN: "#C6011F", CLE: "#00385D",
  COL: "#33006F", DET: "#0C2340", HOU: "#002D62", KCR: "#004687",
  LAA: "#BA0021", LAD: "#005A9C", MIA: "#00A3E0", MIL: "#12284B",
  MIN: "#002B5C", NYM: "#002D72", NYY: "#003087", OAK: "#003831",
  PHI: "#E81828", PIT: "#FDB827", SDP: "#2F241D", SEA: "#0C2C56",
  SFG: "#FD5A1E", STL: "#C41E3A", TBR: "#092C5C", TEX: "#003278",
  TOR: "#134A8E", WSH: "#AB0003", MLB: "#0D2240",
}

function colorFor(abbr: string): string {
  return TEAM_COLORS[abbr?.toUpperCase()] ?? "#0D2240"
}

export default async function TrendsPage() {
  const [standings, leaders, games] = await Promise.all([
    fetchStandings(),
    fetchLeaders(),
    fetchMlbGames(),
  ])

  const hotTeams = standings.slice(0, 5).map((s) => ({
    abbr: s.abbr,
    name: s.name,
    wins: s.wins,
    losses: s.losses,
    record: `${s.wins}-${s.losses}`,
    color: colorFor(s.abbr),
  }))

  const topPitchers = leaders.era.slice(0, 5).map((l, i) => ({
    rank: i + 1,
    name: l.name,
    team: l.teamAbbr,
    era: l.value,
  }))

  const todayMatchups = games.slice(0, 6).map((g) => ({
    gameId: g.id,
    away: g.awayTeam.abbreviation,
    home: g.homeTeam.abbreviation,
    awayName: g.awayTeam.name,
    homeName: g.homeTeam.name,
    awayColor: colorFor(g.awayTeam.abbreviation),
    homeColor: colorFor(g.homeTeam.abbreviation),
    time: g.startTime,
    status: g.status,
    homeScore: g.homeScore,
    awayScore: g.awayScore,
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">TENDENCIAS</h1>
        <p className="font-sans text-sm text-[#FDF6E3]/70">
          Datos en vivo desde MLB Stats API — actualizado cada 15 minutos.
        </p>
      </div>

      {/* Hot teams */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">EQUIPOS CALIENTES</h2>
        {hotTeams.length === 0 ? (
          <p className="font-sans text-sm text-[#FDF6E3]/60 italic">Sin datos de la MLB API en este momento.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {hotTeams.map((t, i) => (
              <div
                key={t.abbr}
                className={`relative bg-[#FDF6E3] border-[3px] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 ${i === 0 ? "border-[#F5C842]" : "border-[#8B7355]"}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex size-12 items-center justify-center rounded-full text-[11px] font-bold text-white border-2 border-[#8B7355]"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.abbr}
                  </div>
                  <span className="font-display text-xs text-[#8B7355]">{t.name}</span>
                  <span className="font-mono font-bold text-[#3D2B1F]">{t.record}</span>
                  <span className="font-mono text-[10px] text-[#8B7355]">#{i + 1} MLB</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dominant pitchers */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">LÍDERES EN ERA</h2>
        {topPitchers.length === 0 ? (
          <p className="font-sans text-sm text-[#FDF6E3]/60 italic">Sin datos de líderes disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {topPitchers.map((p) => (
              <div key={p.name} className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <span className="font-mono text-xs text-[#8B7355]">#{p.rank}</span>
                  <span className="font-heading font-bold text-sm text-[#3D2B1F]">{p.name}</span>
                  <span className="font-display text-xs text-[#8B7355]">{p.team}</span>
                  <div className="border-t border-[#8B7355]/30 pt-2 mt-1 w-full text-center">
                    <p className="font-display text-[9px] uppercase text-[#8B7355]">ERA</p>
                    <p className="font-mono text-lg font-bold text-[#2E7D32]">{p.era}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bullpen Fatigue widget */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">BULLPENS</h2>
        <BullpenWidget />
      </section>

      {/* Today's matchups */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">MATCHUPS DEL DÍA</h2>
        {todayMatchups.length === 0 ? (
          <p className="font-sans text-sm text-[#FDF6E3]/60 italic">No hay juegos programados para hoy.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {todayMatchups.map((m) => (
              <div key={m.gameId} className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
                <div className="absolute top-[5px] left-[5px] w-3 h-3 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
                <div className="absolute top-[5px] right-[5px] w-3 h-3 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full text-[9px] font-bold text-white border border-[#8B7355]" style={{ backgroundColor: m.awayColor }}>
                        {m.away}
                      </div>
                      <span className="font-display text-xs text-[#8B7355]">@</span>
                      <div className="flex size-8 items-center justify-center rounded-full text-[9px] font-bold text-white border border-[#8B7355]" style={{ backgroundColor: m.homeColor }}>
                        {m.home}
                      </div>
                    </div>
                    <span className="font-display text-xs text-[#8B7355]">{m.time}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#0D2240]/5 border border-[#8B7355]/30 rounded-sm p-2 text-center">
                      <p className="font-display text-[9px] uppercase text-[#8B7355]">{m.awayName}</p>
                      <p className="font-mono text-lg font-bold text-[#3D2B1F]">{m.status === "SCHEDULED" ? "—" : m.awayScore}</p>
                    </div>
                    <div className="bg-[#0D2240]/5 border border-[#8B7355]/30 rounded-sm p-2 text-center">
                      <p className="font-display text-[9px] uppercase text-[#8B7355]">{m.homeName}</p>
                      <p className="font-mono text-lg font-bold text-[#3D2B1F]">{m.status === "SCHEDULED" ? "—" : m.homeScore}</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <span className={`font-display text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                      m.status === "LIVE"
                        ? "bg-[#C41E3A] text-white"
                        : m.status === "FINAL"
                        ? "bg-[#8B7355]/30 text-[#3D2B1F]"
                        : "bg-[#0D2240]/10 text-[#0D2240]"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <ResponsibleGamingNotice className="mt-2" />
      </section>
    </div>
  )
}
