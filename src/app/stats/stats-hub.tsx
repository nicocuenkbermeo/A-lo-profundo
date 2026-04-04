"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, Users, Trophy, TrendingUp, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayerCard } from "@/components/stats/PlayerCard"

const tabs = [
  { key: "equipos", label: "Equipos", icon: Trophy },
  { key: "bateadores", label: "Bateadores", icon: Users },
  { key: "pitchers", label: "Pitchers", icon: BarChart3 },
] as const

type TabKey = (typeof tabs)[number]["key"]

const leagueLeaders = {
  batting: [
    { label: "AVG", player: "Luis Arraez", team: "SD", value: ".354" },
    { label: "HR", player: "Aaron Judge", team: "NYY", value: "58" },
    { label: "RBI", player: "Shohei Ohtani", team: "LAD", value: "130" },
    { label: "SB", player: "Elly De La Cruz", team: "CIN", value: "67" },
    { label: "OPS", player: "Aaron Judge", team: "NYY", value: "1.159" },
  ],
  pitching: [
    { label: "ERA", player: "Tarik Skubal", team: "DET", value: "2.39" },
    { label: "W", player: "Chris Sale", team: "ATL", value: "18" },
    { label: "K", player: "Tarik Skubal", team: "DET", value: "228" },
    { label: "WHIP", player: "Tarik Skubal", team: "DET", value: "0.92" },
    { label: "SV", player: "Emmanuel Clase", team: "CLE", value: "47" },
  ],
}

const topBatters = [
  {
    id: "judge-1",
    name: "Aaron Judge",
    team: "NYY",
    position: "RF",
    number: 99,
    stats: [
      { label: "AVG", value: ".322" },
      { label: "HR", value: "58" },
      { label: "RBI", value: "144" },
      { label: "OPS", value: "1.159" },
    ],
  },
  {
    id: "ohtani-1",
    name: "Shohei Ohtani",
    team: "LAD",
    position: "DH",
    number: 17,
    stats: [
      { label: "AVG", value: ".310" },
      { label: "HR", value: "54" },
      { label: "RBI", value: "130" },
      { label: "OPS", value: "1.036" },
    ],
  },
  {
    id: "soto-1",
    name: "Juan Soto",
    team: "NYM",
    position: "LF",
    number: 22,
    stats: [
      { label: "AVG", value: ".288" },
      { label: "HR", value: "41" },
      { label: "RBI", value: "109" },
      { label: "OPS", value: ".985" },
    ],
  },
]

const topPitchers = [
  {
    id: "skubal-1",
    name: "Tarik Skubal",
    team: "DET",
    position: "SP",
    number: 29,
    stats: [
      { label: "ERA", value: "2.39" },
      { label: "W", value: "18" },
      { label: "K", value: "228" },
      { label: "WHIP", value: "0.92" },
    ],
  },
  {
    id: "sale-1",
    name: "Chris Sale",
    team: "ATL",
    position: "SP",
    number: 51,
    stats: [
      { label: "ERA", value: "2.38" },
      { label: "W", value: "18" },
      { label: "K", value: "225" },
      { label: "WHIP", value: "0.95" },
    ],
  },
  {
    id: "webb-1",
    name: "Logan Webb",
    team: "SF",
    position: "SP",
    number: 62,
    stats: [
      { label: "ERA", value: "2.95" },
      { label: "W", value: "15" },
      { label: "K", value: "196" },
      { label: "WHIP", value: "1.05" },
    ],
  },
]

const topTeams = [
  { name: "Los Angeles Dodgers", abbr: "LAD", w: 98, l: 64, pct: ".605" },
  { name: "Philadelphia Phillies", abbr: "PHI", w: 95, l: 67, pct: ".586" },
  { name: "New York Yankees", abbr: "NYY", w: 94, l: 68, pct: ".580" },
]

export function StatsHub() {
  const [activeTab, setActiveTab] = useState<TabKey>("equipos")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Estadísticas</h1>
        <p className="text-muted-foreground mt-1">
          Estadísticas completas de la temporada MLB 2024
        </p>
      </div>

      {/* League Leaders Scroll */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Líderes de Liga
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {[...leagueLeaders.batting, ...leagueLeaders.pitching].map(
            (leader, i) => (
              <Card key={i} className="shrink-0 min-w-[160px]">
                <CardContent className="py-0">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {leader.label}
                  </div>
                  <div className="font-mono text-xl font-bold text-amber-500">
                    {leader.value}
                  </div>
                  <div className="text-sm text-foreground font-medium truncate">
                    {leader.player}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {leader.team}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-amber-500 text-amber-500"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "equipos" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Clasificación</h2>
            <Link href="/stats/teams">
              <Button variant="ghost" size="sm">
                Ver todo <ArrowRight className="size-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3">
            {topTeams.map((t) => (
              <div
                key={t.abbr}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <span className="font-semibold">{t.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {t.abbr}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg font-bold">
                    {t.w}-{t.l}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {t.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "bateadores" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mejores Bateadores</h2>
            <Link href="/stats/players">
              <Button variant="ghost" size="sm">
                Ver todo <ArrowRight className="size-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3">
            {topBatters.map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "pitchers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mejores Pitchers</h2>
            <Link href="/stats/players">
              <Button variant="ghost" size="sm">
                Ver todo <ArrowRight className="size-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3">
            {topPitchers.map((p) => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
