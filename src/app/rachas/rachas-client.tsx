"use client"

import { TipsterProfile, type TipsterData } from "@/components/rachas/TipsterProfile"
import { Leaderboard, type LeaderboardEntry } from "@/components/rachas/Leaderboard"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Trophy } from "lucide-react"
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
  { id: "1", name: "Carlos Rivera", initials: "CR", streak: 7, record: "45-18", winPct: 71.4, roi: 18.5, profit: 32.4 },
  { id: "2", name: "Maria Lopez", initials: "ML", streak: 4, record: "38-22", winPct: 63.3, roi: 12.1, profit: 21.7 },
  { id: "3", name: "Ana Gutierrez", initials: "AG", streak: 3, record: "30-20", winPct: 60.0, roi: 9.8, profit: 14.5 },
  { id: "4", name: "Diego Martinez", initials: "DM", streak: 0, record: "28-25", winPct: 52.8, roi: 3.2, profit: 5.1 },
  { id: "5", name: "Roberto Sanchez", initials: "RS", streak: 0, record: "22-23", winPct: 48.9, roi: -2.4, profit: -3.8 },
  { id: "6", name: "Laura Torres", initials: "LT", streak: 0, record: "18-20", winPct: 47.4, roi: -5.1, profit: -7.2 },
  { id: "7", name: "Pedro Ramirez", initials: "PR", streak: 0, record: "15-22", winPct: 40.5, roi: -12.3, profit: -15.1 },
  { id: "8", name: "Sofia Herrera", initials: "SH", streak: 0, record: "12-18", winPct: 40.0, roi: -14.8, profit: -11.2 },
]

const leaderboardData: LeaderboardEntry[] = tipsters.map((t, i) => ({
  rank: i + 1,
  name: t.name,
  initials: t.initials,
  streak: t.streak,
  bestStreak: [12, 8, 6, 5, 4, 3, 3, 2][i],
  wins: parseInt(t.record.split("-")[0]),
  losses: parseInt(t.record.split("-")[1]),
  winPct: t.winPct,
  roi: t.roi,
  profit: t.profit,
}))

const hotTipsters = tipsters.filter((t) => t.streak >= 3)

const profitChart = [
  { name: "Sem 1", profit: 5.2 },
  { name: "Sem 2", profit: 8.1 },
  { name: "Sem 3", profit: 6.4 },
  { name: "Sem 4", profit: 12.8 },
  { name: "Sem 5", profit: 18.3 },
  { name: "Sem 6", profit: 22.1 },
  { name: "Sem 7", profit: 19.5 },
  { name: "Sem 8", profit: 26.7 },
  { name: "Sem 9", profit: 29.4 },
  { name: "Sem 10", profit: 32.4 },
]

export function RachasPageClient() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-8">
      <h1 className="text-2xl font-bold">Rachas & Leaderboard</h1>

      {/* Hot streaks section */}
      {hotTipsters.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Flame className="size-5 fill-primary text-primary" />
            Rachas en Fuego
          </h2>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-3">
              {hotTipsters.map((t) => (
                <TipsterProfile key={t.id} tipster={t} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      )}

      {/* Leaderboard */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Trophy className="size-5 text-primary" />
          Clasificacion General
        </h2>
        <Leaderboard data={leaderboardData} />
      </section>

      {/* Profit chart */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Evolucion de Profit - Top Tipster</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Carlos Rivera - Profit acumulado (unidades)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
