"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Send } from "lucide-react"
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
    // Submit logic here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Crear Nuevo Pick</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Game */}
          <div className="space-y-1.5">
            <Label>Juego</Label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Seleccionar juego...</option>
              {mockGames.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.game && <p className="text-xs text-loss">{errors.game}</p>}
          </div>

          {/* Pick Type */}
          <div className="space-y-1.5">
            <Label>Tipo de Pick</Label>
            <div className="flex flex-wrap gap-2">
              {pickTypes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPickType(t)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                    pickType === t
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
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
              <Label>Seleccion</Label>
              <Input
                placeholder="ej. Yankees ML"
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
              />
              {errors.selection && <p className="text-xs text-loss">{errors.selection}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Odds (Americano)</Label>
              <Input
                placeholder="ej. -150, +120"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                className="font-mono"
              />
              {errors.odds && <p className="text-xs text-loss">{errors.odds}</p>}
            </div>
          </div>

          {/* Stake */}
          <div className="space-y-2">
            <Label>Stake: {stake}/5</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStake(n)}
                  className="rounded-md p-1 transition-colors hover:bg-primary/10"
                >
                  <Flame
                    className={cn(
                      "size-6 transition-colors",
                      n <= stake ? "fill-primary text-primary" : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <div className="space-y-1.5">
            <Label>Analisis</Label>
            <Textarea
              placeholder="Escribe tu analisis detallado del pick (minimo 50 caracteres)..."
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
              rows={5}
            />
            <div className="flex justify-between text-xs">
              {errors.analysis ? (
                <span className="text-loss">{errors.analysis}</span>
              ) : (
                <span />
              )}
              <span className={cn("text-muted-foreground", analysis.length >= 50 && "text-win")}>
                {analysis.length}/50 min
              </span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Send className="mr-2 size-4" />
            Publicar Pick
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
