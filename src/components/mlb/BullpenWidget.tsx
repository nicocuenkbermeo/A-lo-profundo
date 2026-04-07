// Widget summary for /trends. Fetches the same bullpen report (re-uses
// Next's data cache thanks to revalidate+tags, so no extra API calls).

import Link from "next/link";
import Image from "next/image";
import { buildBullpenReport, type BullpenStatus } from "@/lib/mlb/features/bullpens";

const STATUS_BG: Record<BullpenStatus, string> = {
  green: "bg-[#2E7D32] text-white",
  yellow: "bg-[#C9A227] text-[#3D2B1F]",
  red: "bg-[#C41E3A] text-white",
};

export async function BullpenWidget() {
  let report;
  try {
    report = await buildBullpenReport();
  } catch {
    return null; // fail silently in the widget, full page has the error state
  }

  const redTeams = report.teams.filter((t) => t.status === "red").slice(0, 5);

  return (
    <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-heading font-bold text-sm text-[#3D2B1F]">Bullpens en rojo</h3>
        <Link
          href="/bullpens"
          className="font-display text-[10px] uppercase tracking-wider text-[#C41E3A] hover:underline"
        >
          Reporte completo →
        </Link>
      </div>

      {redTeams.length === 0 ? (
        <p className="font-sans text-xs text-[#8B7355] italic">
          Ningún bullpen está en rojo hoy. Todos los equipos tienen relevistas disponibles.
        </p>
      ) : (
        <ul className="space-y-2">
          {redTeams.map((t) => (
            <li key={t.teamId} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={`/logos/${t.abbreviation}.png`}
                  alt={t.teamName}
                  width={28}
                  height={28}
                  className="shrink-0"
                />
                <span className="font-sans text-sm text-[#3D2B1F] truncate">{t.teamName}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm font-display text-[10px] uppercase tracking-wider ${STATUS_BG.red}`}
                aria-label={`${t.redCount} relevistas agotados`}
              >
                🔴 {t.redCount}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
