"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SplitRow {
  label: string
  avg: string
  obp: string
  slg: string
  ops: string
  ab: number
  h: number
  hr: number
  rbi: number
}

interface SplitsData {
  handedness: SplitRow[]
  homeAway: SplitRow[]
  monthly: SplitRow[]
}

interface SplitsTableProps {
  splits: SplitsData
}

const tabs = [
  { key: "handedness" as const, label: "vs L/R" },
  { key: "homeAway" as const, label: "Local/Visitante" },
  { key: "monthly" as const, label: "Por Mes" },
]

const columns = ["", "AVG", "OBP", "SLG", "OPS", "AB", "H", "HR", "RBI"]

function findBestWorst(rows: SplitRow[], key: keyof SplitRow) {
  if (rows.length === 0) return { best: "", worst: "" }
  const vals = rows.map((r) => {
    const v = r[key]
    return typeof v === "string" ? parseFloat(v) : v
  })
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  return {
    best: rows[vals.indexOf(max)].label,
    worst: rows[vals.indexOf(min)].label,
  }
}

export function SplitsTable({ splits }: SplitsTableProps) {
  const [activeTab, setActiveTab] = useState<keyof SplitsData>("handedness")
  const rows = splits[activeTab]
  const opsBest = findBestWorst(rows, "ops")

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card border-border">
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="text-xs text-muted-foreground uppercase tracking-wider"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.label}
                className="border-border/50 hover:bg-muted/30"
              >
                <TableCell className="font-medium text-sm">
                  {row.label}
                </TableCell>
                {(["avg", "obp", "slg", "ops"] as const).map((k) => (
                  <TableCell
                    key={k}
                    className={cn(
                      "font-mono text-sm",
                      k === "ops" && row.label === opsBest.best && "text-green-400",
                      k === "ops" && row.label === opsBest.worst && "text-red-400"
                    )}
                  >
                    {row[k]}
                  </TableCell>
                ))}
                {(["ab", "h", "hr", "rbi"] as const).map((k) => (
                  <TableCell key={k} className="font-mono text-sm">
                    {row[k]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
