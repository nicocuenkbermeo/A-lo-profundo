"use client"

import { useState } from "react"
import Link from "next/link"
import { type ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { StatsTable } from "@/components/stats/StatsTable"

interface Batter {
  id: string
  name: string
  team: string
  pos: string
  avg: string
  obp: string
  slg: string
  ops: string
  hr: number
  rbi: number
  sb: number
  war: string
}

interface Pitcher {
  id: string
  name: string
  team: string
  pos: string
  w: number
  l: number
  era: string
  whip: string
  k: number
  bb: number
  ip: string
  k9: string
  fip: string
}

const batters: Batter[] = [
  { id: "judge-1", name: "Aaron Judge", team: "NYY", pos: "RF", avg: ".322", obp: ".458", slg: ".701", ops: "1.159", hr: 58, rbi: 144, sb: 3, war: "11.2" },
  { id: "ohtani-1", name: "Shohei Ohtani", team: "LAD", pos: "DH", avg: ".310", obp: ".390", slg: ".646", ops: "1.036", hr: 54, rbi: 130, sb: 59, war: "9.1" },
  { id: "soto-1", name: "Juan Soto", team: "NYM", pos: "LF", avg: ".288", obp: ".419", slg: ".566", ops: ".985", hr: 41, rbi: 109, sb: 4, war: "7.8" },
  { id: "arraez-1", name: "Luis Arraez", team: "SD", pos: "1B", avg: ".354", obp: ".399", slg: ".460", ops: ".859", hr: 8, rbi: 58, sb: 2, war: "4.2" },
  { id: "delacruz-1", name: "Elly De La Cruz", team: "CIN", pos: "SS", avg: ".262", obp: ".325", slg: ".472", ops: ".797", hr: 25, rbi: 76, sb: 67, war: "5.4" },
  { id: "betts-1", name: "Mookie Betts", team: "LAD", pos: "SS", avg: ".289", obp: ".384", slg: ".541", ops: ".925", hr: 23, rbi: 82, sb: 14, war: "6.5" },
  { id: "lindor-1", name: "Francisco Lindor", team: "NYM", pos: "SS", avg: ".273", obp: ".344", slg: ".500", ops: ".844", hr: 33, rbi: 91, sb: 29, war: "7.1" },
  { id: "ramirez-1", name: "Jose Ramirez", team: "CLE", pos: "3B", avg: ".279", obp: ".345", slg: ".535", ops: ".880", hr: 39, rbi: 118, sb: 20, war: "7.5" },
  { id: "freeman-1", name: "Freddie Freeman", team: "LAD", pos: "1B", avg: ".282", obp: ".378", slg: ".476", ops: ".854", hr: 22, rbi: 89, sb: 5, war: "5.1" },
  { id: "witt-1", name: "Bobby Witt Jr.", team: "KC", pos: "SS", avg: ".332", obp: ".389", slg: ".588", ops: ".977", hr: 32, rbi: 106, sb: 31, war: "8.6" },
  { id: "acuna-1", name: "Ronald Acuna Jr.", team: "ATL", pos: "RF", avg: ".296", obp: ".392", slg: ".574", ops: ".966", hr: 15, rbi: 42, sb: 24, war: "3.8" },
  { id: "tatis-1", name: "Fernando Tatis Jr.", team: "SD", pos: "RF", avg: ".276", obp: ".342", slg: ".530", ops: ".872", hr: 21, rbi: 65, sb: 15, war: "3.9" },
  { id: "riley-1", name: "Austin Riley", team: "ATL", pos: "3B", avg: ".268", obp: ".334", slg: ".502", ops: ".836", hr: 34, rbi: 97, sb: 1, war: "4.5" },
  { id: "guerrero-1", name: "Vladimir Guerrero Jr.", team: "TOR", pos: "1B", avg: ".323", obp: ".396", slg: ".544", ops: ".940", hr: 30, rbi: 103, sb: 1, war: "5.6" },
  { id: "henderson-1", name: "Gunnar Henderson", team: "BAL", pos: "SS", avg: ".281", obp: ".364", slg: ".540", ops: ".904", hr: 37, rbi: 92, sb: 5, war: "6.8" },
  { id: "seager-1", name: "Corey Seager", team: "TEX", pos: "SS", avg: ".278", obp: ".358", slg: ".510", ops: ".868", hr: 30, rbi: 88, sb: 2, war: "4.8" },
  { id: "turner-1", name: "Trea Turner", team: "PHI", pos: "SS", avg: ".295", obp: ".352", slg: ".480", ops: ".832", hr: 21, rbi: 75, sb: 19, war: "4.3" },
  { id: "alvarez-1", name: "Yordan Alvarez", team: "HOU", pos: "DH", avg: ".308", obp: ".392", slg: ".582", ops: ".974", hr: 35, rbi: 96, sb: 1, war: "5.9" },
  { id: "harper-1", name: "Bryce Harper", team: "PHI", pos: "1B", avg: ".285", obp: ".373", slg: ".525", ops: ".898", hr: 30, rbi: 87, sb: 3, war: "5.2" },
  { id: "trout-1", name: "Mike Trout", team: "LAA", pos: "CF", avg: ".220", obp: ".325", slg: ".440", ops: ".765", hr: 18, rbi: 44, sb: 2, war: "2.1" },
  { id: "arenado-1", name: "Nolan Arenado", team: "STL", pos: "3B", avg: ".262", obp: ".318", slg: ".428", ops: ".746", hr: 16, rbi: 71, sb: 1, war: "2.8" },
  { id: "springer-1", name: "George Springer", team: "TOR", pos: "CF", avg: ".245", obp: ".320", slg: ".445", ops: ".765", hr: 22, rbi: 62, sb: 4, war: "2.3" },
  { id: "tucker-1", name: "Kyle Tucker", team: "HOU", pos: "LF", avg: ".289", obp: ".368", slg: ".549", ops: ".917", hr: 23, rbi: 72, sb: 18, war: "5.0" },
  { id: "ozuna-1", name: "Marcell Ozuna", team: "ATL", pos: "DH", avg: ".302", obp: ".378", slg: ".574", ops: ".952", hr: 39, rbi: 104, sb: 2, war: "4.6" },
  { id: "garcia-1", name: "Adolis Garcia", team: "TEX", pos: "RF", avg: ".238", obp: ".295", slg: ".428", ops: ".723", hr: 22, rbi: 78, sb: 14, war: "2.0" },
  { id: "jackson-1", name: "Jackson Chourio", team: "MIL", pos: "CF", avg: ".275", obp: ".330", slg: ".470", ops: ".800", hr: 21, rbi: 73, sb: 22, war: "4.1" },
  { id: "correa-1", name: "Carlos Correa", team: "MIN", pos: "SS", avg: ".265", obp: ".348", slg: ".440", ops: ".788", hr: 18, rbi: 64, sb: 3, war: "3.2" },
  { id: "yelich-1", name: "Christian Yelich", team: "MIL", pos: "LF", avg: ".270", obp: ".365", slg: ".445", ops: ".810", hr: 14, rbi: 52, sb: 16, war: "3.5" },
  { id: "realmuto-1", name: "J.T. Realmuto", team: "PHI", pos: "C", avg: ".258", obp: ".322", slg: ".432", ops: ".754", hr: 14, rbi: 56, sb: 10, war: "3.0" },
  { id: "rutschman-1", name: "Adley Rutschman", team: "BAL", pos: "C", avg: ".272", obp: ".358", slg: ".448", ops: ".806", hr: 19, rbi: 80, sb: 2, war: "4.4" },
]

const pitchers: Pitcher[] = [
  { id: "skubal-1", name: "Tarik Skubal", team: "DET", pos: "SP", w: 18, l: 4, era: "2.39", whip: "0.92", k: 228, bb: 42, ip: "192.0", k9: "10.69", fip: "2.52" },
  { id: "sale-1", name: "Chris Sale", team: "ATL", pos: "SP", w: 18, l: 3, era: "2.38", whip: "0.95", k: 225, bb: 38, ip: "177.2", k9: "11.40", fip: "2.70" },
  { id: "webb-1", name: "Logan Webb", team: "SF", pos: "SP", w: 15, l: 8, era: "2.95", whip: "1.05", k: 196, bb: 52, ip: "214.0", k9: "8.24", fip: "3.10" },
  { id: "cole-1", name: "Gerrit Cole", team: "NYY", pos: "SP", w: 8, l: 5, era: "3.41", whip: "1.04", k: 99, bb: 28, ip: "95.1", k9: "9.35", fip: "3.20" },
  { id: "wheeler-1", name: "Zack Wheeler", team: "PHI", pos: "SP", w: 16, l: 7, era: "2.57", whip: "0.96", k: 224, bb: 48, ip: "200.0", k9: "10.08", fip: "2.80" },
  { id: "alcantara-1", name: "Sandy Alcantara", team: "MIA", pos: "SP", w: 4, l: 12, era: "4.82", whip: "1.38", k: 98, bb: 52, ip: "120.0", k9: "7.35", fip: "4.50" },
  { id: "burns-1", name: "Corbin Burnes", team: "BAL", pos: "SP", w: 15, l: 9, era: "2.92", whip: "1.10", k: 181, bb: 54, ip: "194.1", k9: "8.38", fip: "3.32" },
  { id: "cease-1", name: "Dylan Cease", team: "SD", pos: "SP", w: 14, l: 11, era: "3.47", whip: "1.15", k: 224, bb: 72, ip: "189.1", k9: "10.65", fip: "3.18" },
  { id: "ragans-1", name: "Cole Ragans", team: "KC", pos: "SP", w: 11, l: 9, era: "3.14", whip: "1.08", k: 223, bb: 60, ip: "186.1", k9: "10.78", fip: "2.96" },
  { id: "glasnow-1", name: "Tyler Glasnow", team: "LAD", pos: "SP", w: 9, l: 7, era: "3.32", whip: "1.04", k: 168, bb: 48, ip: "134.0", k9: "11.28", fip: "3.05" },
  { id: "nola-1", name: "Aaron Nola", team: "PHI", pos: "SP", w: 13, l: 8, era: "3.57", whip: "1.08", k: 184, bb: 52, ip: "199.0", k9: "8.32", fip: "3.40" },
  { id: "fried-1", name: "Max Fried", team: "ATL", pos: "SP", w: 11, l: 10, era: "3.25", whip: "1.16", k: 166, bb: 48, ip: "174.1", k9: "8.57", fip: "3.48" },
  { id: "clase-1", name: "Emmanuel Clase", team: "CLE", pos: "CL", w: 4, l: 3, era: "0.61", whip: "0.73", k: 74, bb: 12, ip: "74.1", k9: "8.96", fip: "1.85" },
  { id: "diaz-1", name: "Edwin Diaz", team: "NYM", pos: "CL", w: 3, l: 4, era: "4.20", whip: "1.22", k: 62, bb: 18, ip: "45.0", k9: "12.40", fip: "3.80" },
  { id: "hader-1", name: "Josh Hader", team: "HOU", pos: "CL", w: 6, l: 5, era: "2.50", whip: "0.98", k: 78, bb: 22, ip: "61.0", k9: "11.51", fip: "2.65" },
  { id: "lopez-1", name: "Pablo Lopez", team: "MIN", pos: "SP", w: 12, l: 10, era: "3.85", whip: "1.14", k: 192, bb: 48, ip: "182.0", k9: "9.49", fip: "3.60" },
  { id: "bieber-1", name: "Shane Bieber", team: "CLE", pos: "SP", w: 2, l: 2, era: "4.92", whip: "1.28", k: 32, bb: 14, ip: "36.2", k9: "7.85", fip: "4.30" },
  { id: "kershaw-1", name: "Clayton Kershaw", team: "LAD", pos: "SP", w: 2, l: 2, era: "4.50", whip: "1.18", k: 28, bb: 10, ip: "30.0", k9: "8.40", fip: "4.10" },
  { id: "castillo-1", name: "Luis Castillo", team: "SEA", pos: "SP", w: 13, l: 11, era: "3.64", whip: "1.18", k: 175, bb: 55, ip: "178.0", k9: "8.85", fip: "3.55" },
  { id: "strider-1", name: "Spencer Strider", team: "ATL", pos: "SP", w: 3, l: 3, era: "5.20", whip: "1.30", k: 44, bb: 16, ip: "45.0", k9: "8.80", fip: "4.60" },
]

const batterColumns: ColumnDef<Batter>[] = [
  {
    accessorKey: "name",
    header: "Jugador",
    cell: ({ row }) => (
      <Link
        href={`/stats/players/${row.original.id}`}
        className="font-[family-name:var(--font-heading)] font-bold text-[#3D2B1F] hover:text-[#C41E3A] transition-colors"
      >
        {row.original.name}
      </Link>
    ),
    enableSorting: false,
  },
  { accessorKey: "team", header: "Equipo", cell: ({ getValue }) => <span className="font-[family-name:var(--font-display)] text-[#8B7355]">{getValue<string>()}</span> },
  { accessorKey: "pos", header: "Pos", cell: ({ getValue }) => <span className="font-[family-name:var(--font-display)] text-[#8B7355]">{getValue<string>()}</span> },
  { accessorKey: "avg", header: "AVG", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)] font-bold text-[#0D2240]">{getValue<string>()}</span> },
  { accessorKey: "obp", header: "OBP", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<string>()}</span> },
  { accessorKey: "slg", header: "SLG", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<string>()}</span> },
  { accessorKey: "ops", header: "OPS", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)] font-bold text-[#C41E3A]">{getValue<string>()}</span> },
  { accessorKey: "hr", header: "HR", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<number>()}</span> },
  { accessorKey: "rbi", header: "RBI", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<number>()}</span> },
  { accessorKey: "sb", header: "SB", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<number>()}</span> },
  { accessorKey: "war", header: "WAR", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)] font-bold text-[#F5C842]">{getValue<string>()}</span> },
]

const pitcherColumns: ColumnDef<Pitcher>[] = [
  {
    accessorKey: "name",
    header: "Jugador",
    cell: ({ row }) => (
      <Link
        href={`/stats/players/${row.original.id}`}
        className="font-[family-name:var(--font-heading)] font-bold text-[#3D2B1F] hover:text-[#C41E3A] transition-colors"
      >
        {row.original.name}
      </Link>
    ),
    enableSorting: false,
  },
  { accessorKey: "team", header: "Equipo", cell: ({ getValue }) => <span className="font-[family-name:var(--font-display)] text-[#8B7355]">{getValue<string>()}</span> },
  { accessorKey: "w", header: "W", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)] font-bold">{getValue<number>()}</span> },
  { accessorKey: "l", header: "L", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<number>()}</span> },
  { accessorKey: "era", header: "ERA", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)] font-bold text-[#0D2240]">{getValue<string>()}</span> },
  { accessorKey: "whip", header: "WHIP", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<string>()}</span> },
  { accessorKey: "k", header: "K", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<number>()}</span> },
  { accessorKey: "bb", header: "BB", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<number>()}</span> },
  { accessorKey: "ip", header: "IP", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<string>()}</span> },
  { accessorKey: "k9", header: "K/9", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)]">{getValue<string>()}</span> },
  { accessorKey: "fip", header: "FIP", cell: ({ getValue }) => <span className="font-[family-name:var(--font-mono)] font-bold text-[#F5C842]">{getValue<string>()}</span> },
]

const positions = {
  batters: ["Todos", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"],
  pitchers: ["Todos", "SP", "CL"],
}

export function PlayersStats() {
  const [mode, setMode] = useState<"batters" | "pitchers">("batters")
  const [posFilter, setPosFilter] = useState("Todos")

  const filteredBatters = posFilter === "Todos" ? batters : batters.filter((b) => b.pos === posFilter)
  const filteredPitchers = posFilter === "Todos" ? pitchers : pitchers.filter((p) => p.pos === posFilter)

  return (
    <div className="space-y-6">
      <h2 className="font-[family-name:var(--font-heading)] text-[#F5C842] text-2xl font-bold">
        JUGADORES
      </h2>

      <div className="flex flex-wrap items-center gap-4">
        {/* Mode toggle - vintage tabs */}
        <div className="flex gap-0 border-b-2 border-[#8B7355]">
          <button
            onClick={() => { setMode("batters"); setPosFilter("Todos") }}
            className={cn(
              "px-5 py-2 text-sm font-[family-name:var(--font-display)] uppercase tracking-wider border-2 border-b-0 rounded-t-sm -mb-[2px] transition-colors",
              mode === "batters"
                ? "bg-[#FDF6E3] border-[#8B7355] text-[#0D2240] font-bold"
                : "bg-[#F5E6C8]/50 border-transparent text-[#8B7355] hover:text-[#3D2B1F]"
            )}
          >
            Bateadores
          </button>
          <button
            onClick={() => { setMode("pitchers"); setPosFilter("Todos") }}
            className={cn(
              "px-5 py-2 text-sm font-[family-name:var(--font-display)] uppercase tracking-wider border-2 border-b-0 rounded-t-sm -mb-[2px] transition-colors",
              mode === "pitchers"
                ? "bg-[#FDF6E3] border-[#8B7355] text-[#0D2240] font-bold"
                : "bg-[#F5E6C8]/50 border-transparent text-[#8B7355] hover:text-[#3D2B1F]"
            )}
          >
            Pitchers
          </button>
        </div>

        {/* Position filter - vintage pills */}
        <div className="flex gap-1.5 overflow-x-auto">
          {positions[mode].map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={cn(
                "shrink-0 px-3 py-1 text-[11px] font-[family-name:var(--font-display)] uppercase tracking-wider rounded-sm border transition-colors",
                posFilter === pos
                  ? "bg-[#C41E3A] text-[#FDF6E3] border-[#C41E3A]"
                  : "bg-[#FDF6E3] text-[#8B7355] border-[#8B7355]/50 hover:bg-[#F5E6C8]"
              )}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {mode === "batters" ? (
        <StatsTable columns={batterColumns} data={filteredBatters} searchKey="name" searchPlaceholder="Buscar jugador..." />
      ) : (
        <StatsTable columns={pitcherColumns} data={filteredPitchers} searchKey="name" searchPlaceholder="Buscar pitcher..." />
      )}
    </div>
  )
}
