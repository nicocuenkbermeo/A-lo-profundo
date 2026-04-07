import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchTeamSchedule, teamIdFromAbbr, computeRecord, TEAM_META } from "@/lib/mlb-api";
import { ScoreCard } from "@/components/scores/ScoreCard";
import StitchDivider from "@/components/vintage/StitchDivider";
import TeamBadge from "@/components/vintage/TeamBadge";
import { AdSlot } from "@/components/ads/AdSlot";
import type { Metadata } from "next";
import type { Game } from "@/types/game";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ abbr: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { abbr } = await params;
  const upper = abbr.toUpperCase();
  const meta = TEAM_META[upper];
  if (!meta) return { title: "Equipo no encontrado" };
  return {
    title: `${meta.city} ${meta.name}`,
    description: `Historial de partidos, resultados y calendario de los ${meta.city} ${meta.name}.`,
  };
}

const DIVISION_LABEL: Record<string, string> = { EAST: "Este", CENTRAL: "Central", WEST: "Oeste" };
const LEAGUE_LABEL: Record<string, string> = { AL: "Liga Americana", NL: "Liga Nacional" };

export default async function TeamPage({ params }: PageProps) {
  const { abbr } = await params;
  const upper = abbr.toUpperCase();
  const teamId = teamIdFromAbbr(upper);
  const meta = TEAM_META[upper];

  if (!teamId || !meta) notFound();

  const games = await fetchTeamSchedule(teamId, 45, 14);
  const record = computeRecord(games, teamId);

  const finals = games.filter((g) => g.status === "FINAL");
  const live = games.filter((g) => g.status === "LIVE");
  const upcoming = games.filter((g) => g.status === "SCHEDULED");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-wider text-[#8FBCE6] hover:text-[#F5C842] transition-colors"
      >
        ← Volver al inicio
      </Link>

      {/* Team header */}
      <header className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[6px_6px_0px_#5C4A32] rounded-sm overflow-hidden">
        <div className="absolute top-[6px] left-[6px] w-5 h-5 border-t-2 border-l-2 border-[#8B7355] pointer-events-none" />
        <div className="absolute top-[6px] right-[6px] w-5 h-5 border-t-2 border-r-2 border-[#8B7355] pointer-events-none" />
        <div className="absolute bottom-[6px] left-[6px] w-5 h-5 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
        <div className="absolute bottom-[6px] right-[6px] w-5 h-5 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-6 p-6 lg:p-10">
          <div className="shrink-0">
            <Image
              src={`/logos/${upper}.png`}
              alt={upper}
              width={180}
              height={180}
              className="drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
            />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-[#8B7355]">
              {LEAGUE_LABEL[meta.league]} · División {DIVISION_LABEL[meta.division]}
            </p>
            <h1 className="font-heading text-4xl lg:text-6xl font-black text-[#3D2B1F] leading-none mt-2">
              {meta.city}
            </h1>
            <h2 className="font-heading text-3xl lg:text-5xl font-black italic text-[#C41E3A] leading-none mt-1">
              {meta.name}
            </h2>
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="bg-[#0D2240] text-[#F5C842] font-mono text-2xl font-bold px-4 py-2 rounded-sm">
                {record.wins}-{record.losses}
              </div>
              <div className="font-display text-xs uppercase tracking-wider text-[#8B7355]">
                Récord en últimos 45 días
              </div>
            </div>
          </div>
        </div>
      </header>

      <StitchDivider />

      {/* LIVE games */}
      {live.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-heading text-2xl font-bold text-[#F5C842] flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-[#C41E3A] animate-pulse-live" />
            EN VIVO AHORA
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {live.map((g) => (
              <ScoreCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming games */}
      {upcoming.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-heading text-2xl font-bold text-[#F5C842]">PRÓXIMOS PARTIDOS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.slice(0, 6).map((g) => (
              <ScoreCard key={g.id} game={g} />
            ))}
          </div>
        </section>
      )}

      <AdSlot slot="5555555555" format="horizontal" label="Publicidad" />

      <StitchDivider />

      {/* Game history table */}
      <section className="space-y-4">
        <h3 className="font-heading text-2xl lg:text-3xl font-bold text-[#F5C842]">
          HISTORIAL DE PARTIDOS
        </h3>
        <p className="font-display text-xs uppercase tracking-wider text-[#8B7355]">
          {finals.length} partidos finalizados · Datos en vivo de MLB
        </p>

        {finals.length === 0 ? (
          <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] rounded-sm p-10 text-center">
            <p className="font-heading text-xl text-[#3D2B1F]">⚾ Sin partidos finalizados recientes</p>
          </div>
        ) : (
          <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0D2240] text-[#F5C842]">
                  <th className="px-3 py-2.5 font-display text-[10px] uppercase tracking-wider">Fecha</th>
                  <th className="px-3 py-2.5 font-display text-[10px] uppercase tracking-wider">Rival</th>
                  <th className="px-3 py-2.5 font-display text-[10px] uppercase tracking-wider text-center">Loc.</th>
                  <th className="px-3 py-2.5 font-display text-[10px] uppercase tracking-wider text-center">Resultado</th>
                  <th className="px-3 py-2.5 font-display text-[10px] uppercase tracking-wider text-right">Marcador</th>
                </tr>
              </thead>
              <tbody>
                {finals.map((g) => {
                  const isHome = Number(g.homeTeam.id) === teamId;
                  const opp = isHome ? g.awayTeam : g.homeTeam;
                  const myScore = isHome ? g.homeScore : g.awayScore;
                  const oppScore = isHome ? g.awayScore : g.homeScore;
                  const won = myScore > oppScore;
                  const tie = myScore === oppScore;
                  const dateStr = new Date(g.date).toLocaleDateString("es-CO", {
                    timeZone: "America/Bogota",
                    day: "2-digit",
                    month: "short",
                  });
                  return (
                    <tr key={g.id} className="border-b border-[#8B7355]/20 hover:bg-[#F5E6C8] transition-colors">
                      <td className="px-3 py-2.5 font-mono text-xs text-[#8B7355]">{dateStr}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <TeamBadge abbreviation={opp.abbreviation} size="sm" />
                          <span className="font-sans text-sm text-[#3D2B1F]">{opp.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center font-display text-[10px] uppercase text-[#8B7355]">
                        {isHome ? "Casa" : "Visit."}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className={
                            "inline-block px-2 py-0.5 rounded-sm font-display text-[10px] font-bold uppercase tracking-wider " +
                            (won
                              ? "bg-[#2E7D32] text-white"
                              : tie
                              ? "bg-[#8B7355] text-white"
                              : "bg-[#C62828] text-white")
                          }
                        >
                          {won ? "G" : tie ? "E" : "P"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-sm font-bold text-right text-[#3D2B1F]">
                        {myScore} - {oppScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
