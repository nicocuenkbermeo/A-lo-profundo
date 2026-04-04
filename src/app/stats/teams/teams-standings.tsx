"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StatsTable } from "@/components/stats/StatsTable"

interface TeamStanding {
  team: string
  abbreviation: string
  division: string
  w: number
  l: number
  pct: string
  rs: number
  ra: number
  diff: string
  home: string
  away: string
  l10: string
  strk: string
  color: string
}

const teamsData: TeamStanding[] = [
  { team: "Los Angeles Dodgers", abbreviation: "LAD", division: "NL West", w: 98, l: 64, pct: ".605", rs: 842, ra: 675, diff: "+167", home: "55-26", away: "43-38", l10: "7-3", strk: "W4", color: "#005A9C" },
  { team: "Philadelphia Phillies", abbreviation: "PHI", division: "NL East", w: 95, l: 67, pct: ".586", rs: 799, ra: 680, diff: "+119", home: "52-29", away: "43-38", l10: "6-4", strk: "W2", color: "#E81828" },
  { team: "New York Yankees", abbreviation: "NYY", division: "AL East", w: 94, l: 68, pct: ".580", rs: 845, ra: 710, diff: "+135", home: "51-30", away: "43-38", l10: "5-5", strk: "L1", color: "#003087" },
  { team: "Cleveland Guardians", abbreviation: "CLE", division: "AL Central", w: 92, l: 70, pct: ".568", rs: 721, ra: 652, diff: "+69", home: "50-31", away: "42-39", l10: "7-3", strk: "W5", color: "#00385D" },
  { team: "Milwaukee Brewers", abbreviation: "MIL", division: "NL Central", w: 93, l: 69, pct: ".574", rs: 764, ra: 692, diff: "+72", home: "49-32", away: "44-37", l10: "6-4", strk: "W1", color: "#FFC52F" },
  { team: "Baltimore Orioles", abbreviation: "BAL", division: "AL East", w: 91, l: 71, pct: ".562", rs: 810, ra: 718, diff: "+92", home: "48-33", away: "43-38", l10: "5-5", strk: "L2", color: "#DF4601" },
  { team: "Houston Astros", abbreviation: "HOU", division: "AL West", w: 88, l: 74, pct: ".543", rs: 778, ra: 720, diff: "+58", home: "47-34", away: "41-40", l10: "6-4", strk: "W3", color: "#002D62" },
  { team: "San Diego Padres", abbreviation: "SD", division: "NL West", w: 89, l: 73, pct: ".549", rs: 750, ra: 698, diff: "+52", home: "48-33", away: "41-40", l10: "8-2", strk: "W6", color: "#2F241D" },
  { team: "Kansas City Royals", abbreviation: "KC", division: "AL Central", w: 86, l: 76, pct: ".531", rs: 738, ra: 710, diff: "+28", home: "46-35", away: "40-41", l10: "4-6", strk: "L3", color: "#004687" },
  { team: "Atlanta Braves", abbreviation: "ATL", division: "NL East", w: 89, l: 73, pct: ".549", rs: 780, ra: 712, diff: "+68", home: "47-34", away: "42-39", l10: "5-5", strk: "W1", color: "#CE1141" },
  { team: "Minnesota Twins", abbreviation: "MIN", division: "AL Central", w: 82, l: 80, pct: ".506", rs: 735, ra: 728, diff: "+7", home: "45-36", away: "37-44", l10: "5-5", strk: "L1", color: "#002B5C" },
  { team: "Detroit Tigers", abbreviation: "DET", division: "AL Central", w: 86, l: 76, pct: ".531", rs: 698, ra: 672, diff: "+26", home: "46-35", away: "40-41", l10: "7-3", strk: "W4", color: "#0C2340" },
  { team: "Arizona Diamondbacks", abbreviation: "ARI", division: "NL West", w: 89, l: 73, pct: ".549", rs: 812, ra: 754, diff: "+58", home: "46-35", away: "43-38", l10: "4-6", strk: "L2", color: "#A71930" },
  { team: "New York Mets", abbreviation: "NYM", division: "NL East", w: 89, l: 73, pct: ".549", rs: 772, ra: 718, diff: "+54", home: "45-36", away: "44-37", l10: "6-4", strk: "W2", color: "#002D72" },
  { team: "Boston Red Sox", abbreviation: "BOS", division: "AL East", w: 81, l: 81, pct: ".500", rs: 765, ra: 760, diff: "+5", home: "44-37", away: "37-44", l10: "5-5", strk: "W1", color: "#BD3039" },
  { team: "Seattle Mariners", abbreviation: "SEA", division: "AL West", w: 85, l: 77, pct: ".525", rs: 668, ra: 640, diff: "+28", home: "47-34", away: "38-43", l10: "3-7", strk: "L4", color: "#0C2C56" },
  { team: "Tampa Bay Rays", abbreviation: "TB", division: "AL East", w: 80, l: 82, pct: ".494", rs: 710, ra: 722, diff: "-12", home: "43-38", away: "37-44", l10: "4-6", strk: "L1", color: "#092C5C" },
  { team: "St. Louis Cardinals", abbreviation: "STL", division: "NL Central", w: 83, l: 79, pct: ".512", rs: 712, ra: 698, diff: "+14", home: "44-37", away: "39-42", l10: "6-4", strk: "W2", color: "#C41E3A" },
  { team: "Cincinnati Reds", abbreviation: "CIN", division: "NL Central", w: 77, l: 85, pct: ".475", rs: 752, ra: 792, diff: "-40", home: "42-39", away: "35-46", l10: "5-5", strk: "L1", color: "#C6011F" },
  { team: "San Francisco Giants", abbreviation: "SF", division: "NL West", w: 80, l: 82, pct: ".494", rs: 698, ra: 712, diff: "-14", home: "43-38", away: "37-44", l10: "4-6", strk: "L2", color: "#FD5A1E" },
  { team: "Texas Rangers", abbreviation: "TEX", division: "AL West", w: 78, l: 84, pct: ".481", rs: 732, ra: 756, diff: "-24", home: "41-40", away: "37-44", l10: "5-5", strk: "W1", color: "#003278" },
  { team: "Toronto Blue Jays", abbreviation: "TOR", division: "AL East", w: 74, l: 88, pct: ".457", rs: 690, ra: 738, diff: "-48", home: "40-41", away: "34-47", l10: "3-7", strk: "L3", color: "#134A8E" },
  { team: "Pittsburgh Pirates", abbreviation: "PIT", division: "NL Central", w: 76, l: 86, pct: ".469", rs: 678, ra: 722, diff: "-44", home: "41-40", away: "35-46", l10: "4-6", strk: "L1", color: "#27251F" },
  { team: "Chicago Cubs", abbreviation: "CHC", division: "NL Central", w: 83, l: 79, pct: ".512", rs: 736, ra: 718, diff: "+18", home: "44-37", away: "39-42", l10: "6-4", strk: "W3", color: "#0E3386" },
  { team: "Los Angeles Angels", abbreviation: "LAA", division: "AL West", w: 63, l: 99, pct: ".389", rs: 634, ra: 808, diff: "-174", home: "35-46", away: "28-53", l10: "3-7", strk: "L5", color: "#BA0021" },
  { team: "Washington Nationals", abbreviation: "WSH", division: "NL East", w: 71, l: 91, pct: ".438", rs: 668, ra: 748, diff: "-80", home: "38-43", away: "33-48", l10: "4-6", strk: "L2", color: "#AB0003" },
  { team: "Oakland Athletics", abbreviation: "OAK", division: "AL West", w: 69, l: 93, pct: ".426", rs: 630, ra: 764, diff: "-134", home: "37-44", away: "32-49", l10: "2-8", strk: "L6", color: "#003831" },
  { team: "Chicago White Sox", abbreviation: "CWS", division: "AL Central", w: 41, l: 121, pct: ".253", rs: 538, ra: 922, diff: "-384", home: "24-57", away: "17-64", l10: "1-9", strk: "L8", color: "#27251F" },
  { team: "Miami Marlins", abbreviation: "MIA", division: "NL East", w: 62, l: 100, pct: ".383", rs: 598, ra: 790, diff: "-192", home: "34-47", away: "28-53", l10: "3-7", strk: "L4", color: "#00A3E0" },
  { team: "Colorado Rockies", abbreviation: "COL", division: "NL West", w: 61, l: 101, pct: ".377", rs: 670, ra: 862, diff: "-192", home: "36-45", away: "25-56", l10: "2-8", strk: "L3", color: "#33006F" },
]

const divisions = ["Todos", "AL East", "AL Central", "AL West", "NL East", "NL Central", "NL West"]

const columns: ColumnDef<TeamStanding>[] = [
  {
    accessorKey: "team",
    header: "Equipo",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 rounded-full shrink-0"
          style={{ backgroundColor: row.original.color }}
        />
        <span className="font-medium">{row.original.team}</span>
        <span className="text-xs text-muted-foreground">{row.original.abbreviation}</span>
      </div>
    ),
    enableSorting: false,
  },
  { accessorKey: "w", header: "W", cell: ({ getValue }) => <span className="font-mono">{getValue<number>()}</span> },
  { accessorKey: "l", header: "L", cell: ({ getValue }) => <span className="font-mono">{getValue<number>()}</span> },
  { accessorKey: "pct", header: "PCT", cell: ({ getValue }) => <span className="font-mono font-semibold">{getValue<string>()}</span> },
  { accessorKey: "rs", header: "RS", cell: ({ getValue }) => <span className="font-mono">{getValue<number>()}</span> },
  { accessorKey: "ra", header: "RA", cell: ({ getValue }) => <span className="font-mono">{getValue<number>()}</span> },
  {
    accessorKey: "diff",
    header: "DIFF",
    cell: ({ getValue }) => {
      const v = getValue<string>()
      return (
        <span className={cn("font-mono", v.startsWith("+") ? "text-green-400" : v.startsWith("-") ? "text-red-400" : "")}>
          {v}
        </span>
      )
    },
  },
  { accessorKey: "home", header: "HOME", cell: ({ getValue }) => <span className="font-mono">{getValue<string>()}</span> },
  { accessorKey: "away", header: "AWAY", cell: ({ getValue }) => <span className="font-mono">{getValue<string>()}</span> },
  { accessorKey: "l10", header: "L10", cell: ({ getValue }) => <span className="font-mono">{getValue<string>()}</span> },
  {
    accessorKey: "strk",
    header: "STRK",
    cell: ({ getValue }) => {
      const v = getValue<string>()
      return (
        <span className={cn("font-mono text-xs font-semibold", v.startsWith("W") ? "text-green-400" : "text-red-400")}>
          {v}
        </span>
      )
    },
  },
]

export function TeamsStandings() {
  const [division, setDivision] = useState("Todos")

  const filtered = division === "Todos" ? teamsData : teamsData.filter((t) => t.division === division)
  const sorted = [...filtered].sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Clasificación</h1>
        <p className="text-muted-foreground mt-1">Standings de la temporada MLB 2024</p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {divisions.map((d) => (
          <Button
            key={d}
            variant={division === d ? "default" : "ghost"}
            size="sm"
            onClick={() => setDivision(d)}
            className="shrink-0"
          >
            {d}
          </Button>
        ))}
      </div>

      <StatsTable columns={columns} data={sorted} searchKey="team" searchPlaceholder="Buscar equipo..." />
    </div>
  )
}
