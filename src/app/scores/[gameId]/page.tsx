import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { fetchGameDetail } from "@/lib/mlb-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ gameId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { gameId } = await params;
  const game = await fetchGameDetail(gameId);
  if (!game) return { title: "Partido no encontrado" };
  return {
    title: `${game.away.name} vs ${game.home.name}`,
    description: `Box score, line score y resultados en vivo de ${game.away.name} vs ${game.home.name}.`,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { gameId } = await params;
  const game = await fetchGameDetail(gameId);
  if (!game) notFound();

  const { away, home, innings, status, statusDetail } = game;
  const maxInnings = Math.max(9, innings.length);
  const inningNumbers = Array.from({ length: maxInnings }, (_, i) => i + 1);

  const homeWinning = home.score > away.score;
  const awayWinning = away.score > home.score;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Link
        href="/scores"
        className="inline-flex items-center gap-2 font-display text-sm text-[#8B7355] hover:text-[#C41E3A] transition-colors tracking-wider uppercase"
      >
        &#9664; Volver a Resultados
      </Link>

      {/* Hero card */}
      <div className="relative bg-[#FDF6E3] border-[3px] border-[#8B7355] rounded-sm shadow-[4px_4px_0px_#5C4A32] paper-texture overflow-hidden">
        <div className="absolute bottom-[6px] left-[6px] w-5 h-5 border-b-2 border-l-2 border-[#8B7355] pointer-events-none" />
        <div className="absolute bottom-[6px] right-[6px] w-5 h-5 border-b-2 border-r-2 border-[#8B7355] pointer-events-none" />

        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            {status === "LIVE" ? (
              <span className="font-display text-sm uppercase tracking-[0.2em] text-white bg-[#C41E3A] px-4 py-1 rounded-sm border border-[#8B0000] animate-pulse">
                {statusDetail || "En Vivo"}
              </span>
            ) : status === "FINAL" ? (
              <span className="font-display text-sm uppercase tracking-[0.2em] text-[#3D2B1F] bg-[#E8D5B5] px-4 py-1 rounded-sm border border-[#8B7355]">
                {statusDetail || "Final"}
              </span>
            ) : (
              <span className="font-display text-sm uppercase tracking-[0.2em] text-[#0D2240] bg-[#8FBCE6]/20 px-4 py-1 rounded-sm border border-[#0D2240]">
                {statusDetail || "Programado"}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Away */}
            <div className="flex flex-col items-center gap-3 w-1/3">
              <Image src={`/logos/${away.abbr}.png`} alt={away.abbr} width={96} height={96} />
              <div className="text-center">
                <span className="font-heading text-lg font-bold text-[#3D2B1F] block leading-tight">
                  {away.name}
                </span>
                {away.record && (
                  <span className="font-mono text-xs text-[#8B7355]">{away.record}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className={cn("font-mono text-5xl tabular-nums", awayWinning ? "font-bold text-[#C41E3A]" : "text-[#3D2B1F]/60")}>
                {away.score}
              </span>
              <span className="font-display text-2xl text-[#8B7355]">-</span>
              <span className={cn("font-mono text-5xl tabular-nums", homeWinning ? "font-bold text-[#C41E3A]" : "text-[#3D2B1F]/60")}>
                {home.score}
              </span>
            </div>

            {/* Home */}
            <div className="flex flex-col items-center gap-3 w-1/3">
              <Image src={`/logos/${home.abbr}.png`} alt={home.abbr} width={96} height={96} />
              <div className="text-center">
                <span className="font-heading text-lg font-bold text-[#3D2B1F] block leading-tight">
                  {home.name}
                </span>
                {home.record && (
                  <span className="font-mono text-xs text-[#8B7355]">{home.record}</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-center font-display text-xs text-[#8B7355] mt-6 tracking-wider uppercase">
            {game.venue} · {game.startTime}
          </p>
        </div>
      </div>

      {/* Line score */}
      <section>
        <h3 className="font-heading text-xl text-[#F5C842] mb-3">LÍNEA POR INNING</h3>
        <div className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="bg-[#0D2240]">
                <th className="px-3 py-2.5 text-left font-display text-xs uppercase tracking-wider text-[#F5C842] w-20">Equipo</th>
                {inningNumbers.map((n) => (
                  <th key={n} className="px-2 py-2.5 text-center font-display text-xs text-[#F5C842] w-8">{n}</th>
                ))}
                <th className="px-2 py-2.5 text-center font-display text-xs font-bold text-[#C41E3A] border-l-2 border-[#8B7355]/30">R</th>
                <th className="px-2 py-2.5 text-center font-display text-xs text-[#F5C842]">H</th>
                <th className="px-2 py-2.5 text-center font-display text-xs text-[#F5C842]">E</th>
              </tr>
            </thead>
            <tbody>
              {[{ side: "away", team: away }, { side: "home", team: home }].map(({ side, team }) => (
                <tr key={side} className={side === "home" ? "bg-[#F5E6C8]" : "bg-[#FDF6E3]"}>
                  <td className="px-3 py-2.5 font-sans font-bold text-sm text-[#3D2B1F]">{team.abbr}</td>
                  {inningNumbers.map((n) => {
                    const inn = innings.find((i) => i.inningNumber === n);
                    const val = inn ? (side === "home" ? inn.homeRuns : inn.awayRuns) : null;
                    return (
                      <td key={n} className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">
                        {val === null ? "-" : val}
                      </td>
                    );
                  })}
                  <td className="px-2 py-2.5 text-center font-mono text-sm font-bold text-[#C41E3A] border-l-2 border-[#8B7355]/30">{team.totals.runs}</td>
                  <td className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">{team.totals.hits}</td>
                  <td className="px-2 py-2.5 text-center font-mono text-sm text-[#3D2B1F]">{team.totals.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Box score — real batters */}
      {(away.batters.length > 0 || home.batters.length > 0) && (
        <section className="space-y-6">
          <h3 className="font-heading text-xl text-[#F5C842]">BOX SCORE</h3>
          {[{ label: away.name, abbr: away.abbr, batters: away.batters }, { label: home.name, abbr: home.abbr, batters: home.batters }].map((t) => (
            <div key={t.abbr} className="bg-[#FDF6E3] border-[3px] border-[#8B7355] shadow-[4px_4px_0px_#5C4A32] rounded-sm overflow-hidden">
              <div className="font-display text-xs uppercase tracking-[0.15em] text-[#8B7355] px-4 pt-3">
                {t.abbr} — {t.label}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="bg-[#0D2240]">
                      <th className="px-3 py-2 text-left font-display text-xs uppercase tracking-wider text-[#F5C842]">Jugador</th>
                      {["AB", "R", "H", "RBI", "BB", "SO", "AVG"].map((c) => (
                        <th key={c} className="px-2 py-2 text-center font-display text-xs uppercase tracking-wider text-[#F5C842]">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.batters.map((p, i) => (
                      <tr key={p.name + i} className={i % 2 === 0 ? "bg-[#FDF6E3]" : "bg-[#F5E6C8]"}>
                        <td className="px-3 py-1.5 font-sans text-sm text-[#3D2B1F] font-semibold">
                          {p.name} <span className="text-[#8B7355] text-xs">{p.position}</span>
                        </td>
                        <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.ab}</td>
                        <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.r}</td>
                        <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.h}</td>
                        <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.rbi}</td>
                        <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.bb}</td>
                        <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.so}</td>
                        <td className="px-2 py-1.5 text-center font-mono text-sm text-[#3D2B1F]">{p.avg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
