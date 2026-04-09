import type { Metadata } from "next";
import Image from "next/image";
import { buildOddsReport, BOOKMAKERS, type GameOdds, type Bookmaker } from "@/lib/mlb/features/odds";
import { BettingDisclaimer } from "@/components/betting/BettingDisclaimer";

export const revalidate = 1800; // 30 min

export const metadata: Metadata = {
  title: "Comparador de Cuotas MLB — A Lo Profundo",
  description:
    "Compara cuotas de las mejores casas de apuestas para MLB: Betano, Betsson, Rivalo, Codere, Caliente, Bet365. Encuentra la mejor línea.",
  keywords: [
    "cuotas MLB en español",
    "comparador cuotas béisbol",
    "mejores cuotas MLB",
    "apuestas MLB LatAm",
  ],
};

export default async function CuotasPage() {
  let report;
  try {
    report = await buildOddsReport();
  } catch (err) {
    console.error("[cuotas] failed", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Comparador de Cuotas</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">
          Datos temporalmente no disponibles. Intenta de nuevo en unos minutos.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          COMPARADOR DE CUOTAS
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          {report.date} · {report.games.length} juegos ·{" "}
          {report.source === "mock" ? "Datos de ejemplo" : "The Odds API"} · Hora Bogotá
        </p>
      </header>

      {report.source === "mock" && (
        <div className="bg-[#F5C842]/10 border-2 border-[#F5C842]/30 rounded-sm p-3">
          <p className="font-sans text-xs text-[#F5C842]">
            Las cuotas mostradas son datos de ejemplo para demostración. Pronto integraremos cuotas en tiempo real.
          </p>
        </div>
      )}

      {report.games.length === 0 ? (
        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-10 text-center">
          <p className="font-heading text-xl text-[#3D2B1F]">
            No hay cuotas disponibles para hoy.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {report.games.map((game) => (
            <GameOddsCard key={game.gamePk} game={game} />
          ))}
        </div>
      )}

      <BettingDisclaimer />
    </div>
  );
}

function GameOddsCard({ game }: { game: GameOdds }) {
  return (
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
      {/* Game header */}
      <div className="bg-[#0D2240] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={`/logos/${game.awayTeam}.png`}
            alt={game.awayTeam}
            width={28}
            height={28}
          />
          <span className="font-heading text-sm font-bold text-[#FDF6E3]">
            {game.awayTeam}
          </span>
          <span className="font-display text-xs text-[#8B7355]">@</span>
          <Image
            src={`/logos/${game.homeTeam}.png`}
            alt={game.homeTeam}
            width={28}
            height={28}
          />
          <span className="font-heading text-sm font-bold text-[#FDF6E3]">
            {game.homeTeam}
          </span>
        </div>
        {game.bestOdds.home && (
          <span className="font-display text-[10px] uppercase tracking-wider text-[#2E7D32] bg-[#2E7D32]/20 px-2 py-0.5 rounded-sm hidden sm:inline-block">
            Mejor: {game.bestOdds.home.bookmaker}
          </span>
        )}
      </div>

      {/* Desktop: table layout (hidden on mobile) */}
      <div className="hidden md:block">
        <OddsTable game={game} />
      </div>

      {/* Mobile: stacked cards per bookmaker */}
      <div className="md:hidden p-3 space-y-2">
        {BOOKMAKERS.map((bk) => (
          <BookmakerCard key={bk} bookmaker={bk} game={game} />
        ))}
      </div>
    </div>
  );
}

function OddsTable({ game }: { game: GameOdds }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-center">
        <thead>
          <tr className="border-b-2 border-[#8B7355]/20">
            <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-[#8B7355] text-left">
              Casa
            </th>
            <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
              {game.awayTeam} ML
            </th>
            <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
              {game.homeTeam} ML
            </th>
            <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
              {game.awayTeam} {game.runLine.away.line > 0 ? "+" : ""}{game.runLine.away.line}
            </th>
            <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
              {game.homeTeam} {game.runLine.home.line}
            </th>
            <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
              O {game.total.line}
            </th>
            <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
              U {game.total.line}
            </th>
          </tr>
        </thead>
        <tbody>
          {BOOKMAKERS.map((bk) => {
            const awayML = game.moneyline.away[bk];
            const homeML = game.moneyline.home[bk];
            const isBestHome = game.bestOdds.home?.bookmaker === bk;
            const isBestAway = game.bestOdds.away?.bookmaker === bk;

            return (
              <tr
                key={bk}
                className="border-b border-[#8B7355]/10 hover:bg-[#F5E6C8] transition-colors"
              >
                <td className="px-3 py-2.5 font-sans text-sm text-[#3D2B1F] text-left font-medium">
                  {bk}
                </td>
                <OddsCell value={awayML} isBest={isBestAway} />
                <OddsCell value={homeML} isBest={isBestHome} />
                <OddsCell value={game.runLine.away.odds[bk]} />
                <OddsCell value={game.runLine.home.odds[bk]} />
                <OddsCell value={game.total.over[bk]} />
                <OddsCell value={game.total.under[bk]} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function OddsCell({ value, isBest }: { value?: number; isBest?: boolean }) {
  if (value == null) {
    return <td className="px-3 py-2.5 font-mono text-xs text-[#8B7355]">—</td>;
  }
  return (
    <td className="px-3 py-2.5">
      <span
        className={`font-mono text-sm ${
          isBest
            ? "font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-1.5 py-0.5 rounded-sm"
            : "text-[#3D2B1F]"
        }`}
      >
        {value.toFixed(2)}
      </span>
    </td>
  );
}

function BookmakerCard({ bookmaker, game }: { bookmaker: Bookmaker; game: GameOdds }) {
  const awayML = game.moneyline.away[bookmaker];
  const homeML = game.moneyline.home[bookmaker];
  const isBestHome = game.bestOdds.home?.bookmaker === bookmaker;
  const isBestAway = game.bestOdds.away?.bookmaker === bookmaker;

  return (
    <div className="border border-[#8B7355]/20 rounded-sm p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-sm font-medium text-[#3D2B1F]">{bookmaker}</span>
        {(isBestHome || isBestAway) && (
          <span className="font-display text-[9px] uppercase tracking-wider text-[#2E7D32] bg-[#2E7D32]/10 px-1.5 py-0.5 rounded-sm">
            Mejor cuota
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="font-display text-[9px] uppercase tracking-wider text-[#8B7355]">
            {game.awayTeam}
          </p>
          <p className={`font-mono text-sm ${isBestAway ? "font-bold text-[#2E7D32]" : "text-[#3D2B1F]"}`}>
            {awayML?.toFixed(2) ?? "—"}
          </p>
        </div>
        <div>
          <p className="font-display text-[9px] uppercase tracking-wider text-[#8B7355]">
            {game.homeTeam}
          </p>
          <p className={`font-mono text-sm ${isBestHome ? "font-bold text-[#2E7D32]" : "text-[#3D2B1F]"}`}>
            {homeML?.toFixed(2) ?? "—"}
          </p>
        </div>
        <div>
          <p className="font-display text-[9px] uppercase tracking-wider text-[#8B7355]">
            O/U {game.total.line}
          </p>
          <p className="font-mono text-xs text-[#3D2B1F]">
            {game.total.over[bookmaker]?.toFixed(2) ?? "—"}/{game.total.under[bookmaker]?.toFixed(2) ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
