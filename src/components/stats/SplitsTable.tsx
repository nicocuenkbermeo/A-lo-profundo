"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

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

const colHeaders = ["", "AVG", "OBP", "SLG", "OPS", "AB", "H", "HR", "RBI"]

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
    <div className="space-y-4">
      {/* Vintage paper tabs */}
      <div className="flex gap-0 border-b-2 border-[#8B7355]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-xs font-[family-name:var(--font-display)] uppercase tracking-wider transition-colors border-2 border-b-0 rounded-t-sm -mb-[2px]",
              activeTab === tab.key
                ? "bg-[#FDF6E3] border-[#8B7355] text-[#0D2240] font-bold"
                : "bg-[#F5E6C8] border-transparent text-[#8B7355] hover:text-[#3D2B1F]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vintage table */}
      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#0D2240]">
                {colHeaders.map((col) => (
                  <th
                    key={col}
                    className="text-[#F5C842] font-[family-name:var(--font-display)] uppercase tracking-wider text-xs px-3 py-2.5 text-left whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.label}
                  className={cn(
                    "transition-colors hover:bg-[#EDD9B3] border-b border-[#8B7355]/20",
                    idx % 2 === 0 ? "bg-[#FDF6E3]" : "bg-[#F5E6C8]"
                  )}
                >
                  <td className="font-[family-name:var(--font-display)] text-sm text-[#3D2B1F] font-medium px-3 py-2 whitespace-nowrap">
                    {row.label}
                  </td>
                  {(["avg", "obp", "slg", "ops"] as const).map((k) => (
                    <td
                      key={k}
                      className={cn(
                        "font-[family-name:var(--font-mono)] text-sm text-[#3D2B1F] px-3 py-2",
                        k === "ops" && row.label === opsBest.best && "text-[#006400] font-bold",
                        k === "ops" && row.label === opsBest.worst && "text-[#C41E3A] font-bold"
                      )}
                    >
                      {row[k]}
                    </td>
                  ))}
                  {(["ab", "h", "hr", "rbi"] as const).map((k) => (
                    <td key={k} className="font-[family-name:var(--font-mono)] text-sm text-[#3D2B1F] px-3 py-2">
                      {row[k]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
