import type { Metadata } from "next";
import Image from "next/image";
import { buildBullpenReport, type BullpenStatus, type TeamBullpenReport } from "@/lib/mlb/features/bullpens";

export const revalidate = 7200; // 2h

export const metadata: Metadata = {
  title: "Reporte de Bullpens",
  description:
    "Estado de los bullpens de la MLB: qué equipos están frescos, cansados o agotados según el uso de los últimos 3 días.",
};

const STATUS_LABEL: Record<BullpenStatus, string> = {
  green: "Fresco",
  yellow: "Cansado",
  red: "Agotado",
};

const STATUS_ICON: Record<BullpenStatus, string> = {
  green: "🟢",
  yellow: "🟡",
  red: "🔴",
};

const STATUS_BG: Record<BullpenStatus, string> = {
  green: "bg-[#2E7D32] text-white",
  yellow: "bg-[#C9A227] text-[#3D2B1F]",
  red: "bg-[#C41E3A] text-white",
};

const STATUS_BORDER: Record<BullpenStatus, string> = {
  green: "border-[#2E7D32]",
  yellow: "border-[#C9A227]",
  red: "border-[#C41E3A]",
};

function formatWindow(start: string, end: string): string {
  const f = (ymd: string) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-CO", {
      timeZone: "America/Bogota",
      day: "2-digit",
      month: "short",
    });
  };
  return `${f(start)} — ${f(end)}`;
}

export default async function BullpensPage() {
  let report;
  try {
    report = await buildBullpenReport();
  } catch (err) {
    console.error("[bullpens] failed to build report", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Reporte de Bullpens</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">
          ⚾ Datos temporalmente no disponibles. Intenta de nuevo en unos minutos.
        </p>
      </div>
    );
  }

  const totals = {
    red: report.teams.filter((t) => t.status === "red").length,
    yellow: report.teams.filter((t) => t.status === "yellow").length,
    green: report.teams.filter((t) => t.status === "green").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          REPORTE DE BULLPENS
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Ventana de análisis: {formatWindow(report.windowStart, report.windowEnd)} · Hora Bogotá
        </p>
      </header>

      {/* Leyenda / summary */}
      <section
        aria-label="Resumen del estado de los bullpens"
        className="flex flex-wrap items-center gap-3 bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm px-4 py-3"
      >
        <StatusPill status="red" count={totals.red} />
        <StatusPill status="yellow" count={totals.yellow} />
        <StatusPill status="green" count={totals.green} />
        <span className="font-display text-[10px] uppercase tracking-wider text-[#8B7355] ml-auto">
          Umbrales por relevista: 🔴 ≥40 pitcheos o 3 días seguidos · 🟡 25–39 pitcheos o 2 días · 🟢 &lt;25
        </span>
      </section>

      {/* Grid */}
      <section
        aria-label="Estado por equipo"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {report.teams.map((team) => (
          <TeamCard key={team.teamId} team={team} />
        ))}
      </section>
    </div>
  );
}

function StatusPill({ status, count }: { status: BullpenStatus; count: number }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm font-display text-xs uppercase tracking-wider ${STATUS_BG[status]}`}
      aria-label={`${count} equipos en estado ${STATUS_LABEL[status]}`}
    >
      <span aria-hidden>{STATUS_ICON[status]}</span>
      <span className="font-bold">{count}</span>
      {STATUS_LABEL[status]}
    </span>
  );
}

function TeamCard({ team }: { team: TeamBullpenReport }) {
  const top = team.relievers.slice(0, 5);
  const hasData = team.relievers.length > 0;

  return (
    <article
      className={`relative bg-[#FDF6E3] border-[3px] ${STATUS_BORDER[team.status]} shadow-[4px_4px_0px_#5C4A32] rounded-sm`}
      aria-labelledby={`team-${team.teamId}-title`}
    >
      <header className="flex items-center justify-between gap-3 p-4 border-b-2 border-dashed border-[#8B7355]/40">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={`/logos/${team.abbreviation}.png`}
            alt={team.teamName}
            width={40}
            height={40}
            className="shrink-0 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.25)]"
          />
          <div className="min-w-0">
            <h2
              id={`team-${team.teamId}-title`}
              className="font-heading font-bold text-sm text-[#3D2B1F] truncate"
            >
              {team.teamName}
            </h2>
            <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
              {team.abbreviation}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-display text-[10px] uppercase tracking-wider ${STATUS_BG[team.status]}`}
          aria-label={`Bullpen ${STATUS_LABEL[team.status]}`}
        >
          <span aria-hidden>{STATUS_ICON[team.status]}</span>
          {STATUS_LABEL[team.status]}
        </span>
      </header>

      <div className="p-4">
        {!hasData ? (
          <p className="font-sans text-xs text-[#8B7355] italic">
            Sin relevistas registrados en la ventana.
          </p>
        ) : (
          <ul className="space-y-2">
            {top.map((r) => (
              <li
                key={r.personId}
                className="flex items-center justify-between gap-3 font-sans text-xs text-[#3D2B1F]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span aria-hidden>{STATUS_ICON[r.status]}</span>
                  <span className="truncate">{r.fullName}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#8B7355] shrink-0">
                  <span aria-label={`${r.totalPitches} pitcheos en los últimos 3 días`}>
                    {r.totalPitches} P
                  </span>
                  <span className="text-[#8B7355]/60">·</span>
                  <span aria-label={`${r.daysAppeared} días de trabajo`}>{r.daysAppeared}d</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
