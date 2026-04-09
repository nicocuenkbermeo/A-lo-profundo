import type { Metadata } from "next";
import { buildChaseReport, type ProjectionCandidate, type ActiveStreak } from "@/lib/mlb/features/chase";
import { CHASE_EARLY_SEASON_MSG } from "@/lib/i18n/translations";

export const revalidate = 7200; // 2h

export const metadata: Metadata = {
  title: "Chase for History",
  description:
    "Jugadores acercándose a hitos históricos y rachas activas en la MLB: 50 HR, 50 SB, .300, rachas de hits y más.",
};

export default async function ChasePage() {
  let report;
  try {
    report = await buildChaseReport();
  } catch (err) {
    console.error("[chase] failed", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Chase for History</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">
          ⚾ Datos temporalmente no disponibles. Intenta de nuevo en unos minutos.
        </p>
      </div>
    );
  }

  const { projections, streaks, projectionsAvailable, season } = report;
  const hasAnyProjection =
    projections.hr50.length + projections.sb50.length + projections.wins20.length + projections.avg300.length > 0;
  const hasAnyStreak =
    streaks.hitStreak.length + streaks.obStreak.length + streaks.scorelessStreak.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          CHASE FOR HISTORY 🎯
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Temporada {season} · Hitos y rachas activas
        </p>
      </header>

      {/* Projections */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#FDF6E3]">PROYECCIONES DE HITOS</h2>

        {!projectionsAvailable ? (
          <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-6 text-center">
            <p className="font-sans text-sm text-[#3D2B1F]">{CHASE_EARLY_SEASON_MSG}</p>
          </div>
        ) : !hasAnyProjection ? (
          <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-6 text-center">
            <p className="font-sans text-sm text-[#3D2B1F]">
              Ningún jugador supera los umbrales de proyección aún esta temporada.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {projections.hr50.length > 0 && <ProjectionSection title="Camino a 50 HR" candidates={projections.hr50} />}
            {projections.sb50.length > 0 && <ProjectionSection title="Camino a 50 Bases Robadas" candidates={projections.sb50} />}
            {projections.wins20.length > 0 && <ProjectionSection title="Camino a 20 Victorias" candidates={projections.wins20} />}
            {projections.avg300.length > 0 && <ProjectionSection title="Persecución de .300" candidates={projections.avg300} />}
          </div>
        )}
      </section>

      {/* Streaks */}
      <section className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-[#FDF6E3]">RACHAS ACTIVAS 🔥</h2>

        {!hasAnyStreak ? (
          <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-6 text-center">
            <p className="font-sans text-sm text-[#3D2B1F]">
              No hay rachas activas que superen los umbrales mínimos (10+ juegos con hit, 20+
              embasándose, 15+ innings en blanco).
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {streaks.hitStreak.length > 0 && <StreakSection title="Racha de juegos con hit (10+)" streaks={streaks.hitStreak} />}
            {streaks.obStreak.length > 0 && <StreakSection title="Racha embasándose (20+)" streaks={streaks.obStreak} />}
            {streaks.scorelessStreak.length > 0 && <StreakSection title="Innings en blanco (15+)" streaks={streaks.scorelessStreak} />}
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectionSection({ title, candidates }: { title: string; candidates: ProjectionCandidate[] }) {
  return (
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
      <div className="bg-[#0D2240] text-[#F5C842] px-4 py-2 font-display text-xs uppercase tracking-wider">
        {title}
      </div>
      <ul className="divide-y divide-[#8B7355]/20">
        {candidates.map((c) => (
          <li key={c.personId} className="p-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.headshot}
              alt={c.fullName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full border-2 border-[#8B7355] bg-[#FFF8D6] object-cover shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-bold text-sm text-[#3D2B1F]">{c.fullName}</span>
                <span className="font-display text-[9px] uppercase text-[#8B7355]">{c.teamAbbr}</span>
              </div>
              <ProgressBar current={c.progressPct} projected={c.projectedPct} />
              <div className="flex items-center gap-3 font-mono text-[11px] text-[#8B7355]">
                <span>
                  Actual: <span className="font-bold text-[#3D2B1F]">{c.statLabel === "AVG" ? c.currentValue.toFixed(3) : c.currentValue}</span>
                </span>
                {c.statLabel !== "AVG" && (
                  <span>
                    Proyección: <span className="font-bold text-[#0D2240]">{c.projected}</span>
                  </span>
                )}
                <span>
                  Meta: <span className="font-bold text-[#C41E3A]">{c.statLabel === "AVG" ? c.milestone.toFixed(3) : c.milestone}</span>
                </span>
                <span className="text-[#8B7355]/60">({c.gamesPlayed} GP)</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProgressBar({ current, projected }: { current: number; projected: number }) {
  const currentPct = Math.min(current * 100, 100);
  const projectedPct = Math.min(projected * 100, 120); // allow slight overflow
  return (
    <div
      className="relative w-full h-3 bg-[#8B7355]/20 rounded-sm overflow-visible"
      role="progressbar"
      aria-valuenow={Math.round(currentPct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Projected mark (translucent) */}
      {projectedPct > currentPct && (
        <div
          className="absolute top-0 left-0 h-full bg-[#F5C842]/30 rounded-sm"
          style={{ width: `${Math.min(projectedPct, 100)}%` }}
        />
      )}
      {/* Current (solid) */}
      <div
        className="absolute top-0 left-0 h-full bg-[#C41E3A] rounded-sm"
        style={{ width: `${currentPct}%` }}
      />
    </div>
  );
}

function StreakSection({ title, streaks }: { title: string; streaks: ActiveStreak[] }) {
  return (
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
      <div className="bg-[#0D2240] text-[#F5C842] px-4 py-2 font-display text-xs uppercase tracking-wider">
        {title}
      </div>
      <ul className="divide-y divide-[#8B7355]/20">
        {streaks.map((s) => (
          <li key={s.personId} className="p-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.headshot}
              alt={s.fullName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full border-2 border-[#8B7355] bg-[#FFF8D6] object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-bold text-sm text-[#3D2B1F]">{s.fullName}</span>
                <span className="font-display text-[9px] uppercase text-[#8B7355]">{s.teamAbbr}</span>
              </div>
              <p className="font-mono text-xs text-[#8B7355] mt-0.5">Desde {s.startDate}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-heading text-3xl font-black text-[#C41E3A]">{s.streakLength}</span>
              <p className="font-display text-[9px] uppercase text-[#8B7355]">{s.unit}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
