"use client"

import { useState } from "react"

const pickTypes = ["Todos", "Moneyline", "Run Line", "Total", "Prop"]
const results = ["Todos", "Pendiente", "Win", "Loss", "Push"]

export function PickFilters() {
  const [type, setType] = useState("Todos")
  const [result, setResult] = useState("Todos")
  const [date, setDate] = useState("")
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-4">
      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2">
        {pickTypes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`font-display text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm border-2 transition-colors ${
              type === t
                ? "bg-[#C41E3A] text-white border-[#C41E3A]"
                : "bg-[#0D2240] text-[#8FBCE6] border-[#0D2240] hover:border-[#8FBCE6]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Result filter pills */}
      <div className="flex flex-wrap gap-2">
        {results.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setResult(r)}
            className={`font-display text-xs uppercase tracking-wider px-3 py-1.5 rounded-sm border-2 transition-colors ${
              result === r
                ? "bg-[#C41E3A] text-white border-[#C41E3A]"
                : "bg-[#0D2240] text-[#8FBCE6] border-[#0D2240] hover:border-[#8FBCE6]"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Date + Search row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 w-full bg-[#FDF6E3] border-2 border-[#8B7355] rounded-sm px-3 text-sm font-display text-[#3D2B1F] focus:outline-none focus:border-[#C41E3A]"
        />
        <input
          type="text"
          placeholder="Buscar tipster..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full bg-[#FDF6E3] border-2 border-[#8B7355] rounded-sm px-3 text-sm font-display text-[#3D2B1F] placeholder:text-[#8B7355]/60 focus:outline-none focus:border-[#C41E3A]"
        />
      </div>
    </div>
  )
}
