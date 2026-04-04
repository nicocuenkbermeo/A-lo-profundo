"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Filter } from "lucide-react"

const pickTypes = ["Todos", "Moneyline", "Run Line", "Total", "Prop"]
const results = ["Todos", "Pendiente", "Win", "Loss", "Push"]

export function PickFilters() {
  const [type, setType] = useState("Todos")
  const [result, setResult] = useState("Todos")
  const [date, setDate] = useState("")
  const [search, setSearch] = useState("")

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="size-4" />
        Filtros
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pick type */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Tipo de Pick</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {pickTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Result */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Resultado</Label>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {results.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Fecha</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Search */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Buscar tipster</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
