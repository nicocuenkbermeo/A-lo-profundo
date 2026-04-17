import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        homeGames: {
          where: { status: "FINAL" },
          select: { homeScore: true, awayScore: true, date: true },
          orderBy: { date: "desc" },
          take: 10,
        },
        awayGames: {
          where: { status: "FINAL" },
          select: { homeScore: true, awayScore: true, date: true },
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });

    const hotTeams = teams
      .map((team) => {
        const recentGames = [
          ...team.homeGames.map((g) => ({
            won: g.homeScore > g.awayScore,
            date: g.date,
          })),
          ...team.awayGames.map((g) => ({
            won: g.awayScore > g.homeScore,
            date: g.date,
          })),
        ]
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .slice(0, 10);

        const wins = recentGames.filter((g) => g.won).length;
        const losses = recentGames.length - wins;

        return {
          id: team.id,
          name: team.name,
          abbreviation: team.abbreviation,
          logoUrl: team.logoUrl,
          last10: { wins, losses },
          record: `${wins}-${losses}`,
        };
      })
      .sort((a, b) => b.last10.wins - a.last10.wins)
      .slice(0, 10);

    const bettingTrends = await computeBettingTrends();

    return NextResponse.json({
      success: true,
      data: {
        hotTeams,
        bettingTrends,
      },
    });
  } catch (error) {
    console.error("Error fetching trends:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trends" },
      { status: 500 },
    );
  }
}

async function computeBettingTrends() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const games = await prisma.game.findMany({
    where: { status: "FINAL", date: { gte: since } },
    select: {
      homeScore: true,
      awayScore: true,
      lines: {
        select: {
          homeMoneyline: true,
          awayMoneyline: true,
          runLineSpread: true,
          totalLine: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  });

  if (games.length === 0) {
    return [];
  }

  let favWins = 0;
  let favTotal = 0;
  let overHits = 0;
  let overTotal = 0;
  let homeWins = 0;
  let homeFavWins = 0;
  let homeFavTotal = 0;

  for (const g of games) {
    const line = g.lines[0];
    if (!line) continue;

    const homeIsFav = line.homeMoneyline < line.awayMoneyline;
    const homeWon = g.homeScore > g.awayScore;
    const awayWon = g.awayScore > g.homeScore;

    if (homeWon) homeWins++;

    favTotal++;
    if ((homeIsFav && homeWon) || (!homeIsFav && awayWon)) favWins++;

    if (homeIsFav) {
      homeFavTotal++;
      if (homeWon) homeFavWins++;
    }

    if (line.totalLine > 0) {
      overTotal++;
      if (g.homeScore + g.awayScore > line.totalLine) overHits++;
    }
  }

  const pct = (w: number, t: number) => (t > 0 ? +((w / t) * 100).toFixed(1) : 0);

  return [
    {
      label: "Favoritos ML (últimos 30 días)",
      value: pct(favWins, favTotal),
      sample: favTotal,
      description: `Favoritos ganaron ${favWins} de ${favTotal} juegos`,
    },
    {
      label: "Over/Under",
      value: pct(overHits, overTotal),
      sample: overTotal,
      description: `El Over pegó en ${overHits} de ${overTotal} juegos`,
    },
    {
      label: "Equipos locales",
      value: pct(homeWins, games.length),
      sample: games.length,
      description: `Locales ganan ${homeWins} de ${games.length}`,
    },
    {
      label: "Favoritos locales",
      value: pct(homeFavWins, homeFavTotal),
      sample: homeFavTotal,
      description: `Favoritos en casa ganaron ${homeFavWins} de ${homeFavTotal}`,
    },
  ];
}
