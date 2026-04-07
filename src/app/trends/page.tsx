import type { Metadata } from "next"
import { cn } from "@/lib/utils"
import { ResponsibleGamingNotice } from "@/components/ui/ResponsibleGamingNotice"

export const metadata: Metadata = {
  title: "Tendencias",
  description: "Tendencias de equipos, pitchers y apuestas MLB.",
}

const hotTeams = [
  { team: "BAL", name: "Orioles", color: "#DF4601", last10: "8-2", streak: "W5", runDiff: "+22" },
  { team: "LAD", name: "Dodgers", color: "#005A9C", last10: "7-3", streak: "W3", runDiff: "+18" },
  { team: "NYY", name: "Yankees", color: "#003087", last10: "7-3", streak: "W4", runDiff: "+15" },
  { team: "ATL", name: "Braves", color: "#CE1141", last10: "7-3", streak: "W2", runDiff: "+12" },
  { team: "HOU", name: "Astros", color: "#002D62", last10: "6-4", streak: "W1", runDiff: "+8" },
]

const topPitchers = [
  { name: "Gerrit Cole", team: "NYY", era: "1.89", whip: "0.92", kPer9: "11.2" },
  { name: "Spencer Strider", team: "ATL", era: "2.05", whip: "0.88", kPer9: "12.8" },
  { name: "Corbin Burnes", team: "BAL", era: "2.18", whip: "0.95", kPer9: "10.1" },
  { name: "Zack Wheeler", team: "PHI", era: "2.34", whip: "0.98", kPer9: "9.8" },
  { name: "Yu Darvish", team: "SD", era: "2.51", whip: "1.01", kPer9: "9.5" },
]

const runLineTrends = [
  { team: "BAL", name: "Orioles", coverPct: 62.5 },
  { team: "LAD", name: "Dodgers", coverPct: 58.3 },
  { team: "NYY", name: "Yankees", coverPct: 56.0 },
  { team: "PHI", name: "Phillies", coverPct: 54.2 },
  { team: "ATL", name: "Braves", coverPct: 52.0 },
]

const overUnderTrends = [
  { team: "COL", name: "Rockies", overPct: 68.0 },
  { team: "CIN", name: "Reds", overPct: 62.5 },
  { team: "MIA", name: "Marlins", overPct: 29.2 },
  { team: "CLE", name: "Guardians", overPct: 33.3 },
]

const todayMatchups = [
  {
    away: "NYY", home: "BOS", awayColor: "#003087", homeColor: "#BD3039",
    time: "7:05 PM",
    awayPitcher: "Cole (5-1, 1.89)",
    homePitcher: "Pivetta (2-3, 4.12)",
    analysis: "Cole ha dominado a Boston en sus últimas 5 salidas. Ventaja clara para New York con el mejor abridor de la liga.",
  },
  {
    away: "LAD", home: "SF", awayColor: "#005A9C", homeColor: "#FD5A1E",
    time: "9:45 PM",
    awayPitcher: "Glasnow (4-1, 2.45)",
    homePitcher: "Webb (3-2, 3.10)",
    analysis: "Duelo de pitcheo de calidad. Webb ha sido fuerte en casa pero el lineup de los Dodgers es elite contra derechos.",
  },
  {
    away: "ATL", home: "NYM", awayColor: "#CE1141", homeColor: "#002D72",
    time: "7:10 PM",
    awayPitcher: "Strider (4-1, 2.05)",
    homePitcher: "Senga (2-2, 3.55)",
    analysis: "Strider viene imparable con 42 K en su último mes. Los Mets han tenido problemas contra fastballs de alta velocidad.",
  },
  {
    away: "HOU", home: "TEX", awayColor: "#002D62", homeColor: "#C0111F",
    time: "8:10 PM",
    awayPitcher: "Valdez (3-2, 2.88)",
    homePitcher: "Eovaldi (2-3, 3.92)",
    analysis: "Rivalidad texana siempre competitiva. Valdez tiene ventaja en la loma pero Arlington favorece la ofensiva.",
  },
]

export default function TrendsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <h1 className="font-heading text-3xl font-bold text-[#F5C842]">TENDENCIAS</h1>

      {/* Hot teams */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">EQUIPOS CALIENTES &#x1F525;</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {hotTeams.map((t, i) => (
            <div
              key={t.team}
              className={cn(
                "relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4",
                i === 0 && "border-[#F5C842]"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex size-12 items-center justify-center rounded-full text-[11px] font-bold text-white border-2 border-[#8B7355]"
                  style={{ backgroundColor: t.color }}
                >
                  {t.team}
                </div>
                <span className="font-display text-xs text-[#8B7355]">{t.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#3D2B1F]">{t.last10}</span>
                  <span className="bg-[#2E7D32] text-white font-display text-[10px] px-2 py-0.5 rounded-sm">{t.streak}</span>
                </div>
                <span className="font-mono text-xs text-[#2E7D32] font-bold">{t.runDiff}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dominant pitchers */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">PITCHERS DOMINANTES</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {topPitchers.map((p, i) => (
            <div key={p.name} className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="font-mono text-xs text-[#8B7355]">#{i + 1}</span>
                <span className="font-heading font-bold text-sm text-[#3D2B1F]">{p.name}</span>
                <span className="font-display text-xs text-[#8B7355]">{p.team}</span>
                <div className="grid grid-cols-3 w-full gap-1 text-center border-t border-[#8B7355]/30 pt-2 mt-1">
                  <div>
                    <p className="font-display text-[9px] uppercase text-[#8B7355]">ERA</p>
                    <p className="font-mono text-sm font-bold text-[#2E7D32]">{p.era}</p>
                  </div>
                  <div>
                    <p className="font-display text-[9px] uppercase text-[#8B7355]">WHIP</p>
                    <p className="font-mono text-sm font-bold text-[#3D2B1F]">{p.whip}</p>
                  </div>
                  <div>
                    <p className="font-display text-[9px] uppercase text-[#8B7355]">K/9</p>
                    <p className="font-mono text-sm font-bold text-[#3D2B1F]">{p.kPer9}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Betting trends */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">TENDENCIAS DE APUESTA</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Run line */}
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-5">
            <h3 className="font-heading font-bold text-sm text-[#3D2B1F] mb-4">% Cobertura de Run Line</h3>
            <div className="space-y-3">
              {runLineTrends.map((t) => (
                <div key={t.team} className="flex items-center gap-3">
                  <span className="w-10 font-mono text-sm font-bold text-[#0D2240]">{t.team}</span>
                  <div className="flex-1 h-3 bg-[#8B7355]/20 rounded-sm overflow-hidden">
                    <div className="h-full bg-[#C41E3A] rounded-sm" style={{ width: `${t.coverPct}%` }} />
                  </div>
                  <span className="w-14 text-right font-mono text-sm font-bold text-[#3D2B1F]">{t.coverPct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Over/Under */}
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-5">
            <h3 className="font-heading font-bold text-sm text-[#3D2B1F] mb-4">Tendencias Over / Under</h3>
            <div className="space-y-3">
              {overUnderTrends.map((t) => {
                const underPct = 100 - t.overPct
                return (
                  <div key={t.team} className="flex items-center gap-3">
                    <span className="w-10 font-mono text-sm font-bold text-[#0D2240]">{t.team}</span>
                    <div className="flex-1 flex h-3 rounded-sm overflow-hidden">
                      <div className="bg-[#2E7D32]" style={{ width: `${t.overPct}%` }} />
                      <div className="bg-[#C62828]" style={{ width: `${underPct}%` }} />
                    </div>
                    <div className="flex gap-2 font-mono text-xs font-bold">
                      <span className="text-[#2E7D32]">O {t.overPct}%</span>
                      <span className="text-[#C62828]">U {underPct.toFixed(1)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <ResponsibleGamingNotice className="mt-2" />
      </section>

      {/* Today's matchups */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">MATCHUPS DEL DÍA</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {todayMatchups.map((m) => (
            <div key={`${m.away}-${m.home}`} className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
              <div className="absolute top-[5px] left-[5px] w-3 h-3 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
              <div className="absolute top-[5px] right-[5px] w-3 h-3 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full text-[9px] font-bold text-white border border-[#8B7355]" style={{ backgroundColor: m.awayColor }}>
                      {m.away}
                    </div>
                    <span className="font-display text-xs text-[#8B7355]">vs</span>
                    <div className="flex size-8 items-center justify-center rounded-full text-[9px] font-bold text-white border border-[#8B7355]" style={{ backgroundColor: m.homeColor }}>
                      {m.home}
                    </div>
                  </div>
                  <span className="font-display text-xs text-[#8B7355]">{m.time}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0D2240]/5 border border-[#8B7355]/30 rounded-sm p-2">
                    <p className="font-display text-[9px] uppercase text-[#8B7355]">Abridor {m.away}</p>
                    <p className="font-sans text-[#3D2B1F] font-medium">{m.awayPitcher}</p>
                  </div>
                  <div className="bg-[#0D2240]/5 border border-[#8B7355]/30 rounded-sm p-2">
                    <p className="font-display text-[9px] uppercase text-[#8B7355]">Abridor {m.home}</p>
                    <p className="font-sans text-[#3D2B1F] font-medium">{m.homePitcher}</p>
                  </div>
                </div>
                <p className="font-sans text-xs text-[#3D2B1F]/70 italic">{m.analysis}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
