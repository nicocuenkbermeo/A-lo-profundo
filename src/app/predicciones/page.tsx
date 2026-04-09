import type { Metadata } from "next";
import { buildPredictions, type GamePrediction } from "@/lib/mlb/features/predictions";
import { BettingDisclaimer } from "@/components/betting/BettingDisclaimer";
import Image from "next/image";

export const revalidate = 7200; // 2 hours

export const metadata: Metadata = {
  title: "Predicciones MLB Hoy — A Lo Profundo",
  description:
    "Predicciones diarias de béisbol MLB con modelo estadístico propio. Porcentaje de confianza, desglose del cálculo y picks transparentes.",
  keywords: [
    "predicciones MLB hoy",
    "pronósticos béisbol",
    "picks MLB",
    "cuotas MLB en español",
    "modelo predicciones béisbol",
  ],
};

export default async function PrediccionesPage() {
  let report;
  try {
    report = await buildPredictions();
  } catch (err) {
    console.error("[predicciones] failed", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">
          Predicciones MLB
        </h1>
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
          PREDICCIONES MLB
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          {report.date} · Modelo Pythagorean + ajustes contextuales · Hora
          Bogotá
        </p>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs font-display uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#2E7D32]" />
          <span className="text-[#FDF6E3]/70">Alta (&gt;65%)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#F5C842]" />
          <span className="text-[#FDF6E3]/70">Media (55-65%)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#8B7355]" />
          <span className="text-[#FDF6E3]/70">Baja (&lt;55%)</span>
        </span>
      </div>

      {report.games.length === 0 ? (
        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-10 text-center">
          <p className="font-heading text-xl text-[#3D2B1F]">
            No hay juegos programados para hoy.
          </p>
          <p className="font-sans text-sm text-[#8B7355] mt-2">
            Las predicciones se generan para partidos con estado &quot;Programado&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {report.games.map((game) => (
            <PredictionCard key={game.gamePk} game={game} />
          ))}
        </div>
      )}

      <BettingDisclaimer />
    </div>
  );
}

function PredictionCard({ game }: { game: GamePrediction }) {
  const { prediction, breakdown, homeTeam, awayTeam } = game;
  const confPct = Math.round(prediction.confidence * 100);
  const homeWinPct = Math.round(prediction.homeWinProb * 100);
  const awayWinPct = Math.round(prediction.awayWinProb * 100);

  const badgeColor =
    game.confidenceLevel === "high"
      ? "bg-[#2E7D32]"
      : game.confidenceLevel === "medium"
        ? "bg-[#F5C842] text-[#3D2B1F]"
        : "bg-[#8B7355]";

  const winnerTeam =
    prediction.winner === "home" ? homeTeam : awayTeam;

  return (
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
      {/* Header with time and pending badge */}
      <div className="bg-[#0D2240] px-4 py-2 flex items-center justify-between">
        <span className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
          {game.startTime}
        </span>
        <div className="flex items-center gap-2">
          {game.pending && (
            <span className="font-display text-[10px] uppercase tracking-wider text-[#F5C842] bg-[#F5C842]/20 px-2 py-0.5 rounded-sm">
              Abridor pendiente
            </span>
          )}
          {game.earlySeason && (
            <span className="font-display text-[10px] uppercase tracking-wider text-[#8B7355] bg-[#8B7355]/20 px-2 py-0.5 rounded-sm">
              Temporada temprana
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Teams matchup */}
        <div className="flex items-center justify-between gap-4">
          {/* Away team */}
          <div className="flex-1 text-center">
            <Image
              src={`/logos/${awayTeam.abbreviation}.png`}
              alt={awayTeam.abbreviation}
              width={48}
              height={48}
              className="mx-auto mb-1"
            />
            <p className="font-heading text-sm font-bold text-[#3D2B1F]">
              {awayTeam.abbreviation}
            </p>
            <p className="font-mono text-lg font-bold text-[#0D2240]">
              {awayWinPct}%
            </p>
            {game.awayPitcher && (
              <p className="font-sans text-[11px] text-[#8B7355] mt-1">
                {game.awayPitcher.name}
                <br />
                ERA {game.awayPitcher.era.toFixed(2)}
              </p>
            )}
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="font-display text-xs text-[#8B7355]">VS</span>
            <div
              className={`px-3 py-1 rounded-sm font-display text-xs font-bold uppercase tracking-wider text-white ${badgeColor}`}
            >
              {confPct}%
            </div>
            <p className="font-display text-[10px] text-[#8B7355] uppercase">
              {winnerTeam.abbreviation}
            </p>
          </div>

          {/* Home team */}
          <div className="flex-1 text-center">
            <Image
              src={`/logos/${homeTeam.abbreviation}.png`}
              alt={homeTeam.abbreviation}
              width={48}
              height={48}
              className="mx-auto mb-1"
            />
            <p className="font-heading text-sm font-bold text-[#3D2B1F]">
              {homeTeam.abbreviation}
            </p>
            <p className="font-mono text-lg font-bold text-[#0D2240]">
              {homeWinPct}%
            </p>
            {game.homePitcher && (
              <p className="font-sans text-[11px] text-[#8B7355] mt-1">
                {game.homePitcher.name}
                <br />
                ERA {game.homePitcher.era.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Narrative */}
        <p className="font-sans text-sm text-[#3D2B1F] leading-relaxed border-t border-[#8B7355]/20 pt-3">
          {game.narrative}
        </p>

        {/* Breakdown (collapsible via details) */}
        <details className="group">
          <summary className="cursor-pointer font-display text-xs uppercase tracking-wider text-[#C41E3A] hover:text-[#0D2240] transition-colors">
            Ver desglose del cálculo
          </summary>
          <div className="mt-3 space-y-2 text-xs font-mono text-[#3D2B1F]">
            <div className="flex justify-between border-b border-[#8B7355]/10 pb-1">
              <span>Pythagorean (local)</span>
              <span>{(breakdown.pythag.home * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between border-b border-[#8B7355]/10 pb-1">
              <span>Pythagorean (visitante)</span>
              <span>{(breakdown.pythag.away * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between border-b border-[#8B7355]/10 pb-1">
              <span>Ventaja local</span>
              <span>+{(breakdown.homeFieldBonus * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between border-b border-[#8B7355]/10 pb-1">
              <span>Ajuste abridores</span>
              <span>
                {breakdown.pitcherDelta >= 0 ? "+" : ""}
                {(breakdown.pitcherDelta * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between border-b border-[#8B7355]/10 pb-1">
              <span>Forma reciente (L10)</span>
              <span>
                {breakdown.recentFormDelta >= 0 ? "+" : ""}
                {(breakdown.recentFormDelta * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bullpen fatigue</span>
              <span>
                {breakdown.bullpenDelta >= 0 ? "+" : ""}
                {(breakdown.bullpenDelta * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
