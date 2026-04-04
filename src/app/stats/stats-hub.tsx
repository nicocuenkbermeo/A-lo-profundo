"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PlayerCard } from "@/components/stats/PlayerCard"

const tabs = [
  { key: "equipos", label: "Equipos" },
  { key: "bateadores", label: "Bateadores" },
  { key: "pitchers", label: "Pitchers" },
] as const

type TabKey = (typeof tabs)[number]["key"]

const leagueLeaders = [
  { category: "LIDER AVG", player: "Luis Arraez", team: "SD", value: ".354", stat: "AVG" },
  { category: "LIDER HR", player: "Aaron Judge", team: "NYY", value: "58", stat: "HR" },
  { category: "LIDER ERA", player: "Tarik Skubal", team: "DET", value: "2.39", stat: "ERA" },
]

const topBatters = [
  { id: "judge-1", name: "Aaron Judge", team: "NYY", teamColor: "#003087", position: "RF", number: 99, stats: [{ label: "AVG", value: ".322" }, { label: "HR", value: "58" }, { label: "RBI", value: "144" }, { label: "OPS", value: "1.159" }] },
  { id: "ohtani-1", name: "Shohei Ohtani", team: "LAD", teamColor: "#005A9C", position: "DH", number: 17, stats: [{ label: "AVG", value: ".310" }, { label: "HR", value: "54" }, { label: "RBI", value: "130" }, { label: "OPS", value: "1.036" }] },
  { id: "soto-1", name: "Juan Soto", team: "NYM", teamColor: "#002D72", position: "LF", number: 22, stats: [{ label: "AVG", value: ".288" }, { label: "HR", value: "41" }, { label: "RBI", value: "109" }, { label: "OPS", value: ".985" }] },
  { id: "witt-1", name: "Bobby Witt Jr.", team: "KC", teamColor: "#004687", position: "SS", number: 7, stats: [{ label: "AVG", value: ".332" }, { label: "HR", value: "32" }, { label: "RBI", value: "106" }, { label: "OPS", value: ".977" }] },
  { id: "arraez-1", name: "Luis Arraez", team: "SD", teamColor: "#2F241D", position: "1B", number: 4, stats: [{ label: "AVG", value: ".354" }, { label: "HR", value: "8" }, { label: "RBI", value: "58" }, { label: "OPS", value: ".859" }] },
]

const topPitchers = [
  { id: "skubal-1", name: "Tarik Skubal", team: "DET", teamColor: "#0C2340", position: "SP", number: 29, stats: [{ label: "ERA", value: "2.39" }, { label: "W", value: "18" }, { label: "K", value: "228" }, { label: "WHIP", value: "0.92" }] },
  { id: "sale-1", name: "Chris Sale", team: "ATL", teamColor: "#CE1141", position: "SP", number: 51, stats: [{ label: "ERA", value: "2.38" }, { label: "W", value: "18" }, { label: "K", value: "225" }, { label: "WHIP", value: "0.95" }] },
  { id: "wheeler-1", name: "Zack Wheeler", team: "PHI", teamColor: "#E81828", position: "SP", number: 45, stats: [{ label: "ERA", value: "2.57" }, { label: "W", value: "16" }, { label: "K", value: "224" }, { label: "WHIP", value: "0.96" }] },
  { id: "webb-1", name: "Logan Webb", team: "SF", teamColor: "#FD5A1E", position: "SP", number: 62, stats: [{ label: "ERA", value: "2.95" }, { label: "W", value: "15" }, { label: "K", value: "196" }, { label: "WHIP", value: "1.05" }] },
  { id: "burns-1", name: "Corbin Burnes", team: "BAL", teamColor: "#DF4601", position: "SP", number: 39, stats: [{ label: "ERA", value: "2.92" }, { label: "W", value: "15" }, { label: "K", value: "181" }, { label: "WHIP", value: "1.10" }] },
]

const topTeams = [
  { name: "Los Angeles Dodgers", abbr: "LAD", w: 98, l: 64, pct: ".605", color: "#005A9C" },
  { name: "Philadelphia Phillies", abbr: "PHI", w: 95, l: 67, pct: ".586", color: "#E81828" },
  { name: "New York Yankees", abbr: "NYY", w: 94, l: 68, pct: ".580", color: "#003087" },
  { name: "Milwaukee Brewers", abbr: "MIL", w: 93, l: 69, pct: ".574", color: "#FFC52F" },
  { name: "Cleveland Guardians", abbr: "CLE", w: 92, l: 70, pct: ".568", color: "#00385D" },
]

export function StatsHub() {
  const [activeTab, setActiveTab] = useState<TabKey>("equipos")

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
