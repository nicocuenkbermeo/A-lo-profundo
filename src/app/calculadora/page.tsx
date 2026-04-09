import type { Metadata } from "next";
import { ParlayCalculator } from "@/components/betting/ParlayCalculator";
import { BettingDisclaimer } from "@/components/betting/BettingDisclaimer";

export const metadata: Metadata = {
  title: "Calculadora de Parlays MLB — A Lo Profundo",
  description:
    "Calcula tu parlay: cuota total, probabilidad implícita, ganancia potencial. Convierte cuotas decimal, americano y fraccional.",
  keywords: [
    "calculadora parlay",
    "calculadora apuestas MLB",
    "parlay béisbol",
    "convertir cuotas",
  ],
};

export default function CalculadoraPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          CALCULADORA DE PARLAYS
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Calcula tu combinada · Decimal · Americano · Fraccional
        </p>
      </header>

      <ParlayCalculator />

      <BettingDisclaimer />
    </div>
  );
}
