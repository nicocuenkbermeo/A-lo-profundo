import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function generateMockBattingStats(playerId: string) {
  const seed = playerId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = (min: number, max: number) =>
    min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);
  const ab = Math.floor(r(200, 550));
  const hits = Math.floor(ab * r(0.2, 0.33));
  const doubles = Math.floor(r(15, 40));
  const triples = Math.floor(r(1, 8));
  const hr = Math.floor(r(5, 40));
  const rbi = Math.floor(r(30, 120));
  const runs = Math.floor(r(40, 110));
  const sb = Math.floor(r(2, 30));
  const bb = Math.floor(r(20, 80));
  const so = Math.floor(r(60, 180));
  const avg = +(hits / ab).toFixed(3);
  const obp = +(avg + r(0.04, 0.1)).toFixed(3);
  const slg = +(avg + r(0.1, 0.25)).toFixed(3);
  return { games: Math.floor(r(80, 162)), ab, hits, doubles, triples, hr, rbi, runs, sb, bb, so, avg, obp, slg, ops: +(obp + slg).toFixed(3) };
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
  const bb = Math.floor(ip * r(0.15, 0.35));
  const whip = +(r(1.0, 1.5)).toFixed(2);
  const hr = Math.floor(r(10, 30));
  return { games: Math.floor(r(20, 35)), wins, losses, ip, era, so, bb, whip, hr, saves: Math.floor(r(0, 5)), holds: Math.floor(r(0, 10)) };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        team: true,
      },
    });

    if (!player) {
      return NextResponse.json(
        { success: false, error: "Player not found" },
        { status: 404 }
      );
    }

    const isPitcher = ["SP", "RP", "CL", "P"].includes(player.position);
    const stats = isPitcher
      ? { pitching: generateMockPitchingStats(player.id) }
      : { batting: generateMockBattingStats(player.id) };

    return NextResponse.json({ success: true, data: { ...player, ...stats } });
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}
