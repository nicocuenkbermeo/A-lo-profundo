"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PlayerCard } from "@/components/stats/PlayerCard"
import type { StandingRow, LeaderRow } from "@/lib/mlb-api"

const tabs = [
  { key: "equipos", label: "Equipos" },
  { key: "bateadores", label: "Bateadores" },
  { key: "pitchers", label: "Pitchers" },
] as const

type TabKey = (typeof tabs)[number]["key"]

interface StatsHubProps {
  standings: StandingRow[];
  leaders: { avg: LeaderRow[]; hr: LeaderRow[]; era: LeaderRow[] };
}

function leaderToPlayerCard(l: LeaderRow, statLabel: string, idx: number) {
  return {
    id: `${statLabel}-${idx}`,
    name: l.name,
    team: l.teamAbbr,
    teamColor: "#0D2240",
    position: "",
    number: idx + 1,
    stats: [{ label: statLabel, value: l.value }],
  };
}

export function StatsHub({ standings, leaders }: StatsHubProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("equipos")

  const leagueLeaders = [
    { category: "LIDER AVG", player: leaders.avg[0]?.name ?? "—", team: leaders.avg[0]?.teamAbbr ?? "", value: leaders.avg[0]?.value ?? "—" },
    { category: "LIDER HR", player: leaders.hr[0]?.name ?? "—", team: leaders.hr[0]?.teamAbbr ?? "", value: leaders.hr[0]?.value ?? "—" },
    { category: "LIDER ERA", player: leaders.era[0]?.name ?? "—", team: leaders.era[0]?.teamAbbr ?? "", value: leaders.era[0]?.value ?? "—" },
  ]

  const topBatters = leaders.avg.map((l, i) => leaderToPlayerCard(l, "AVG", i))
  const topPitchers = leaders.era.map((l, i) => leaderToPlayerCard(l, "ERA", i))
  const topTeams = standings.slice(0, 5).map((s) => ({
    name: s.name,
    abbr: s.abbr,
    w: s.wins,
    l: s.losses,
    pct: s.pct,
    color: "#0D2240",
  }))

  return (
    <div className="space-y-8">
      {/* ── League Leaders ── */}
      <div>
        <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wider text-xs text-[#8B7355] mb-3">
          Lideres de Liga
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {leagueLeaders.map((leader) => (
            <div
              key={leader.category}
              className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 overflow-hidden"
            >
              {/* Corner ornaments */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#8B7355]/40" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#8B7355]/40" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#8B7355]/40" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#8B7355]/40" />

              <div className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-wider text-[#8B7355]">
                {leader.category}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-3xl font-bold text-[#C41E3A] mt-1">
                {leader.value}
              </div>
              <div className="font-[family-name:var(--font-heading)] font-bold text-[#3D2B1F] text-sm mt-1">
                {leader.player}
              </div>
              <div className="font-[family-name:var(--font-display)] text-xs text-[#8B7355]">
                {leader.team}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vintage Paper Tabs ── */}
      <div className="flex gap-0 border-b-[3px] border-[#8B7355]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-3 text-sm font-[family-name:var(--font-display)] uppercase tracking-wider transition-colors border-[3px] border-b-0 rounded-t-sm -mb-[3px]",
              activeTab === tab.key
                ? "bg-[#FDF6E3] border-[#8B7355] text-[#0D2240] font-bold"
                : "bg-[#F5E6C8]/50 border-transparent text-[#8B7355] hover:text-[#3D2B1F] hover:bg-[#F5E6C8]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "equipos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-heading)] text-[#F5C842] text-xl font-bold">Clasificacion</h2>
            <Link
              href="/stats/teams"
              className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[#C41E3A] hover:text-[#0D2240] transition-colors"
            >
              Ver todo &rarr;
            </Link>
          </div>

          {/* Mini vintage standings table */}
          <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0D2240]">
                  <th className="text-[#F5C842] font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-4 py-2.5 text-left">#</th>
                  <th className="text-[#F5C842] font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-4 py-2.5 text-left">Equipo</th>
                  <th className="text-[#F5C842] font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-4 py-2.5 text-left">W</th>
                  <th className="text-[#F5C842] font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-4 py-2.5 text-left">L</th>
                  <th className="text-[#F5C842] font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-4 py-2.5 text-left">PCT</th>
                </tr>
              </thead>
              <tbody>
                {topTeams.map((t, idx) => (
                  <tr
                    key={t.abbr}
                    className={cn(
                      "hover:bg-[#EDD9B3] border-b border-[#8B7355]/20 transition-colors",
                      idx % 2 === 0 ? "bg-[#FDF6E3]" : "bg-[#F5E6C8]"
                    )}
                  >
                    <td className="font-[family-name:var(--font-mono)] text-sm text-[#8B7355] px-4 py-2.5">{idx + 1}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                        <span className="font-[family-name:var(--font-heading)] font-bold text-[#3D2B1F] text-sm">{t.name}</span>
                        <span className="font-[family-name:var(--font-display)] text-[10px] text-[#8B7355]">{t.abbr}</span>
                      </div>
                    </td>
                    <td className="font-[family-name:var(--font-mono)] text-sm text-[#3D2B1F] px-4 py-2.5">{t.w}</td>
                    <td className="font-[family-name:var(--font-mono)] text-sm text-[#3D2B1F] px-4 py-2.5">{t.l}</td>
                    <td className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#0D2240] px-4 py-2.5">{t.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "bateadores" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-heading)] text-[#F5C842] text-xl font-bold">Mejores Bateadores</h2>
            <Link
              href="/stats/players"
              className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[#C41E3A] hover:text-[#0D2240] transition-colors"
            >
              Ver todo &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {topBatters.map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "pitchers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-heading)] text-[#F5C842] text-xl font-bold">Mejores Pitchers</h2>
            <Link
              href="/stats/players"
              className="font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[#C41E3A] hover:text-[#0D2240] transition-colors"
            >
              Ver todo &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {topPitchers.map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
