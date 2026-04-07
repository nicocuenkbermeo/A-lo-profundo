import type { Metadata } from "next";
import Link from "next/link";
import { buildMomentOfDay } from "@/lib/mlb/features/moment-of-day";

export const revalidate = 21600; // 6h — yesterday's data doesn't change

export const metadata: Metadata = {
  title: "El Momento del Día",
  description:
    "La jugada más dramática de la jornada anterior en la MLB, elegida por captivatingIndex y WPA.",
};

function scoreRunChange(
  before: { home: number; away: number },
  after: { home: number; away: number },
): number {
  const bh = before.home;
  const ba = before.away;
  const ah = after.home;
  const aa = after.away;
  const runs = (ah - bh) + (aa - ba);
  return runs;
}

export default async function MomentOfDayPage() {
  let report;
  try {
    report = await buildMomentOfDay();
  } catch (err) {
    console.error("[moment-of-day] failed", err);
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">El Momento del Día</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">
          ⚾ Datos temporalmente no disponibles. Intenta de nuevo en unos minutos.
        </p>
      </div>
    );
  }

  const { moment, date, stats } = report;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Jornada del {date} · Hora Bogotá
        </p>
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          EL MOMENTO DEL DÍA
        </h1>
      </header>

      {!moment ? (
        <section
          className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-8 text-center"
          aria-live="polite"
        >
          <p className="font-heading text-xl text-[#3D2B1F]">
            ⚾ No hubo jugadas finales suficientes en la jornada anterior.
          </p>
          <p className="mt-2 font-sans text-sm text-[#8B7355]">
            {stats.gamesAnalyzed} juegos analizados · {stats.gamesSkippedNonFinal} sin finalizar.
          </p>
        </section>
      ) : (
        <>
          <article
            className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[6px_6px_0px_#5C4A32] rounded-sm overflow-hidden"
            aria-labelledby="moment-title"
          >
            <div className="absolute top-[6px] left-[6px] w-5 h-5 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
            <div className="absolute top-[6px] right-[6px] w-5 h-5 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
            <div className="absolute bottom-[6px] left-[6px] w-5 h-5 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
            <div className="absolute bottom-[6px] right-[6px] w-5 h-5 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 p-6">
              {/* Batter headshot */}
              <div className="flex md:block items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={moment.batterHeadshot}
                  alt={moment.batterName || "Bateador"}
                  width={180}
                  height={180}
                  loading="eager"
                  className="w-32 md:w-[180px] h-auto rounded-sm border-2 border-[#8B7355] shadow-[3px_3px_0px_#5C4A32] bg-[#FFF8D6]"
                />
                <div className="md:mt-3">
                  <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
                    Bateador
                  </p>
                  <p className="font-heading font-bold text-[#3D2B1F]">{moment.batterName || "—"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
                  <span className="bg-[#0D2240] text-[#F5C842] px-2 py-0.5 rounded-sm">
                    {moment.gameLabel}
                  </span>
                  <span>{moment.contextEs}</span>
                </div>

                <h2 id="moment-title" className="font-heading text-2xl lg:text-3xl font-bold text-[#3D2B1F] leading-tight">
                  {moment.descriptionEn}
                </h2>

                <div className="flex flex-wrap items-center gap-4">
                  <div
                    className="flex items-baseline gap-2 bg-[#0D2240] text-[#F5C842] px-3 py-1.5 rounded-sm font-mono"
                    aria-label={`Marcador antes ${moment.scoreBefore.away} a ${moment.scoreBefore.home}, después ${moment.scoreAfter.away} a ${moment.scoreAfter.home}`}
                  >
                    <span className="text-xs">
                      {moment.scoreBefore.away}-{moment.scoreBefore.home}
                    </span>
                    <span aria-hidden>→</span>
                    <span className="font-bold">
                      {moment.scoreAfter.away}-{moment.scoreAfter.home}
                    </span>
                  </div>
                  {scoreRunChange(moment.scoreBefore, moment.scoreAfter) !== 0 && (
                    <span className="font-display text-xs text-[#C41E3A] font-bold">
                      {Math.abs(scoreRunChange(moment.scoreBefore, moment.scoreAfter))} carrera(s) en la jugada
                    </span>
                  )}
                </div>

                <dl className="flex flex-wrap gap-4 text-xs">
                  <div>
                    <dt className="font-display uppercase tracking-wider text-[#8B7355]">Pitcher</dt>
                    <dd className="font-sans font-bold text-[#3D2B1F]">{moment.pitcherName || "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-display uppercase tracking-wider text-[#8B7355]">
                      Índice de drama
                    </dt>
                    <dd className="font-mono font-bold text-[#3D2B1F]">
                      {moment.scoreSource === "captivatingIndex"
                        ? `${Math.round(moment.score)}/100 (captivatingIndex)`
                        : `${moment.score.toFixed(2)} (WPA heurístico)`}
                    </dd>
                  </div>
                </dl>

                <div className="pt-2">
                  <Link
                    href={`/scores/${moment.gameId}`}
                    className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-4 py-2 rounded-sm font-display text-xs uppercase tracking-wider hover:bg-[#A01829] transition-colors"
                  >
                    Ver juego completo →
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <section
            aria-label="Detalles del análisis"
            className="bg-[#FDF6E3]/50 border-2 border-dashed border-[#8B7355] rounded-sm p-4 font-mono text-[11px] text-[#8B7355]"
          >
            {stats.gamesAnalyzed} juegos finales analizados · {stats.gamesSkippedNonFinal} sin
            finalizar · {stats.playsConsidered} jugadas consideradas · {stats.playsDiscardedTrivial}{" "}
            descartadas por triviales
          </section>
        </>
      )}
    </div>
  );
}
