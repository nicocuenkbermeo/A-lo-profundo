import type { Metadata } from "next";
import { buildDuelsReport, type DuelMatchup, type DuelAdvantage } from "@/lib/mlb/features/duel-of-day";

export const revalidate = 7200; // 2h — lineups change during the day

export const metadata: Metadata = {
  title: "Duelos del Día",
  description:
    "Los matchups históricos más jugosos entre bateadores y abridores en los juegos de hoy en la MLB.",
};

const ADVANTAGE_LABEL: Record<DuelAdvantage, string> = {
  batter: "Ventaja bateador",
  pitcher: "Ventaja pitcher",
  even: "Parejo",
};

const ADVANTAGE_STYLE: Record<DuelAdvantage, string> = {
  batter: "bg-[#2E7D32] text-white",
  pitcher: "bg-[#C41E3A] text-white",
  even: "bg-[#8B7355] text-white",
};

export default async function DuelsPage() {
  let report;
  try {
    report = await buildDuelsReport();
  } catch (err) {
    console.error("[duels] failed", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Duelos del Día</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">
          ⚾ Datos temporalmente no disponibles. Intenta de nuevo en unos minutos.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          DUELOS DEL DÍA
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          {report.date} · Matchups históricos más jugosos · Hora Bogotá
        </p>
      </header>

      {report.duels.length === 0 ? (
        <section className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-8 text-center">
          <p className="font-heading text-xl text-[#3D2B1F]">
            ⚾ No hay lineups confirmados aún para hoy.
          </p>
          <p className="mt-2 font-sans text-sm text-[#8B7355]">
            Los lineups suelen publicarse 2-3 horas antes del primer juego. Vuelve más tarde.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {report.duels.map((d) => (
            <DuelCard key={`${d.batterId}-${d.pitcherId}`} duel={d} />
          ))}
        </div>
      )}

      <section
        aria-label="Detalles del análisis"
        className="bg-[#FDF6E3]/50 border-2 border-dashed border-[#8B7355] rounded-sm p-4 font-mono text-[11px] text-[#8B7355]"
      >
        {report.stats.gamesWithLineups} juegos con lineup ·{" "}
        {report.stats.gamesSkipped} sin lineup/abridor ·{" "}
        {report.stats.vsPlayerCalls} consultas de head-to-head ·{" "}
        {report.stats.vsPlayerErrors} errores
      </section>
    </div>
  );
}

function DuelCard({ duel }: { duel: DuelMatchup }) {
  return (
    <article className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
      {/* Game header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0D2240]">
        <span className="font-display text-[10px] uppercase tracking-wider text-[#F5C842]">
          {duel.gameLabel}
        </span>
        <span
          className={`px-2 py-0.5 rounded-sm font-display text-[10px] uppercase tracking-wider ${ADVANTAGE_STYLE[duel.advantage]}`}
        >
          {ADVANTAGE_LABEL[duel.advantage]}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Versus layout */}
        <div className="flex items-center gap-4">
          {/* Batter */}
          <div className="flex-1 flex flex-col items-center text-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={duel.batterHeadshot}
              alt={duel.batterName}
              width={72}
              height={72}
              className="w-16 h-16 rounded-full border-2 border-[#2E7D32] bg-[#FFF8D6] object-cover"
            />
            <div>
              <p className="font-heading font-bold text-xs text-[#3D2B1F] leading-tight">{duel.batterName}</p>
              <p className="font-display text-[9px] uppercase text-[#8B7355]">{duel.batterTeamAbbr}</p>
            </div>
          </div>

          {/* VS */}
          <span className="font-heading text-2xl font-black text-[#C41E3A] italic shrink-0">VS</span>

          {/* Pitcher */}
          <div className="flex-1 flex flex-col items-center text-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={duel.pitcherHeadshot}
              alt={duel.pitcherName}
              width={72}
              height={72}
              className="w-16 h-16 rounded-full border-2 border-[#C41E3A] bg-[#FFF8D6] object-cover"
            />
            <div>
              <p className="font-heading font-bold text-xs text-[#3D2B1F] leading-tight">{duel.pitcherName}</p>
              <p className="font-display text-[9px] uppercase text-[#8B7355]">{duel.pitcherTeamAbbr}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-1 text-center border-t-2 border-dashed border-[#C41E3A]/40 pt-3">
          <StatCell label="AB" value={String(duel.ab)} />
          <StatCell label="H" value={String(duel.hits)} />
          <StatCell label="HR" value={String(duel.hr)} />
          <StatCell label="AVG" value={duel.avg} />
          <StatCell label="OPS" value={duel.ops} />
        </div>

        {/* Narrative */}
        <p className="font-sans text-xs text-[#3D2B1F]/80 italic">{duel.narrative}</p>
      </div>
    </article>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-[9px] uppercase tracking-wider text-[#8B7355]">{label}</p>
      <p className="font-mono text-sm font-bold text-[#3D2B1F]">{value}</p>
    </div>
  );
}
