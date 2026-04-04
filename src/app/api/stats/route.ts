import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod/v4";

const querySchema = z.object({
  type: z.enum(["teams", "batters", "pitchers"]).default("teams"),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  league: z.enum(["AL", "NL"]).optional(),
  division: z.enum(["EAST", "CENTRAL", "WEST"]).optional(),
  position: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(30),
  offset: z.coerce.number().min(0).default(0),
});

function generateMockBattingStats(playerId: string) {
  const seed = playerId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (min: number, max: number) =>
    min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);
  const ab = Math.floor(r(200, 550));
  const hits = Math.floor(ab * r(0.2, 0.33));
  const hr = Math.floor(r(5, 40));
  const rbi = Math.floor(r(30, 120));
  const avg = +(hits / ab).toFixed(3);
  const obp = +(avg + r(0.04, 0.1)).toFixed(3);
  const slg = +(avg + r(0.1, 0.25)).toFixed(3);
  return { games: Math.floor(r(80, 162)), ab, hits, hr, rbi, avg, obp, slg, ops: +(obp + slg).toFixed(3) };
}

function generateMockPitchingStats(playerId: string) {
  const seed = playerId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (min: number, max: number) =>
    min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);
  const wins = Math.floor(r(5, 18));
  const losses = Math.floor(r(3, 14));
  const ip = +(r(100, 220)).toFixed(1);
  const era = +(r(2.5, 5.0)).toFixed(2);
  const so = Math.floor(ip * r(0.7, 1.3));
  const whip = +(r(1.0, 1.5)).toFixed(2);
  return { games: Math.floor(r(20, 35)), wins, losses, ip, era, so, whip, saves: Math.floor(r(0, 5)) };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raw: Record<string, string | undefined> = {};
    for (const key of ["type", "sort", "order", "league", "division", "position", "search", "limit", "offset"]) {
      const v = searchParams.get(key);
      if (v !== null) raw[key] = v;
    }
    const parsed = querySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { type, league, division, position, search, limit, offset } = parsed.data;

    if (type === "teams") {
      const where: any = {};
      if (league) where.league = league;
      if (division) where.division = division;
      if (search) where.name = { contains: search, mode: "insensitive" };

      const [teams, total] = await Promise.all([
        prisma.team.findMany({
          where,
          include: {
            homeGames: { where: { status: "FINAL" }, select: { homeScore: true, awayScore: true } },
            awayGames: { where: { status: "FINAL" }, select: { homeScore: true, awayScore: true } },
          },
          take: limit,
          skip: offset,
        }),
        prisma.team.count({ where }),
      ]);

      const data = teams.map((team) => {
        let wins = 0, losses = 0;
        for (const g of team.homeGames) {
          if (g.homeScore > g.awayScore) wins++;
          else losses++;
        }
        for (const g of team.awayGames) {
          if (g.awayScore > g.homeScore) wins++;
          else losses++;
        }
        const pct = wins + losses > 0 ? +(wins / (wins + losses)).toFixed(3) : 0;
        const { homeGames, awayGames, ...rest } = team;
        return { ...rest, wins, losses, pct, gamesPlayed: wins + losses };
      });

      data.sort((a, b) => b.pct - a.pct);

      return NextResponse.json({ success: true, data, pagination: { total, limit, offset } });
    }

    // Players (batters or pitchers)
    const isPitcher = type === "pitchers";
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }
    if (position) where.position = position;
    if (isPitcher) where.position = { in: ["SP", "RP", "CL", "P"] };
    if (league || division) {
      where.team = {};
      if (league) where.team.league = league;
      if (division) where.team.division = division;
    }

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: { team: { select: { name: true, abbreviation: true, logoUrl: true } } },
        take: limit,
        skip: offset,
      }),
      prisma.player.count({ where }),
    ]);

    const data = players.map((player) => ({
      ...player,
      stats: isPitcher
        ? generateMockPitchingStats(player.id)
        : generateMockBattingStats(player.id),
    }));

    return NextResponse.json({ success: true, data, pagination: { total, limit, offset } });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
