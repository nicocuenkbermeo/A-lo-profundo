"use client"

import { TipsterProfile, type TipsterData } from "@/components/rachas/TipsterProfile"
import { Leaderboard, type LeaderboardEntry } from "@/components/rachas/Leaderboard"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const tipsters: TipsterData[] = [
  { id: "1", name: "El Profeta", emoji: "\u26be", streak: 8, record: "52-18", winPct: 74.3, roi: 22.1, profit: 38.5 },
  { id: "2", name: "BatFlip King", emoji: "\ud83d\udc51", streak: 5, record: "44-21", winPct: 67.7, roi: 16.2, profit: 28.3 },
  { id: "3", name: "La M\u00e1quina", emoji: "\u2699\ufe0f", streak: 3, record: "38-20", winPct: 65.5, roi: 13.8, profit: 22.1 },
  { id: "4", name: "El Zurdo", emoji: "\ud83e\udde4", streak: 2, record: "32-22", winPct: 59.3, roi: 8.4, profit: 14.2 },
  { id: "5", name: "Sabermetrics Joe", emoji: "\ud83d\udcca", streak: 0, record: "28-25", winPct: 52.8, roi: 3.2, profit: 5.1 },
  { id: "6", name: "El Veterano", emoji: "\ud83c\udfc6", streak: 0, record: "24-22", winPct: 52.2, roi: 1.5, profit: 2.3 },
  { id: "7", name: "Radar Gun", emoji: "\ud83d\udce1", streak: 0, record: "20-25", winPct: 44.4, roi: -8.3, profit: -11.2 },
  { id: "8", name: "El Novato", emoji: "\ud83c\udf1f", streak: 0, record: "15-22", winPct: 40.5, roi: -14.8, profit: -15.1 },
]

const leaderboardData: LeaderboardEntry[] = tipsters.map((t, i) => ({
  rank: i + 1,
  name: t.name,
  emoji: t.emoji,
  streak: t.streak,
  bestStreak: [14, 9, 7, 5, 4, 3, 3, 2][i],
  wins: parseInt(t.record.split("-")[0]),
  losses: parseInt(t.record.split("-")[1]),
  winPct: t.winPct,
  roi: t.roi,
  profit: t.profit,
}))

const hotTipsters = tipsters.filter((t) => t.streak >= 3)

const profitChart = [
  { name: "Sem 1", profit: 5.2 },
  { name: "Sem 2", profit: 9.8 },
  { name: "Sem 3", profit: 8.1 },
  { name: "Sem 4", profit: 14.5 },
  { name: "Sem 5", profit: 19.2 },
  { name: "Sem 6", profit: 24.8 },
  { name: "Sem 7", profit: 22.3 },
  { name: "Sem 8", profit: 29.1 },
  { name: "Sem 9", profit: 33.6 },
  { name: "Sem 10", profit: 38.5 },
]

export function RachasPageClient() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      <h1 className="font-heading text-3xl font-bold text-[#F5C842]">RACHAS & LEADERBOARD</h1>

      {/* Hot streaks section */}
      {hotTipsters.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">
            RACHAS EN FUEGO &#x1F525;
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-3">
            {hotTipsters.map((t) => (
              <TipsterProfile key={t.id} tipster={t} />
            ))}
          </div>
        </section>
      )}

      {/* Leaderboard */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">CLASIFICACI\u00d3N GENERAL</h2>
        <Leaderboard data={leaderboardData} />
      </section>

      {/* Profit chart */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">EVOLUCI\u00d3N DE PROFIT</h2>
        <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4">
          <div className="absolute top-[6px] left-[6px] w-4 h-4 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
          <div className="absolute top-[6px] right-[6px] w-4 h-4 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
          <p className="font-display text-xs uppercase tracking-wider text-[#8B7355] mb-3">
            El Profeta - Profit acumulado (unidades)
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#8B7355" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8B7355", fontFamily: "var(--font-mono)" }} stroke="#8B7355" />
                <YAxis tick={{ fontSize: 11, fill: "#8B7355", fontFamily: "var(--font-mono)" }} stroke="#8B7355" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FDF6E3",
                    borderColor: "#8B7355",
                    borderWidth: 2,
                    borderRadius: 2,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "#3D2B1F",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#C41E3A"
                  strokeWidth={3}
                  dot={{ fill: "#F5C842", stroke: "#C41E3A", strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  )
}
