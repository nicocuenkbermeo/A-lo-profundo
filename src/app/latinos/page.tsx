import type { Metadata } from "next";
import { buildLatinoReport, type LatinoBatter, type LatinoPitcher } from "@/lib/mlb/features/latinos";
import { COUNTRIES_ES } from "@/lib/i18n/translations";

export const revalidate = 10800; // 3h

export const metadata: Metadata = {
  title: "Latino Tracker",
  description:
    "Los peloteros latinos más destacados de la MLB: bateadores calientes, pitchers dominantes y rookie watch, por país.",
};

export default async function LatinosPage() {
  let report;
  try {
    report = await buildLatinoReport({ windowDays: 7 });
  } catch (err) {
    console.error("[latinos] failed", err);
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Latino Tracker</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">
          ⚾ Datos temporalmente no disponibles. Intenta de nuevo en unos minutos.
        </p>
      </div>
    );
  }

  const countries = Object.entries(report.byCountry).map(([code, data]) => {
    const entry = Object.values(COUNTRIES_ES).find((c) => c.code === code);
    return { code, flag: entry?.flag ?? "🌎", name: entry?.spanish ?? code, ...data };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl lg:text-5xl font-black text-[#F5C842]">
          LATINO TRACKER 🌎
        </h1>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          Temporada {report.season} · Últimos {report.window} días ({report.windowStart} — {report.windowEnd}) · {report.stats.totalLatinos} latinos activos
        </p>
      </header>

      {/* Hot batters */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">🔥 BATEADORES LATINOS CALIENTES</h2>
        {report.batters.length === 0 ? (
          <EmptyCard text="No hay bateadores con suficientes turnos (mín. 10 AB) en esta ventana." />
        ) : (
          <div className="overflow-x-auto">
            <BattersTable batters={report.batters} />
          </div>
        )}
      </section>

      {/* Dominant pitchers */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">⚾ PITCHERS LATINOS DOMINANTES</h2>
        {report.pitchers.length === 0 ? (
          <EmptyCard text="No hay pitchers con suficientes entradas (mín. 3 IP) en esta ventana." />
        ) : (
          <div className="overflow-x-auto">
            <PitchersTable pitchers={report.pitchers} />
          </div>
        )}
      </section>

      {/* Rookie watch */}
      {(report.rookieBatters.length > 0 || report.rookiePitchers.length > 0) && (
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">⭐ ROOKIE LATINO WATCH</h2>
          {report.rookieBatters.length > 0 && (
            <div className="overflow-x-auto">
              <BattersTable batters={report.rookieBatters} />
            </div>
          )}
          {report.rookiePitchers.length > 0 && (
            <div className="overflow-x-auto">
              <PitchersTable pitchers={report.rookiePitchers} />
            </div>
          )}
        </section>
      )}

      {/* By country tabs */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">🏆 RANKINGS POR PAÍS</h2>
        <div className="space-y-6">
          {countries.map((c) => (
            <div key={c.code} className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
              <div className="bg-[#0D2240] text-[#F5C842] px-4 py-2 font-display text-xs uppercase tracking-wider flex items-center gap-2">
                <span className="text-lg">{c.flag}</span>
                {c.name}
              </div>
              <div className="p-4 space-y-4">
                {c.batters.length > 0 && (
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Bateadores</p>
                    <BattersTable batters={c.batters} compact />
                  </div>
                )}
                {c.pitchers.length > 0 && (
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355] mb-2">Pitchers</p>
                    <PitchersTable pitchers={c.pitchers} compact />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-label="Stats del análisis"
        className="bg-[#FDF6E3]/50 border-2 border-dashed border-[#8B7355] rounded-sm p-4 font-mono text-[11px] text-[#8B7355]"
      >
        {report.stats.totalLatinos} latinos activos · {report.stats.hittersFetched} bateadores consultados · {report.stats.pitchersFetched} pitchers consultados
      </section>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-6 text-center">
      <p className="font-sans text-sm text-[#3D2B1F]">{text}</p>
    </div>
  );
}

function BattersTable({ batters, compact }: { batters: LatinoBatter[]; compact?: boolean }) {
  return (
    <table className="w-full min-w-[600px] text-left bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
      <thead>
        <tr className="bg-[#0D2240] text-[#F5C842]">
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">#</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">Jugador</th>
          {!compact && <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">País</th>}
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">AB</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">H</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">HR</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-right">AVG</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-right">OPS</th>
        </tr>
      </thead>
      <tbody>
        {batters.map((b, i) => (
          <tr key={b.personId} className="border-b border-[#8B7355]/20 hover:bg-[#F5E6C8] transition-colors">
            <td className="px-3 py-2 font-mono text-xs text-[#8B7355]">{i + 1}</td>
            <td className="px-3 py-2">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.headshot} alt="" width={28} height={28} className="w-7 h-7 rounded-full border border-[#8B7355] bg-[#FFF8D6] object-cover shrink-0" />
                <div className="min-w-0">
                  <span className="font-sans text-sm text-[#3D2B1F] truncate block">{b.fullName}</span>
                  <span className="font-display text-[9px] text-[#8B7355]">{b.teamAbbr} · {b.position}{b.isRookie ? " ⭐" : ""}</span>
                </div>
              </div>
            </td>
            {!compact && <td className="px-3 py-2 text-sm">{b.country.flag}</td>}
            <td className="px-3 py-2 font-mono text-xs text-center">{b.ab}</td>
            <td className="px-3 py-2 font-mono text-xs text-center">{b.hits}</td>
            <td className="px-3 py-2 font-mono text-xs text-center">{b.hr}</td>
            <td className="px-3 py-2 font-mono text-xs text-right">{b.avg}</td>
            <td className="px-3 py-2 font-mono text-xs font-bold text-right text-[#C41E3A]">{b.ops}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PitchersTable({ pitchers, compact }: { pitchers: LatinoPitcher[]; compact?: boolean }) {
  return (
    <table className="w-full min-w-[600px] text-left bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm">
      <thead>
        <tr className="bg-[#0D2240] text-[#F5C842]">
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">#</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">Pitcher</th>
          {!compact && <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">País</th>}
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">IP</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">W-L</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">K</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-right">WHIP</th>
          <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-right">ERA</th>
        </tr>
      </thead>
      <tbody>
        {pitchers.map((p, i) => (
          <tr key={p.personId} className="border-b border-[#8B7355]/20 hover:bg-[#F5E6C8] transition-colors">
            <td className="px-3 py-2 font-mono text-xs text-[#8B7355]">{i + 1}</td>
            <td className="px-3 py-2">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.headshot} alt="" width={28} height={28} className="w-7 h-7 rounded-full border border-[#8B7355] bg-[#FFF8D6] object-cover shrink-0" />
                <div className="min-w-0">
                  <span className="font-sans text-sm text-[#3D2B1F] truncate block">{p.fullName}</span>
                  <span className="font-display text-[9px] text-[#8B7355]">{p.teamAbbr}{p.isRookie ? " ⭐" : ""}</span>
                </div>
              </div>
            </td>
            {!compact && <td className="px-3 py-2 text-sm">{p.country.flag}</td>}
            <td className="px-3 py-2 font-mono text-xs text-center">{p.ip}</td>
            <td className="px-3 py-2 font-mono text-xs text-center">{p.wins}-{p.losses}</td>
            <td className="px-3 py-2 font-mono text-xs text-center">{p.so}</td>
            <td className="px-3 py-2 font-mono text-xs text-right">{p.whip}</td>
            <td className="px-3 py-2 font-mono text-xs font-bold text-right text-[#2E7D32]">{p.era}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
