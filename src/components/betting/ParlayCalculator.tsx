"use client";

import { useState, useCallback, useMemo } from "react";

interface Selection {
  id: string;
  label: string;
  odds: number;
}

type OddsFormat = "decimal" | "american" | "fractional";

function decimalToAmerican(dec: number): string {
  if (dec >= 2) return `+${Math.round((dec - 1) * 100)}`;
  if (dec > 1) return `-${Math.round(100 / (dec - 1))}`;
  return "+100";
}

function americanToDecimal(am: number): number {
  if (am > 0) return am / 100 + 1;
  if (am < 0) return 100 / Math.abs(am) + 1;
  return 2.0;
}

function decimalToFractional(dec: number): string {
  const profit = dec - 1;
  // Simple approximation for display
  const num = Math.round(profit * 100);
  const den = 100;
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(num, den);
  return `${num / g}/${den / g}`;
}

function formatOdds(dec: number, format: OddsFormat): string {
  switch (format) {
    case "american":
      return decimalToAmerican(dec);
    case "fractional":
      return decimalToFractional(dec);
    default:
      return dec.toFixed(2);
  }
}

let nextId = 1;

export function ParlayCalculator() {
  const [selections, setSelections] = useState<Selection[]>([
    { id: String(nextId++), label: "", odds: 1.5 },
    { id: String(nextId++), label: "", odds: 1.5 },
  ]);
  const [stake, setStake] = useState(100);
  const [oddsFormat, setOddsFormat] = useState<OddsFormat>("decimal");
  const [inputMode, setInputMode] = useState<OddsFormat>("decimal");

  const addSelection = useCallback(() => {
    if (selections.length >= 12) return;
    setSelections((prev) => [
      ...prev,
      { id: String(nextId++), label: "", odds: 1.5 },
    ]);
  }, [selections.length]);

  const removeSelection = useCallback((id: string) => {
    setSelections((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const updateOdds = useCallback((id: string, rawValue: string) => {
    let decimal: number;
    const num = parseFloat(rawValue);
    if (isNaN(num)) return;

    if (inputMode === "american") {
      decimal = americanToDecimal(num);
    } else {
      decimal = num;
    }
    if (decimal < 1.01) decimal = 1.01;

    setSelections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, odds: decimal } : s)),
    );
  }, [inputMode]);

  const updateLabel = useCallback((id: string, label: string) => {
    setSelections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, label } : s)),
    );
  }, []);

  const calc = useMemo(() => {
    const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
    const impliedProb = totalOdds > 0 ? 1 / totalOdds : 0;
    const payout = stake * totalOdds;
    const profit = payout - stake;
    const multiplier = totalOdds;
    return { totalOdds, impliedProb, payout, profit, multiplier };
  }, [selections, stake]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams();
    params.set("s", String(stake));
    selections.forEach((sel, i) => {
      params.set(`o${i}`, sel.odds.toFixed(2));
      if (sel.label) params.set(`l${i}`, sel.label);
    });
    return `${window.location.origin}/calculadora?${params.toString()}`;
  }, [selections, stake]);

  const copyShare = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
  }, [shareUrl]);

  return (
    <div className="space-y-6">
      {/* Odds format selector */}
      <div className="flex items-center gap-2">
        <span className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
          Formato:
        </span>
        {(["decimal", "american", "fractional"] as const).map((fmt) => (
          <button
            key={fmt}
            onClick={() => {
              setOddsFormat(fmt);
              setInputMode(fmt === "fractional" ? "decimal" : fmt);
            }}
            className={`px-3 py-1.5 font-display text-xs uppercase tracking-wider rounded-sm transition-colors min-h-[44px] ${
              oddsFormat === fmt
                ? "bg-[#F5C842] text-[#3D2B1F] font-bold"
                : "bg-[#FDF6E3] text-[#8B7355] border border-[#8B7355]/30"
            }`}
          >
            {fmt === "decimal" ? "Decimal" : fmt === "american" ? "Americano" : "Fraccional"}
          </button>
        ))}
      </div>

      {/* Stake input */}
      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4">
        <label className="font-display text-[10px] uppercase tracking-wider text-[#8B7355] block mb-2">
          Monto a apostar
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStake((s) => Math.max(10, s - 10))}
            className="w-11 h-11 flex items-center justify-center bg-[#0D2240] text-[#F5C842] font-bold text-lg rounded-sm"
          >
            -
          </button>
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(Math.max(1, parseInt(e.target.value) || 0))}
            className="flex-1 h-11 text-center font-mono text-lg font-bold text-[#3D2B1F] bg-white border-2 border-[#8B7355]/30 rounded-sm"
          />
          <button
            onClick={() => setStake((s) => s + 10)}
            className="w-11 h-11 flex items-center justify-center bg-[#0D2240] text-[#F5C842] font-bold text-lg rounded-sm"
          >
            +
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          {[50, 100, 200, 500].map((v) => (
            <button
              key={v}
              onClick={() => setStake(v)}
              className={`flex-1 py-1.5 font-mono text-xs rounded-sm transition-colors min-h-[36px] ${
                stake === v
                  ? "bg-[#0D2240] text-[#F5C842] font-bold"
                  : "bg-[#8B7355]/10 text-[#8B7355]"
              }`}
            >
              ${v}
            </button>
          ))}
        </div>
      </div>

      {/* Selections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
            Selecciones ({selections.length}/12)
          </span>
          <button
            onClick={addSelection}
            disabled={selections.length >= 12}
            className="font-display text-xs uppercase tracking-wider text-[#F5C842] hover:text-[#FDF6E3] disabled:text-[#8B7355]/30 transition-colors min-h-[44px] px-3"
          >
            + Agregar
          </button>
        </div>

        {selections.map((sel, idx) => (
          <div
            key={sel.id}
            className="bg-[#FDF6E3] border-[3px] border-[#8B7355]/50 rounded-sm p-3 flex items-center gap-2"
          >
            <span className="font-mono text-xs text-[#8B7355] w-5 shrink-0">
              {idx + 1}
            </span>
            <input
              type="text"
              placeholder="Ej: NYY ML"
              value={sel.label}
              onChange={(e) => updateLabel(sel.id, e.target.value)}
              className="flex-1 min-w-0 h-10 px-2 font-sans text-sm text-[#3D2B1F] bg-white border border-[#8B7355]/20 rounded-sm placeholder:text-[#8B7355]/40"
            />
            <input
              type="number"
              step="0.01"
              value={
                inputMode === "american"
                  ? decimalToAmerican(sel.odds).replace("+", "")
                  : sel.odds.toFixed(2)
              }
              onChange={(e) => updateOdds(sel.id, e.target.value)}
              className="w-20 h-10 text-center font-mono text-sm font-bold text-[#0D2240] bg-white border border-[#8B7355]/20 rounded-sm"
            />
            <span className="font-mono text-[10px] text-[#8B7355] w-12 text-right shrink-0">
              {formatOdds(sel.odds, oddsFormat)}
            </span>
            <button
              onClick={() => removeSelection(sel.id)}
              disabled={selections.length <= 2}
              className="w-10 h-10 flex items-center justify-center text-[#C41E3A] hover:bg-[#C41E3A]/10 rounded-sm disabled:text-[#8B7355]/20 transition-colors shrink-0"
              aria-label="Eliminar selección"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Results — sticky on mobile */}
      <div className="sticky bottom-16 lg:bottom-0 z-40 bg-[#0D2240] border-[3px] border-[#F5C842] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ResultBox label="Cuota total" value={formatOdds(calc.totalOdds, oddsFormat)} />
          <ResultBox label="Prob. implícita" value={`${(calc.impliedProb * 100).toFixed(1)}%`} />
          <ResultBox
            label="Ganancia"
            value={`$${calc.profit.toFixed(0)}`}
            highlight
          />
          <ResultBox label="Pago total" value={`$${calc.payout.toFixed(0)}`} />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
            Multiplicador: {calc.multiplier.toFixed(2)}x
          </span>
          <button
            onClick={copyShare}
            className="font-display text-xs uppercase tracking-wider text-[#F5C842] hover:text-[#FDF6E3] transition-colors min-h-[44px] px-3"
          >
            Compartir cálculo
          </button>
        </div>
      </div>

      {/* Tooltip educativo */}
      <details className="group">
        <summary className="cursor-pointer font-display text-xs uppercase tracking-wider text-[#C41E3A] hover:text-[#FDF6E3] transition-colors">
          ¿Qué es la probabilidad implícita?
        </summary>
        <div className="mt-2 bg-[#FDF6E3] border-[3px] border-[#8B7355] rounded-sm p-4">
          <p className="font-sans text-sm text-[#3D2B1F] leading-relaxed">
            La probabilidad implícita es la probabilidad de que un evento ocurra
            según las cuotas del mercado. Se calcula como <span className="font-mono">1 / cuota decimal</span>.
            En un parlay, la probabilidad implícita total es el producto inverso
            de todas las cuotas: cuanto más selecciones, menor la probabilidad
            y mayor el pago potencial.
          </p>
        </div>
      </details>
    </div>
  );
}

function ResultBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="font-display text-[9px] uppercase tracking-wider text-[#8B7355]">
        {label}
      </p>
      <p
        className={`font-mono text-lg sm:text-xl font-bold mt-0.5 ${
          highlight ? "text-[#2E7D32]" : "text-[#F5C842]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
