import Link from "next/link";
import Image from "next/image";
import { ScoreCard } from "@/components/scores/ScoreCard";
import StitchDivider from "@/components/vintage/StitchDivider";
import RetroButton from "@/components/vintage/RetroButton";
import TeamBadge from "@/components/vintage/TeamBadge";
import { cn } from "@/lib/utils";
import { fetchMlbGames, fetchStandings, fetchLeaders } from "@/lib/mlb-api";
import { AdSlot } from "@/components/ads/AdSlot";

export const revalidate = 60;

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
      <section className="relative bg-gradient-to-b from-[#0D2240] via-[#102a52] to-[#0D2240] py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, #FDF6E3 20px, #FDF6E3 21px)" }} />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 flex flex-col items-center text-center gap-6">
          <Image
            src="/logo.png"
            alt="A lo Profundo"
            width={640}
            height={640}
            priority
            className="w-[340px] sm:w-[460px] lg:w-[600px] h-auto drop-shadow-[8px_8px_0px_rgba(0,0,0,0.55)]"
          />
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-none">
            <span className="text-[#F5C842]">A LO</span>{" "}
            <span className="text-[#C41E3A] italic">PROFUNDO</span>
          </h1>
          <p className="max-w-xl font-display text-base lg:text-lg text-[#8FBCE6] tracking-wider">
            ⚾ Tu fuente de béisbol profundo · Scores en vivo · Estadísticas
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/scores">
              <RetroButton variant="red" size="lg">VER SCORES</RetroButton>
            </Link>
            <Link href="/trends">
              <RetroButton variant="gold" size="lg">VER TENDENCIAS</RetroButton>
            </Link>
          </div>
        </div>
      </section>

      <StitchDivider />

      {/* Today's games */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-5">
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

      {/* Banner ad after games */}
      <section className="mx-auto max-w-6xl px-4 py-4">
        <AdSlot slot="1111111111" format="horizontal" label="Publicidad" />
      </section>

      <StitchDivider />

      {/* Standings full width */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-5">
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

      {/* In-content ad */}
      <section className="mx-auto max-w-6xl px-4 py-4">
        <AdSlot slot="2222222222" format="auto" label="Publicidad" />
      </section>

      <StitchDivider />

      {/* Leaders */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-5">
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

      {/* All MLB teams grid with real logos */}
      <section className="mx-auto max-w-6xl px-4 py-10 space-y-5">
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
