import type { Metadata } from "next";
import Link from "next/link";
import { fetchMlbGames } from "@/lib/mlb-api";
import { buildPredictions } from "@/lib/mlb/features/predictions";
import { ResponsibleGamingNotice } from "@/components/ui/ResponsibleGamingNotice";

export const metadata: Metadata = {
  title: "Desde TikTok — El Pollo Apuestas",
  description: "Picks MLB gratis, análisis rápido, stats que pegan. Lo que ves en @elpollo_apuestas lo puedes profundizar aquí.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "El Pollo Apuestas · A Lo Profundo",
    description: "Picks MLB gratis del día. Desde TikTok @elpollo_apuestas.",
    type: "website",
  },
};

export const revalidate = 900;

const TEAM_COLORS: Record<string, string> = {
  ARI: "#A71930", ATL: "#CE1141", BAL: "#DF4601", BOS: "#BD3039",
  CHC: "#0E3386", CHW: "#27251F", CIN: "#C6011F", CLE: "#00385D",
  COL: "#33006F", DET: "#0C2340", HOU: "#002D62", KCR: "#004687",
  LAA: "#BA0021", LAD: "#005A9C", MIA: "#00A3E0", MIL: "#12284B",
  MIN: "#002B5C", NYM: "#002D72", NYY: "#003087", OAK: "#003831",
  PHI: "#E81828", PIT: "#FDB827", SDP: "#2F241D", SEA: "#0C2C56",
  SFG: "#FD5A1E", STL: "#C41E3A", TBR: "#092C5C", TEX: "#003278",
  TOR: "#134A8E", WSH: "#AB0003",
};

function colorFor(abbr: string): string {
  return TEAM_COLORS[abbr?.toUpperCase()] ?? "#0D2240";
}

export default async function TikTokLandingPage() {
  const [games, report] = await Promise.all([
    fetchMlbGames(),
    buildPredictions().catch(() => null),
  ]);

  const confidentPicks = (report?.games ?? [])
    .filter((g) => !g.pending && g.confidenceLevel === "high")
    .sort((a, b) => b.prediction.confidence - a.prediction.confidence);

  const topPick = confidentPicks[0] ?? report?.games?.[0] ?? null;
  const todayCount = games.length;
  const liveCount = games.filter((g) => g.status === "LIVE").length;
  const pickTeam = topPick
    ? (topPick.prediction.winner === "home" ? topPick.homeTeam : topPick.awayTeam)
    : null;

  return (
    <div className="min-h-screen bg-[#0D2240]">
      {/* Hero */}
      <section className="relative px-4 py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center space-y-5">
          <span className="inline-block font-display text-xs uppercase tracking-[0.3em] text-[#F5C842] border border-[#F5C842]/40 px-3 py-1 rounded-full">
            · Desde TikTok @elpollo_apuestas ·
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-black text-[#FDF6E3] leading-[1.05]">
            Lo que viste en 30 segundos,<br />
            <span className="text-[#F5C842]">aquí lo ves en profundidad.</span>
          </h1>
          <p className="font-sans text-base md:text-lg text-[#FDF6E3]/75 max-w-xl mx-auto">
            Picks MLB gratis · Análisis del día · Stats en vivo · Rachas de tipsters.
            Sin humo, datos reales.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/predicciones?utm_source=tiktok&utm_medium=bio&utm_campaign=elpollo"
              className="inline-flex items-center justify-center h-14 px-8 bg-[#F5C842] text-[#0D2240] font-display uppercase tracking-wider text-base font-bold rounded-sm shadow-[4px_4px_0px_#8B7355] hover:translate-y-[-2px] transition-transform"
            >
              Pick del día gratis →
            </Link>
            <Link
              href="/scores?utm_source=tiktok&utm_medium=bio&utm_campaign=elpollo"
              className="inline-flex items-center justify-center h-14 px-8 bg-transparent text-[#F5C842] font-display uppercase tracking-wider text-base font-bold rounded-sm border-2 border-[#F5C842]/60 hover:border-[#F5C842] transition-colors"
            >
              Ver scores en vivo
            </Link>
          </div>
        </div>
      </section>

      {/* Pick del día card */}
      {topPick && pickTeam && (
        <section className="px-4 pb-12">
          <div className="mx-auto max-w-3xl">
            <div className="bg-[#FDF6E3] border-[3px] border-[#F5C842] shadow-[6px_6px_0px_#5C4A32] rounded-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xs uppercase tracking-wider text-[#8B7355]">Pick del día · modelo</span>
                <span className="font-mono text-xs text-[#8B7355]">
                  {new Date().toLocaleDateString("es-CO", { timeZone: "America/Bogota", weekday: "short", day: "numeric", month: "short" })}
                </span>
              </div>
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex size-14 items-center justify-center rounded-full text-xs font-bold text-white border-2 border-[#8B7355]"
                    style={{ backgroundColor: colorFor(topPick.awayTeam.abbreviation) }}
                  >
                    {topPick.awayTeam.abbreviation}
                  </div>
                  <span className="font-display text-[10px] uppercase text-[#8B7355]">Visitante</span>
                </div>
                <span className="font-heading text-2xl font-black text-[#8B7355]/40">@</span>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex size-14 items-center justify-center rounded-full text-xs font-bold text-white border-2 border-[#8B7355]"
                    style={{ backgroundColor: colorFor(topPick.homeTeam.abbreviation) }}
                  >
                    {topPick.homeTeam.abbreviation}
                  </div>
                  <span className="font-display text-[10px] uppercase text-[#8B7355]">Local</span>
                </div>
              </div>
              <div className="border-t border-[#8B7355]/30 pt-4 space-y-2 text-center">
                <p className="font-display text-xs uppercase tracking-wider text-[#8B7355]">Pick</p>
                <p className="font-heading text-2xl font-bold text-[#0D2240]">
                  {pickTeam.abbreviation} ML
                </p>
                <p className="font-mono text-sm text-[#3D2B1F]">
                  Confianza: <span className="font-bold">{(topPick.prediction.confidence * 100).toFixed(1)}%</span>
                </p>
                {topPick.narrative && (
                  <p className="font-sans text-xs italic text-[#3D2B1F]/70 max-w-md mx-auto pt-2">
                    {topPick.narrative}
                  </p>
                )}
              </div>
              <div className="mt-5 flex justify-center">
                <Link
                  href="/predicciones?utm_source=tiktok&utm_medium=landing&utm_campaign=elpollo"
                  className="font-display text-xs uppercase tracking-wider text-[#C41E3A] hover:underline"
                >
                  Ver todos los picks →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick stats */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-3xl grid grid-cols-3 gap-3">
          {[
            { label: "Juegos hoy", value: String(todayCount || "—") },
            { label: "Picks modelo", value: String(report?.games.length ?? 0) },
            { label: "En vivo", value: String(liveCount) },
          ].map((s) => (
            <div key={s.label} className="bg-[#102a52] border border-[#F5C842]/20 rounded-sm p-4 text-center">
              <p className="font-mono text-3xl font-bold text-[#F5C842]">{s.value}</p>
              <p className="font-display text-[10px] uppercase tracking-wider text-[#FDF6E3]/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nav secundaria */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-display text-xs uppercase tracking-wider text-[#FDF6E3]/50 text-center mb-4">Explora más</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "Predicciones", href: "/predicciones" },
              { label: "Cuotas", href: "/cuotas" },
              { label: "Value bets", href: "/value-bets" },
              { label: "Power Rankings", href: "/power-rankings" },
            ].map((l) => (
              <Link
                key={l.href}
                href={`${l.href}?utm_source=tiktok&utm_medium=landing&utm_campaign=elpollo`}
                className="text-center py-3 px-2 bg-[#102a52]/50 border border-[#F5C842]/10 rounded-sm hover:border-[#F5C842]/40 transition-colors"
              >
                <span className="font-display text-xs uppercase tracking-wider text-[#FDF6E3]/80">{l.label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <ResponsibleGamingNotice />
          </div>
        </div>
      </section>
    </div>
  );
}
