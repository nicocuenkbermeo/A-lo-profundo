import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildDailyRecap, type GameResult } from "@/lib/mlb/features/daily-recap";
import { generateMvpBlurb } from "@/lib/mlb/recap-templates";
import { playerHeadshotUrl } from "@/lib/i18n/translations";

export const revalidate = 86400; // 24h — yesterday's recap doesn't change

interface PageProps {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `Lo Profundo del ${date}`,
    description: `Recap de la jornada MLB del ${date}: resultados, MVP, duelos, rachas y bullpens.`,
  };
}

export async function generateStaticParams() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
  const dates: { date: string }[] = [];
  for (let i = 1; i <= 7; i++) {
    const [y, m, d] = today.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() - i);
    dates.push({
      date: `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`,
    });
  }
  return dates;
}

function formatDateEs(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-CO", {
    timeZone: "America/Bogota", weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default async function RecapPage({ params }: PageProps) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  let recap;
  try {
    recap = await buildDailyRecap(date);
  } catch (err) {
    console.error("[recap] failed for", date, err);
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold text-[#F5C842]">Lo Profundo del Día</h1>
        <p className="mt-4 font-sans text-[#FDF6E3]/80">⚾ No se pudo generar el recap para {date}.</p>
      </div>
    );
  }

  const moment = recap.mvp.moment;
  const redBullpens = recap.bullpens.teams.filter((t) => t.status === "red").slice(0, 5);
  const topDuels = recap.duelsToday.duels.slice(0, 3);
  const hitStreaks = recap.chase.streaks.hitStreak.slice(0, 3);
  const obStreaks = recap.chase.streaks.obStreak.slice(0, 3);
  const scorelessStreaks = recap.chase.streaks.scorelessStreak.slice(0, 3);
  const hasStreaks = hitStreaks.length + obStreaks.length + scorelessStreaks.length > 0;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 space-y-10">
      {/* Back link */}
      <Link
        href="/diario"
        className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors"
      >
        ← Todas las ediciones
      </Link>

      {/* Hero */}
      <header className="space-y-3">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
          {formatDateEs(recap.date)}
        </p>
        <h1 className="font-heading text-3xl lg:text-4xl font-black text-[#F5C842] leading-tight">
          {recap.headline}
        </h1>
      </header>

      {/* 1. Results */}
      <Section title="⚾ Resultados de anoche">
        {recap.results.length === 0 ? (
          <p className="font-sans text-sm text-[#3D2B1F]">No hubo juegos finalizados en esta fecha.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0D2240] text-[#F5C842]">
                  <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">Visitante</th>
                  <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">Score</th>
                  <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">Local</th>
                </tr>
              </thead>
              <tbody>
                {recap.results.map((r) => (
                  <ResultRow key={r.gameId} game={r} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* 2. MVP */}
      {moment && (
        <Section title="🏆 MVP del día">
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={playerHeadshotUrl(moment.batterId)}
              alt={moment.batterName}
              width={96}
              height={96}
              className="w-24 h-24 rounded-sm border-2 border-[#8B7355] bg-[#FFF8D6] object-cover shrink-0"
            />
            <div className="space-y-2">
              <p className="font-heading font-bold text-lg text-[#3D2B1F]">{moment.batterName}</p>
              <p className="font-sans text-sm text-[#3D2B1F]/80">{generateMvpBlurb(moment)}</p>
              <Link
                href={`/scores/${moment.gameId}`}
                className="inline-block font-display text-[10px] uppercase tracking-wider text-[#C41E3A] hover:underline"
              >
                Ver juego completo →
              </Link>
            </div>
          </div>
        </Section>
      )}

      {/* 3. Upset */}
      {recap.upsetBlurb && (
        <Section title="😲 Sorpresa del día">
          <p className="font-sans text-sm text-[#3D2B1F]">{recap.upsetBlurb}</p>
        </Section>
      )}

      {/* 4. Streaks */}
      {hasStreaks && (
        <Section title="🔥 Rachas que vigilar">
          <ul className="space-y-2">
            {[...hitStreaks, ...obStreaks, ...scorelessStreaks].map((s) => (
              <li key={`${s.personId}-${s.label}`} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={playerHeadshotUrl(s.personId)} alt="" width={28} height={28} className="w-7 h-7 rounded-full border border-[#8B7355] bg-[#FFF8D6] object-cover shrink-0" />
                  <span className="font-sans text-sm text-[#3D2B1F] truncate">{s.fullName}</span>
                  <span className="font-display text-[9px] text-[#8B7355]">{s.teamAbbr}</span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-heading text-xl font-black text-[#C41E3A]">{s.streakLength}</span>
                  <span className="font-display text-[9px] text-[#8B7355] ml-1">{s.unit}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 5. Today's matchups */}
      {topDuels.length > 0 && (
        <Section title="⚔️ Duelos a seguir hoy">
          <ul className="space-y-3">
            {topDuels.map((d) => (
              <li key={`${d.batterId}-${d.pitcherId}`} className="bg-[#0D2240]/5 border border-[#8B7355]/30 rounded-sm p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-bold text-sm text-[#3D2B1F]">
                    {d.batterName} vs {d.pitcherName}
                  </span>
                  <span className="font-display text-[10px] text-[#8B7355]">{d.gameLabel}</span>
                </div>
                <p className="font-sans text-xs text-[#3D2B1F]/70 mt-1">{d.narrative}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/duelos"
            className="inline-block mt-2 font-display text-[10px] uppercase tracking-wider text-[#C41E3A] hover:underline"
          >
            Ver todos los duelos →
          </Link>
        </Section>
      )}

      {/* 6. Bullpens in red */}
      {redBullpens.length > 0 && (
        <Section title="🔴 Bullpens en rojo">
          <ul className="space-y-2">
            {redBullpens.map((t) => (
              <li key={t.teamId} className="flex items-center justify-between gap-3 font-sans text-sm text-[#3D2B1F]">
                <span>{t.teamName} ({t.abbreviation})</span>
                <span className="font-mono text-xs text-[#C41E3A] font-bold">{t.redCount} relevistas agotados</span>
              </li>
            ))}
          </ul>
          <Link
            href="/bullpens"
            className="inline-block mt-2 font-display text-[10px] uppercase tracking-wider text-[#C41E3A] hover:underline"
          >
            Reporte completo de bullpens →
          </Link>
        </Section>
      )}

      {/* Newsletter CTA placeholder */}
      <div className="bg-[#0D2240] border-[3px] border-[#F5C842] rounded-sm p-6 text-center space-y-3">
        <p className="font-heading text-xl font-bold text-[#F5C842]">📬 ¿Te gustó el recap?</p>
        <p className="font-sans text-sm text-[#8FBCE6]">
          Próximamente podrás recibir Lo Profundo del Día directo en tu correo cada mañana.
        </p>
        <button
          disabled
          className="font-display text-xs uppercase tracking-wider bg-[#F5C842] text-[#0D2240] px-5 py-2 rounded-sm font-bold opacity-60 cursor-not-allowed"
        >
          Suscríbete al newsletter (próximamente)
        </button>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-xl font-bold text-[#FDF6E3]">{title}</h2>
      <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-5">
        {children}
      </div>
    </section>
  );
}

function ResultRow({ game }: { game: GameResult }) {
  const awayWon = game.awayScore > game.homeScore;
  return (
    <tr className="border-b border-[#8B7355]/20">
      <td className="px-3 py-2">
        <span className={`font-sans text-sm ${awayWon ? "font-bold text-[#3D2B1F]" : "text-[#3D2B1F]/60"}`}>
          {game.awayAbbr}
        </span>
      </td>
      <td className="px-3 py-2 text-center font-mono text-sm font-bold text-[#3D2B1F]">
        {game.awayScore} - {game.homeScore}
      </td>
      <td className="px-3 py-2">
        <span className={`font-sans text-sm ${!awayWon ? "font-bold text-[#3D2B1F]" : "text-[#3D2B1F]/60"}`}>
          {game.homeAbbr}
        </span>
      </td>
    </tr>
  );
}
