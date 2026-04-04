"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatChart } from "@/components/stats/StatChart"
import { SplitsTable } from "@/components/stats/SplitsTable"

interface PlayerData {
  id: string
  name: string
  team: string
  teamFull: string
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

// Default fallback for any player ID
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

  return (
    <div className="space-y-8">
      <Link href="/stats/players">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4 mr-1" /> Volver
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-2xl font-bold text-amber-500">
          {initials}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{player.name}</h1>
            <Badge variant="outline" className="text-xs">#{player.number}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-muted-foreground">{player.teamFull}</span>
            <Badge variant="secondary">{player.position}</Badge>
            <span className="text-sm text-muted-foreground">
              Batea: {player.bats} | Lanza: {player.throws}
            </span>
          </div>
        </div>
      </div>

      {/* Season Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {player.seasonStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-0 text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="font-mono text-3xl font-bold text-amber-500">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Last 15 Games Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Hits en los últimos 15 juegos</CardTitle>
        </CardHeader>
        <CardContent>
          <StatChart data={player.last15} type="line" />
        </CardContent>
      </Card>

      {/* Game Log */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de juegos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-card hover:bg-card border-border">
                  {["Fecha", "Opp", "AB", "H", "HR", "RBI", "BB", "K", "AVG"].map((h) => (
                    <TableHead key={h} className="text-xs text-muted-foreground uppercase tracking-wider">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {player.gameLog.map((g, i) => (
                  <TableRow key={i} className="border-border/50 hover:bg-muted/30">
                    <TableCell className="text-sm">{g.date}</TableCell>
                    <TableCell className="text-sm">{g.opp}</TableCell>
                    <TableCell className="font-mono text-sm">{g.ab}</TableCell>
                    <TableCell className={cn("font-mono text-sm", g.h >= 3 && "text-green-400 font-semibold")}>{g.h}</TableCell>
                    <TableCell className={cn("font-mono text-sm", g.hr > 0 && "text-amber-500 font-semibold")}>{g.hr}</TableCell>
                    <TableCell className="font-mono text-sm">{g.rbi}</TableCell>
                    <TableCell className="font-mono text-sm">{g.bb}</TableCell>
                    <TableCell className="font-mono text-sm">{g.k}</TableCell>
                    <TableCell className="font-mono text-sm font-semibold">{g.avg}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Splits */}
      <Card>
        <CardHeader>
          <CardTitle>Splits</CardTitle>
        </CardHeader>
        <CardContent>
          <SplitsTable splits={player.splits} />
        </CardContent>
      </Card>
    </div>
  )
}
