"use client"

import { useState } from "react"
import RetroButton from "@/components/vintage/RetroButton"
import { cn } from "@/lib/utils"

const mockGames = [
  "NYY vs BOS - Abr 4, 7:05 PM",
  "LAD vs SF - Abr 4, 9:45 PM",
  "HOU vs TEX - Abr 4, 8:10 PM",
  "ATL vs NYM - Abr 4, 7:10 PM",
  "CHC vs MIL - Abr 4, 7:40 PM",
  "SD vs ARI - Abr 5, 3:10 PM",
]

const pickTypes = ["MONEYLINE", "RUNLINE", "TOTAL", "PROP"] as const

export function PickForm() {
  const [game, setGame] = useState("")
  const [pickType, setPickType] = useState<string>("MONEYLINE")
  const [selection, setSelection] = useState("")
  const [odds, setOdds] = useState("")
  const [stake, setStake] = useState(3)
  const [analysis, setAnalysis] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!game) e.game = "Selecciona un juego"
    if (!selection.trim()) e.selection = "Escribe tu seleccion"
    if (!odds.trim()) e.odds = "Ingresa las odds"
    if (analysis.length < 50) e.analysis = "Minimo 50 caracteres"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
  }

  return (
    <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
      {/* Corner ornaments */}
      <div className="absolute top-[6px] left-[6px] w-5 h-5 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute top-[6px] right-[6px] w-5 h-5 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute bottom-[6px] left-[6px] w-5 h-5 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
      <div className="absolute bottom-[6px] right-[6px] w-5 h-5 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

      <div className="p-6 space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#C41E3A] text-center">
          <span className="border-b-2 border-[#C41E3A] pb-1">NUEVO PICK</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Game selector */}
          <div className="space-y-1.5">
            <label className="font-display text-xs uppercase tracking-wider text-[#3D2B1F]">Juego</label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="flex h-10 w-full bg-[#FDF6E3] border-2 border-[#8B7355] rounded-sm px-3 py-2 text-sm font-sans text-[#3D2B1F] focus:outline-none focus:border-[#C41E3A]"
            >
              <option value="">Seleccionar juego...</option>
              {mockGames.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.game && <p className="text-xs text-[#C62828] font-display">{errors.game}</p>}
          </div>

          {/* Pick Type - vintage tab buttons */}
          <div className="space-y-1.5">
            <label className="font-display text-xs uppercase tracking-wider text-[#3D2B1F]">Tipo de Pick</label>
            <div className="flex flex-wrap gap-2">
              {pickTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPickType(t)}
                  className={cn(
                    "font-display text-xs uppercase tracking-wider px-4 py-2 rounded-sm border-2 transition-colors",
                    pickType === t
                      ? "bg-[#0D2240] text-[#F5C842] border-[#0D2240]"
                      : "bg-[#FDF6E3] text-[#8B7355] border-[#8B7355] hover:border-[#0D2240]"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Selection + Odds */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="font-display text-xs uppercase tracking-wider text-[#3D2B1F]">Seleccion</label>
              <input
                type="text"
                placeholder="ej. Yankees ML"
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
                className="h-10 w-full bg-[#FDF6E3] border-2 border-[#8B7355] rounded-sm px-3 text-sm font-sans text-[#3D2B1F] placeholder:text-[#8B7355]/50 focus:outline-none focus:border-[#C41E3A]"
              />
              {errors.selection && <p className="text-xs text-[#C62828] font-display">{errors.selection}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="font-display text-xs uppercase tracking-wider text-[#3D2B1F]">Odds</label>
              <input
                type="text"
                placeholder="ej. -150, +120"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                className="h-10 w-full bg-[#FDF6E3] border-2 border-[#8B7355] rounded-sm px-3 text-sm font-mono text-[#3D2B1F] placeholder:text-[#8B7355]/50 focus:outline-none focus:border-[#C41E3A]"
              />
              {errors.odds && <p className="text-xs text-[#C62828] font-display">{errors.odds}</p>}
            </div>
          </div>

          {/* Stake */}
          <div className="space-y-2">
            <label className="font-display text-xs uppercase tracking-wider text-[#3D2B1F]">Stake</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStake(n)}
                  className="text-2xl transition-transform hover:scale-110"
                >
                  <span className={n <= stake ? "opacity-100" : "opacity-20"}>&#x1F525;</span>
                </button>
              ))}
              <span className="font-display text-sm text-[#3D2B1F] ml-2">{stake} unidades</span>
            </div>
          </div>

          {/* Analysis */}
          <div className="space-y-1.5">
            <label className="font-display text-xs uppercase tracking-wider text-[#3D2B1F]">Analisis</label>
            <textarea
              placeholder="Escribe tu analisis detallado del pick (minimo 50 caracteres)..."
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
              rows={5}
              className="w-full bg-[#FDF6E3] border-2 border-[#8B7355] rounded-sm px-3 py-2 text-sm font-sans text-[#3D2B1F] placeholder:text-[#8B7355]/50 focus:outline-none focus:border-[#C41E3A] resize-none"
            />
            <div className="flex justify-between">
              {errors.analysis ? (
                <span className="text-xs text-[#C62828] font-display">{errors.analysis}</span>
              ) : (
                <span />
              )}
              <span className={cn("font-mono text-xs", analysis.length >= 50 ? "text-[#2E7D32]" : "text-[#8B7355]")}>
                {analysis.length}/50 min
              </span>
            </div>
          </div>

          <RetroButton type="submit" variant="red" size="lg" className="w-full">
            PUBLICAR PICK
          </RetroButton>
        </form>
      </div>
    </div>
  )
}
