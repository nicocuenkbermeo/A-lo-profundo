import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  buildPowerRankings,
  type Movement,
  type PowerRankingRow,
} from "@/lib/mlb/features/power-rankings";

export const revalidate = 3600; // 1h (the raw standings/stats layer caches too)

export const metadata: Metadata = {
  title: "Power Rankings",
  description:
    "Ranking semanal A Lo Profundo de las 30 franquicias de la MLB calculado con récord, diferencia de carreras, últimos 10 juegos, OPS y ERA reciente.",
};

const MOVEMENT_LABEL: Record<Movement, string> = {
  up: "Sube",
  down: "Baja",
  same: "Sin cambios",
  new: "Sin historial previo",
};

function MovementMark({ movement, delta }: { movement: Movement; delta: number }) {
  if (movement === "up") {
    return (
      <span
        className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#2E7D32]"
        aria-label={`${MOVEMENT_LABEL.up} ${Math.abs(delta)} posiciones`}
      >
        <span aria-hidden>▲</span>
        {Math.abs(delta)}
      </span>
    );
  }
  if (movement === "down") {
    return (
      <span
        className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#C41E3A]"
        aria-label={`${MOVEMENT_LABEL.down} ${Math.abs(delta)} posiciones`}
      >
        <span aria-hidden>▼</span>
        {Math.abs(delta)}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center font-mono text-xs text-[#8B7355]"
      aria-label={movement === "new" ? MOVEMENT_LABEL.new : MOVEMENT_LABEL.same}
    >
      —
    </span>
  );
}

export default async function PowerRankingsPage() {
  let report;
  try {
    report = await buildPowerRankings();
  } catch (err) {
    console.error("[power-rankings] failed", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Power Rankings</h1>
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
          POWER RANKINGS
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Temporada {report.season} · Semana del {report.weekStart} · Hora Bogotá
        </p>
        <p className="font-sans text-sm text-[#FDF6E3]/80 max-w-3xl">
          Ranking algorítmico basado en récord, diferencia de carreras por juego, últimos 10
          juegos, OPS de equipo (15 días), ERA de rotación (15 días) y racha activa. Se
          recalcula cada hora; los movimientos ▲▼ comparan contra la última foto semanal
          guardada.
        </p>
      </header>

      <ol className="space-y-3">
        {report.rankings.map((row) => (
          <RankingRow key={row.teamId} row={row} />
        ))}
      </ol>
    </div>
  );
}

function RankingRow({ row }: { row: PowerRankingRow }) {
  return (
    <li
      className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
      aria-labelledby={`pr-${row.teamId}-name`}
    >
      <div className="flex items-center gap-4 shrink-0">
        <span
          className="font-heading font-black text-3xl text-[#0D2240] tabular-nums w-10 text-center"
          aria-hidden
        >
          {row.rank}
        </span>
        <Image
          src={`/logos/${row.abbreviation}.png`}
          alt={row.teamName}
          width={52}
          height={52}
          className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.25)]"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h2
            id={`pr-${row.teamId}-name`}
            className="font-heading font-bold text-lg text-[#3D2B1F]"
          >
            {row.teamName}
          </h2>
          <Link
            href={`/teams/${row.abbreviation}`}
            className="font-display text-[10px] uppercase tracking-wider text-[#0D2240] hover:text-[#C41E3A]"
          >
            Ver equipo →
          </Link>
          <MovementMark movement={row.movement} delta={row.movementDelta} />
        </div>
        <p className="font-sans text-xs text-[#3D2B1F]/80">{row.narrative}</p>
      </div>

      <dl className="grid grid-cols-4 gap-2 text-center shrink-0 w-full sm:w-auto">
        <Stat label="Récord" value={row.record} />
        <Stat label="L10" value={row.last10} />
        <Stat label="OPS 15d" value={row.ops15.toFixed(3)} />
        <Stat label="ERA 15d" value={row.era15.toFixed(2)} />
      </dl>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[60px]">
      <dt className="font-display text-[9px] uppercase tracking-wider text-[#8B7355]">{label}</dt>
      <dd className="font-mono text-sm font-bold text-[#3D2B1F]">{value}</dd>
    </div>
  );
}
