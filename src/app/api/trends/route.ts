import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Hot teams: best record in last 10 games
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

    // Top pitchers (mock ERA leaders)
    const pitchers = await prisma.player.findMany({
      where: { position: { in: ["SP", "RP", "CL", "P"] }, isActive: true },
      include: { team: { select: { abbreviation: true, name: true } } },
      take: 50,
    });

    const topPitchers = pitchers
      .map((p) => {
        const seed = p.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
        const era = +(2.0 + ((seed * 9301 + 49297) % 233280) / 233280 * 3.5).toFixed(2);
        const wins = Math.floor(5 + ((seed * 7331) % 13));
        const so = Math.floor(80 + ((seed * 4127) % 150));
        return {
          id: p.id,
          name: `${p.firstName} ${p.lastName}`,
          team: p.team.abbreviation,
          era,
          wins,
          strikeouts: so,
        };
      })
      .sort((a, b) => a.era - b.era)
      .slice(0, 10);

    // Betting trends (mock cover rates)
    const bettingTrends = [
      { label: "Favoritos ML (últimos 30 días)", value: 57.3, description: "Favoritos han ganado el 57.3% de los juegos" },
      { label: "Tendencia Over/Under", value: 52.1, description: "El Over ha pegado en el 52.1% de los juegos" },
      { label: "Equipos locales ML", value: 54.8, description: "Equipos locales ganan el 54.8% en casa" },
      { label: "Run Line -1.5 favoritos", value: 44.2, description: "Favoritos cubren -1.5 en el 44.2% de juegos" },
      { label: "Underdogs +150 o mejor", value: 38.6, description: "Underdogs a +150+ ganan el 38.6%" },
    ];

    return NextResponse.json({
      success: true,
      data: {
        hotTeams,
        topPitchers,
        bettingTrends,
      },
    });
  } catch (error) {
    console.error("Error fetching trends:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trends" },
      { status: 500 }
    );
  }
}
