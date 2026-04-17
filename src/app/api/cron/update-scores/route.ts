import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fetchGameDetail } from "@/lib/mlb-api";
import { requireCron } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const guard = requireCron(request);
  if (!guard.ok) return guard.response;

  try {
    const liveGames = await prisma.game.findMany({
      where: { status: { in: ["LIVE", "SCHEDULED"] } },
      select: { id: true, externalId: true },
    });

    if (liveGames.length === 0) {
      return NextResponse.json({
        success: true,
        data: { message: "No games to update", updated: 0 },
      });
    }

    let updated = 0;
    const errors: Array<{ gameId: string; error: string }> = [];

    for (const game of liveGames) {
      try {
        const detail = await fetchGameDetail(game.externalId);
        if (!detail) {
          errors.push({ gameId: game.id, error: "No live feed returned" });
          continue;
        }

        await prisma.$transaction(async (tx) => {
          await tx.game.update({
            where: { id: game.id },
            data: {
              homeScore: detail.home.score ?? 0,
              awayScore: detail.away.score ?? 0,
              inning: detail.inning ?? null,
              inningHalf: detail.inningHalf ?? null,
              outs: detail.outs ?? 0,
              status: detail.status,
            },
          });

          if (Array.isArray(detail.innings)) {
            for (const inn of detail.innings) {
              await tx.gameInning.upsert({
                where: {
                  gameId_inningNumber: {
                    gameId: game.id,
                    inningNumber: inn.inningNumber,
                  },
                },
                update: { homeRuns: inn.homeRuns, awayRuns: inn.awayRuns },
                create: {
                  gameId: game.id,
                  inningNumber: inn.inningNumber,
                  homeRuns: inn.homeRuns,
                  awayRuns: inn.awayRuns,
                },
              });
            }
          }
        });

        updated++;
      } catch (err) {
        errors.push({
          gameId: game.id,
          error: err instanceof Error ? err.message : "unknown",
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { message: `Updated ${updated}/${liveGames.length} games`, updated, errors },
    });
  } catch (error) {
    console.error("[cron:update-scores] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update scores" },
      { status: 500 },
    );
  }
}
