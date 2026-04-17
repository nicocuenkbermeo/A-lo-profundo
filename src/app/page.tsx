import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScoreCard } from "@/components/scores/ScoreCard";
import StitchDivider from "@/components/vintage/StitchDivider";
import RetroButton from "@/components/vintage/RetroButton";
import TeamBadge from "@/components/vintage/TeamBadge";
import { cn } from "@/lib/utils";
import { fetchMlbGames, fetchStandings, fetchLeaders } from "@/lib/mlb-api";
import { AdSlot } from "@/components/ads/AdSlot";
import { buildPredictions } from "@/lib/mlb/features/predictions";
import { buildPowerRankings } from "@/lib/mlb/features/power-rankings";
import { buildLatinoReport } from "@/lib/mlb/features/latinos";
import { COUNTRIES_ES } from "@/lib/i18n/translations";

// Revalidate every 60s during game hours (12pm-1am Bogota), every 5min otherwise
function getRevalidateSeconds(): number {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Bogota", hour: "numeric", hour12: false }).format(new Date())
  );
  // MLB games typically run 12pm - 1am Bogota time
  return (hour >= 12 || hour < 1) ? 60 : 300;
}

export const revalidate = 60; // Next.js App Router requires a static value; dynamic schedule via getRevalidateSeconds() can be used in fetch options instead
const ALL_TEAMS = [
  "ARI", "ATL", "BAL", "BOS", "CHC", "CHW", "CIN", "CLE", "COL", "DET",
  "HOU", "KCR", "LAA", "LAD", "MIA", "MIL", "MIN", "NYM", "NYY", "OAK",
  "PHI", "PIT", "SDP", "SEA", "SFG", "STL", "TBR", "TEX", "TOR", "WSH",
];

export default async function HomePage() {
  const [allGames, standingsAll, leaders] = await Promise.all([
    fetchMlbGames(),
    fetchStandings(),
    fetchLeaders(),
  ]);
  const todayGames = allGames.slice(0, 6);
  const standings = standingsAll.slice(0, 5).map((s) => ({
    team: s.abbr,
    name: s.name,
    w: s.wins,
    l: s.losses,
    pct: s.pct,
  }));
  const battingLeaders = leaders.avg.slice(0, 4).map((l) => ({ name: l.name, team: l.teamAbbr, stat: l.value }));
  const hrLeaders = leaders.hr.slice(0, 4).map((l) => ({ name: l.name, team: l.teamAbbr, stat: l.value }));
  const pitchingLeaders = leaders.era.slice(0, 4).map((l) => ({ name: l.name, team: l.teamAbbr, stat: l.value }));

  return (
    <div className="space-y-0 pb-12">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#0D2240] via-[#102a52] to-[#0D2240] py-12 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, #FDF6E3 20px, #FDF6E3 21px)" }} />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 flex flex-col items-center text-center gap-4">
          <Image
            src="/logo.png"
            alt="A lo Profundo"
            width={640}
            height={640}
            priority
            className="w-[280px] sm:w-[400px] lg:w-[500px] h-auto drop-shadow-[8px_8px_0px_rgba(0,0,0,0.55)]"
          />
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-none">
            <span className="text-[#F5C842]">A LO</span>{" "}
            <span className="text-[#C41E3A] italic">PROFUNDO</span>
          </h1>
          <p className="max-w-xl font-display text-sm lg:text-base text-[#8FBCE6] tracking-wider">
            ⚾ Tu fuente de béisbol profundo · Predicciones · Stats · Apuestas
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/predicciones">
              <RetroButton variant="red" size="lg">PREDICCIONES DE HOY</RetroButton>
            </Link>
            <Link href="/momento-del-dia">
              <RetroButton variant="gold" size="lg">MOMENTO DEL DÍA</RetroButton>
            </Link>
          </div>
        </div>
      </section>

      <StitchDivider />

      {/* Today's games */}
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">JUEGOS DE HOY</h2>
            <p className="font-display text-xs text-[#8B7355] mt-1">{allGames.length} partidos · Hora Bogotá</p>
          </div>
          <Link href="/scores" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {todayGames.map((game) => (
            <ScoreCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-2">
        <AdSlot slot="1111111111" format="horizontal" label="Publicidad" />
      </section>

      <StitchDivider />

      {/* NEW: Predicciones del día — top 3 */}
      <Suspense fallback={<WidgetSkeleton title="PREDICCIONES DEL DÍA" />}>
        <PredictionsWidget />
      </Suspense>

      <StitchDivider />

      {/* Standings */}
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">CLASIFICACIÓN</h2>
          <Link href="/stats/teams" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Completa →
          </Link>
        </div>
        <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0D2240] text-[#F5C842]">
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider">Equipo</th>
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">W</th>
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-center">L</th>
                <th className="px-3 py-2 font-display text-[10px] uppercase tracking-wider text-right">PCT</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((s, i) => (
                <tr key={s.team} className={cn("border-b border-[#8B7355]/20", i === 0 && "bg-[#F5C842]/10")}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <TeamBadge abbreviation={s.team} size="sm" />
                      <span className="font-sans text-sm text-[#3D2B1F]">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-sm text-[#3D2B1F] text-center">{s.w}</td>
                  <td className="px-3 py-2 font-mono text-sm text-[#3D2B1F] text-center">{s.l}</td>
                  <td className="px-3 py-2 font-mono text-sm font-bold text-[#3D2B1F] text-right">{s.pct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <StitchDivider />

      {/* NEW: Power Rankings Top 5 */}
      <Suspense fallback={<WidgetSkeleton title="POWER RANKINGS" />}>
        <PowerRankingsWidget />
      </Suspense>

      <StitchDivider />

      {/* Leaders */}
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">LÍDERES</h2>
          <Link href="/stats" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Estadísticas completas →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <LeaderCard title="BATEO (AVG)" leaders={battingLeaders} accent="#C41E3A" />
          <LeaderCard title="JONRONES" leaders={hrLeaders} accent="#F5C842" />
          <LeaderCard title="PITCHEO (ERA)" leaders={pitchingLeaders} accent="#2E7D32" />
        </div>
      </section>

      <StitchDivider />

      {/* NEW: Latino Tracker — top 3 */}
      <Suspense fallback={<WidgetSkeleton title="LATINOS DESTACADOS" />}>
        <LatinosWidget />
      </Suspense>

      <section className="mx-auto max-w-6xl px-4 py-2">
        <AdSlot slot="2222222222" format="auto" label="Publicidad" />
      </section>

      <StitchDivider />

      {/* NEW: Recap del día anterior */}
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">RECAP DE AYER</h2>
          <Link href="/diario" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Todas las ediciones →
          </Link>
        </div>
        <Link
          href={`/diario/${yesterdayDate()}`}
          className="block bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-5 hover:bg-[#F5E6C8] transition-colors"
        >
          <p className="font-display text-[10px] uppercase tracking-wider text-[#8B7355]">
            Lo Profundo del Día
          </p>
          <p className="font-heading text-lg font-bold text-[#3D2B1F] mt-1">
            Lee el resumen completo de la jornada de ayer
          </p>
          <p className="font-sans text-sm text-[#C41E3A] mt-2">
            Leer recap completo →
          </p>
        </Link>
      </section>

      <StitchDivider />

      {/* All MLB teams grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842] text-center">EQUIPOS MLB</h2>
        <p className="font-display text-xs text-[#8B7355] text-center uppercase tracking-wider">
          Las 30 franquicias · American League · National League
        </p>
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-4 justify-items-center pt-4">
          {ALL_TEAMS.map((abbr) => (
            <Link
              key={abbr}
              href={`/teams/${abbr}`}
              className="hover:scale-110 transition-transform"
              title={abbr}
            >
              <TeamBadge abbreviation={abbr} size="lg" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Async widget components (wrapped in Suspense above)
// ---------------------------------------------------------------------------

async function PredictionsWidget() {
  try {
    const report = await buildPredictions();
    const top3 = report.games.slice(0, 3);
    if (top3.length === 0) return null;

    return (
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">
            PREDICCIONES DEL DÍA
          </h2>
          <Link href="/predicciones" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {top3.map((g) => {
            const confPct = Math.round(g.prediction.confidence * 100);
            const winner = g.prediction.winner === "home" ? g.homeTeam : g.awayTeam;
            const badgeColor =
              g.confidenceLevel === "high"
                ? "bg-[#2E7D32]"
                : g.confidenceLevel === "medium"
                  ? "bg-[#F5C842] text-[#3D2B1F]"
                  : "bg-[#8B7355]";
            return (
              <Link
                key={g.gamePk}
                href="/predicciones"
                className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 hover:bg-[#F5E6C8] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Image src={`/logos/${g.awayTeam.abbreviation}.png`} alt={g.awayTeam.abbreviation} width={24} height={24} />
                    <span className="font-display text-xs text-[#8B7355]">@</span>
                    <Image src={`/logos/${g.homeTeam.abbreviation}.png`} alt={g.homeTeam.abbreviation} width={24} height={24} />
                  </div>
                  <span className={`font-display text-[10px] uppercase tracking-wider text-white px-2 py-0.5 rounded-sm ${badgeColor}`}>
                    {confPct}%
                  </span>
                </div>
                <p className="font-heading text-sm font-bold text-[#3D2B1F]">
                  {winner.abbreviation} gana
                </p>
                <p className="font-sans text-xs text-[#8B7355] mt-0.5">
                  {g.startTime}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    );
  } catch (e) {
    console.error("[PredictionsWidget]", e);
    return null;
  }
}

async function PowerRankingsWidget() {
  try {
    const report = await buildPowerRankings();
    const top5 = report.rankings.slice(0, 5);

    return (
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">
            POWER RANKINGS
          </h2>
          <Link href="/power-rankings" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Ranking completo →
          </Link>
        </div>
        <div className="space-y-2">
          {top5.map((r) => (
            <div
              key={r.teamId}
              className="flex items-center gap-3 bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[2px_2px_0px_#5C4A32] rounded-sm px-4 py-3"
            >
              <span className="font-mono text-lg font-bold text-[#0D2240] w-6 text-center">{r.rank}</span>
              <TeamBadge abbreviation={r.abbreviation} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-bold text-[#3D2B1F] truncate">{r.teamName}</p>
                <p className="font-mono text-xs text-[#8B7355]">{r.record} · L10: {r.last10}</p>
              </div>
              <span className={cn(
                "font-display text-xs font-bold",
                r.movement === "up" ? "text-[#2E7D32]" : r.movement === "down" ? "text-[#C41E3A]" : "text-[#8B7355]",
              )}>
                {r.movement === "up" ? `▲${r.movementDelta}` : r.movement === "down" ? `▼${Math.abs(r.movementDelta)}` : "—"}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  } catch (e) {
    console.error("[PowerRankingsWidget]", e);
    return null;
  }
}

async function LatinosWidget() {
  try {
    const report = await buildLatinoReport({ windowDays: 7 });
    const top3 = report.batters.slice(0, 3);
    if (top3.length === 0) return null;

    return (
      <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">
            LATINOS DESTACADOS
          </h2>
          <Link href="/latinos" className="font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors">
            Ver Latino Tracker →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {top3.map((b) => {
            const country = Object.values(COUNTRIES_ES).find((c) => c.code === b.country.code);
            return (
              <Link
                key={b.personId}
                href="/latinos"
                className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm p-4 hover:bg-[#F5E6C8] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.headshot} alt="" width={40} height={40} className="w-10 h-10 rounded-full border border-[#8B7355] bg-[#FFF8D6] object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-bold text-[#3D2B1F] truncate">{b.fullName}</p>
                    <p className="font-display text-[10px] text-[#8B7355]">
                      {country?.flag ?? "🌎"} {b.teamAbbr} · {b.position}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 font-mono text-xs">
                  <span className="text-[#3D2B1F]">AVG <span className="font-bold text-[#C41E3A]">{b.avg}</span></span>
                  <span className="text-[#3D2B1F]">OPS <span className="font-bold text-[#0D2240]">{b.ops}</span></span>
                  <span className="text-[#3D2B1F]">HR <span className="font-bold">{b.hr}</span></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  } catch (e) {
    console.error("[LatinosWidget]", e);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function yesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function WidgetSkeleton({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 space-y-4">
      <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#FDF6E3]/50 border-[3px] border-[#8B7355]/30 rounded-sm h-28 animate-pulse" />
        ))}
      </div>
    </section>
  );
}

function LeaderCard({ title, leaders, accent }: { title: string; leaders: { name: string; team: string; stat: string }[]; accent: string }) {
  return (
    <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
      <div className="bg-[#0D2240] text-[#F5C842] px-4 py-2 font-display text-xs uppercase tracking-wider">
        {title}
      </div>
      <div className="p-3 space-y-2.5">
        {leaders.map((l, i) => (
          <div key={l.name} className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#8B7355] w-4">{i + 1}.</span>
            <TeamBadge abbreviation={l.team} size="sm" />
            <span className="font-sans text-sm text-[#3D2B1F] flex-1 truncate">{l.name}</span>
            <span className="font-mono text-sm font-bold" style={{ color: accent }}>{l.stat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
