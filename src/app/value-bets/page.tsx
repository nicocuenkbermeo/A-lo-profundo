import type { Metadata } from "next";
import Image from "next/image";
import { buildValueBets, type ValueBet } from "@/lib/mlb/features/value-bets";
import { BettingDisclaimer } from "@/components/betting/BettingDisclaimer";

export const revalidate = 1800; // 30 min

export const metadata: Metadata = {
  title: "Value Bets MLB Hoy — A Lo Profundo",
  description:
    "Detecta apuestas con valor matemático: cuando nuestro modelo da mayor probabilidad que el mercado. Edge calculado en tiempo real.",
  keywords: [
    "value bets MLB",
    "apuestas con valor béisbol",
    "edge apuestas MLB",
    "picks con valor MLB",
  ],
};

export default async function ValueBetsPage() {
  let report;
  try {
    report = await buildValueBets();
  } catch (err) {
    console.error("[value-bets] failed", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Value Bets</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">
          Datos temporalmente no disponibles. Intenta de nuevo en unos minutos.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          VALUE BETS
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          {report.date} · {report.totalGamesAnalyzed} juegos analizados · Hora Bogotá
        </p>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs font-display uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#2E7D32]" />
          <span className="text-[#FDF6E3]/70">Edge alto (&gt;10%)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#F5C842]" />
          <span className="text-[#FDF6E3]/70">Edge medio (5-10%)</span>
        </span>
      </div>

      {report.valueBets.length === 0 ? (
        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-10 text-center space-y-2">
          <p className="font-heading text-xl text-[#3D2B1F]">
            No hay value bets para hoy
          </p>
          <p className="font-sans text-sm text-[#8B7355]">
            El mercado y nuestro modelo están alineados en todos los juegos de hoy.
            Esto es normal — las value bets no aparecen todos los días.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {report.valueBets.map((vb) => (
            <ValueBetCard key={`${vb.gamePk}-${vb.valueSide}`} bet={vb} />
          ))}
        </div>
      )}

      {/* Extra disclaimer for value bets */}
      <div className="bg-[#C41E3A]/10 border-2 border-[#C41E3A]/30 rounded-sm p-4">
        <p className="font-sans text-xs text-[#FDF6E3]/80 leading-relaxed">
          Una value bet es una oportunidad matemática según nuestro modelo, <strong>NO</strong> una
          garantía de ganancia. El modelo puede equivocarse. Apuesta con responsabilidad.
        </p>
      </div>

      <BettingDisclaimer />
    </div>
  );
}

function ValueBetCard({ bet }: { bet: ValueBet }) {
  const edgePct = (bet.edge * 100).toFixed(1);
  const modelPct = Math.round(bet.modelProb * 100);
  const marketPct = Math.round(bet.marketImpliedProb * 100);
  const badgeColor = bet.edgeLevel === "high" ? "bg-[#2E7D32]" : "bg-[#F5C842] text-[#3D2B1F]";

  return (
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0D2240] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={`/logos/${bet.awayTeam}.png`}
            alt={bet.awayTeam}
            width={24}
            height={24}
          />
          <span className="font-display text-xs text-[#8B7355]">
            {bet.awayTeam} @ {bet.homeTeam}
          </span>
          <Image
            src={`/logos/${bet.homeTeam}.png`}
            alt={bet.homeTeam}
            width={24}
            height={24}
          />
        </div>
        <span
          className={`font-display text-[10px] uppercase tracking-wider text-white px-2 py-0.5 rounded-sm ${badgeColor}`}
        >
          +{edgePct}% edge
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Value team highlight */}
        <div className="flex items-center gap-3">
          <Image
            src={`/logos/${bet.valueTeam}.png`}
            alt={bet.valueTeam}
            width={40}
            height={40}
          />
          <div>
            <p className="font-heading text-lg font-bold text-[#3D2B1F]">
              {bet.valueTeam}
              <span className="font-display text-xs text-[#8B7355] ml-2">
                ({bet.valueSide === "home" ? "Local" : "Visitante"})
              </span>
            </p>
            <p className="font-sans text-xs text-[#8B7355]">
              Mejor cuota: <span className="font-mono font-bold text-[#2E7D32]">{bet.bestOdds.toFixed(2)}</span> en {bet.bestBookmaker}
            </p>
          </div>
        </div>

        {/* Comparison bars */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-display uppercase tracking-wider text-[#8B7355]">Nuestro modelo</span>
            <span className="font-mono font-bold text-[#0D2240]">{modelPct}%</span>
          </div>
          <div className="w-full bg-[#8B7355]/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#0D2240] h-full rounded-full"
              style={{ width: `${modelPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-display uppercase tracking-wider text-[#8B7355]">Prob. implícita mercado</span>
            <span className="font-mono font-bold text-[#C41E3A]">{marketPct}%</span>
          </div>
          <div className="w-full bg-[#8B7355]/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#C41E3A] h-full rounded-full"
              style={{ width: `${marketPct}%` }}
            />
          </div>
        </div>

        {/* Pitchers */}
        {(bet.homePitcher || bet.awayPitcher) && (
          <div className="flex gap-4 text-xs text-[#8B7355] border-t border-[#8B7355]/20 pt-3">
            {bet.awayPitcher && (
              <span>{bet.awayTeam}: {bet.awayPitcher}</span>
            )}
            {bet.homePitcher && (
              <span>{bet.homeTeam}: {bet.homePitcher}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
