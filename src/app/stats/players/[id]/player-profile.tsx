"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { StatChart } from "@/components/stats/StatChart"
import { SplitsTable } from "@/components/stats/SplitsTable"

interface PlayerData {
  id: string
  name: string
  team: string
  teamFull: string
  teamColor: string
  position: string
  number: number
  bats: string
  throws: string
  seasonStats: { label: string; value: string }[]
  last15: { name: string; value: number }[]
  gameLog: {
    date: string
    opp: string
    ab: number
    h: number
    hr: number
    rbi: number
    bb: number
    k: number
    avg: string
  }[]
  splits: {
    handedness: { label: string; avg: string; obp: string; slg: string; ops: string; ab: number; h: number; hr: number; rbi: number }[]
    homeAway: { label: string; avg: string; obp: string; slg: string; ops: string; ab: number; h: number; hr: number; rbi: number }[]
    monthly: { label: string; avg: string; obp: string; slg: string; ops: string; ab: number; h: number; hr: number; rbi: number }[]
  }
}

const mockPlayers: Record<string, PlayerData> = {
  "judge-1": {
    id: "judge-1",
    name: "Aaron Judge",
    team: "NYY",
    teamFull: "New York Yankees",
    teamColor: "#003087",
    position: "RF",
    number: 99,
    bats: "R",
    throws: "R",
    seasonStats: [
      { label: "AVG", value: ".322" },
      { label: "HR", value: "58" },
      { label: "RBI", value: "144" },
      { label: "OPS", value: "1.159" },
    ],
    last15: [
      { name: "G1", value: 2 }, { name: "G2", value: 1 }, { name: "G3", value: 3 },
      { name: "G4", value: 0 }, { name: "G5", value: 2 }, { name: "G6", value: 1 },
      { name: "G7", value: 4 }, { name: "G8", value: 1 }, { name: "G9", value: 2 },
      { name: "G10", value: 0 }, { name: "G11", value: 3 }, { name: "G12", value: 1 },
      { name: "G13", value: 2 }, { name: "G14", value: 1 }, { name: "G15", value: 3 },
    ],
    gameLog: [
      { date: "Sep 28", opp: "PIT", ab: 4, h: 2, hr: 1, rbi: 3, bb: 1, k: 0, avg: ".322" },
      { date: "Sep 27", opp: "PIT", ab: 3, h: 1, hr: 0, rbi: 0, bb: 2, k: 1, avg: ".320" },
      { date: "Sep 26", opp: "PIT", ab: 5, h: 3, hr: 1, rbi: 2, bb: 0, k: 1, avg: ".319" },
      { date: "Sep 25", opp: "@OAK", ab: 4, h: 0, hr: 0, rbi: 0, bb: 0, k: 2, avg: ".317" },
      { date: "Sep 24", opp: "@OAK", ab: 4, h: 2, hr: 1, rbi: 4, bb: 1, k: 0, avg: ".319" },
      { date: "Sep 23", opp: "@OAK", ab: 3, h: 1, hr: 0, rbi: 1, bb: 2, k: 1, avg: ".318" },
      { date: "Sep 22", opp: "BAL", ab: 4, h: 1, hr: 0, rbi: 0, bb: 0, k: 2, avg: ".318" },
      { date: "Sep 21", opp: "BAL", ab: 5, h: 4, hr: 2, rbi: 5, bb: 0, k: 0, avg: ".319" },
      { date: "Sep 20", opp: "BAL", ab: 4, h: 1, hr: 0, rbi: 0, bb: 1, k: 1, avg: ".316" },
      { date: "Sep 19", opp: "@SEA", ab: 3, h: 2, hr: 1, rbi: 3, bb: 1, k: 0, avg: ".316" },
    ],
    splits: {
      handedness: [
        { label: "vs RHP", avg: ".310", obp: ".445", slg: ".680", ops: "1.125", ab: 380, h: 118, hr: 36, rbi: 88 },
        { label: "vs LHP", avg: ".345", obp: ".482", slg: ".740", ops: "1.222", ab: 170, h: 59, hr: 22, rbi: 56 },
      ],
      homeAway: [
        { label: "Local", avg: ".340", obp: ".470", slg: ".730", ops: "1.200", ab: 280, h: 95, hr: 34, rbi: 82 },
        { label: "Visitante", avg: ".300", obp: ".442", slg: ".665", ops: "1.107", ab: 270, h: 81, hr: 24, rbi: 62 },
      ],
      monthly: [
        { label: "Abril", avg: ".295", obp: ".410", slg: ".620", ops: "1.030", ab: 88, h: 26, hr: 8, rbi: 18 },
        { label: "Mayo", avg: ".330", obp: ".460", slg: ".710", ops: "1.170", ab: 94, h: 31, hr: 10, rbi: 24 },
        { label: "Junio", avg: ".350", obp: ".490", slg: ".780", ops: "1.270", ab: 100, h: 35, hr: 14, rbi: 32 },
        { label: "Julio", avg: ".310", obp: ".440", slg: ".680", ops: "1.120", ab: 90, h: 28, hr: 9, rbi: 26 },
        { label: "Agosto", avg: ".305", obp: ".450", slg: ".670", ops: "1.120", ab: 98, h: 30, hr: 10, rbi: 28 },
        { label: "Septiembre", avg: ".342", obp: ".478", slg: ".745", ops: "1.223", ab: 80, h: 27, hr: 7, rbi: 16 },
      ],
    },
  },
}

function getPlayer(id: string): PlayerData {
  if (mockPlayers[id]) return mockPlayers[id]
  return {
    ...mockPlayers["judge-1"],
    id,
    name: id.replace(/-\d+$/, "").split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
  }
}

export function PlayerProfile({ playerId }: { playerId: string }) {
  const player = getPlayer(playerId)
  const initials = player.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
  const gameLogHeaders = ["Fecha", "Opp", "AB", "H", "HR", "RBI", "BB", "K", "AVG"]

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/stats/players"
        className="inline-flex items-center gap-1 font-[family-name:var(--font-display)] text-xs uppercase tracking-wider text-[#C41E3A] hover:text-[#0D2240] transition-colors"
      >
        &larr; Volver a Jugadores
      </Link>

      {/* ── Giant Vintage Baseball Card Header ── */}
      <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[6px_6px_0px_#5C4A32] rounded-sm overflow-hidden">
        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-[3px] border-t-[3px] border-[#8B7355]/40 z-10" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-[3px] border-t-[3px] border-[#8B7355]/40 z-10" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-[3px] border-b-[3px] border-[#8B7355]/40 z-10" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-[3px] border-b-[3px] border-[#8B7355]/40 z-10" />

        {/* Team-colored header band */}
        <div className="relative h-40 flex items-center gap-6 px-8" style={{ backgroundColor: player.teamColor }}>
          {/* Photo placeholder */}
          <div className="relative shrink-0 w-28 h-28 bg-white/10 border-[3px] border-white/20 rounded-sm flex items-center justify-center">
            <span className="text-white/20 text-5xl font-[family-name:var(--font-mono)] font-bold absolute right-1 bottom-0 leading-none">
              {player.number}
            </span>
            <span className="text-white text-4xl font-[family-name:var(--font-heading)] font-bold relative z-10">
              {initials}
            </span>
          </div>

          {/* Player info */}
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-white text-3xl font-bold tracking-tight">
              {player.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-[family-name:var(--font-display)] uppercase text-xs tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-sm">
                {player.position}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-[family-name:var(--font-display)] font-bold border border-white/30"
                  style={{ backgroundColor: player.teamColor }}
                >
                  {player.team}
                </span>
                <span className="text-white/80 text-sm font-[family-name:var(--font-sans)]">{player.teamFull}</span>
              </div>
              <span className="font-[family-name:var(--font-display)] text-xs text-white/60">
                Batea: {player.bats} | Lanza: {player.throws}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Season Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {player.seasonStats.map((stat) => (
          <div
            key={stat.label}
            className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 text-center border-t-4"
            style={{ borderTopColor: "#F5C842" }}
          >
            <div className="font-[family-name:var(--font-display)] text-[10px] uppercase tracking-wider text-[#8B7355]">
              {stat.label}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-4xl font-bold text-[#C41E3A] mt-1">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Trend Chart ── */}
      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
        <div className="bg-[#0D2240] px-4 py-2.5">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wider text-sm text-[#F5C842]">
            Hits en los ultimos 15 juegos
          </h2>
        </div>
        <div className="p-4">
          <StatChart data={player.last15} type="line" />
        </div>
      </div>

      {/* ── Game Log ── */}
      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
        <div className="bg-[#0D2240] px-4 py-2.5">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wider text-sm text-[#F5C842]">
            Registro de juegos recientes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0D2240]/80">
                {gameLogHeaders.map((h) => (
                  <th
                    key={h}
                    className="text-[#F5C842] font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-3 py-2.5 text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {player.gameLog.map((g, i) => (
                <tr
                  key={i}
                  className={cn(
                    "hover:bg-[#EDD9B3] border-b border-[#8B7355]/20 transition-colors",
                    i % 2 === 0 ? "bg-[#FDF6E3]" : "bg-[#F5E6C8]"
                  )}
                >
                  <td className="font-[family-name:var(--font-display)] text-sm text-[#3D2B1F] px-3 py-2">{g.date}</td>
                  <td className="font-[family-name:var(--font-display)] text-sm text-[#8B7355] px-3 py-2">{g.opp}</td>
                  <td className="font-[family-name:var(--font-mono)] text-sm text-[#3D2B1F] px-3 py-2">{g.ab}</td>
                  <td className={cn("font-[family-name:var(--font-mono)] text-sm px-3 py-2", g.h >= 3 ? "text-[#006400] font-bold" : "text-[#3D2B1F]")}>{g.h}</td>
                  <td className={cn("font-[family-name:var(--font-mono)] text-sm px-3 py-2", g.hr > 0 ? "text-[#C41E3A] font-bold" : "text-[#3D2B1F]")}>{g.hr}</td>
                  <td className="font-[family-name:var(--font-mono)] text-sm text-[#3D2B1F] px-3 py-2">{g.rbi}</td>
                  <td className="font-[family-name:var(--font-mono)] text-sm text-[#3D2B1F] px-3 py-2">{g.bb}</td>
                  <td className="font-[family-name:var(--font-mono)] text-sm text-[#3D2B1F] px-3 py-2">{g.k}</td>
                  <td className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#0D2240] px-3 py-2">{g.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Splits ── */}
      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
        <div className="bg-[#0D2240] px-4 py-2.5">
          <h2 className="font-[family-name:var(--font-display)] uppercase tracking-wider text-sm text-[#F5C842]">
            Splits
          </h2>
        </div>
        <div className="p-4">
          <SplitsTable splits={player.splits} />
        </div>
      </div>
    </div>
  )
}
