import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find all LIVE games
    const liveGames = await prisma.game.findMany({
      where: { status: "LIVE" },
      include: { innings: true },
    });

    if (liveGames.length === 0) {
      return NextResponse.json({
        success: true,
        data: { message: "No live games to update", updated: 0 },
      });
    }

    let updated = 0;

    for (const game of liveGames) {
      // Simulate score progression
      const addHomeRuns = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0;
      const addAwayRuns = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0;

      const currentInning = game.inning ?? 1;
      const currentHalf = game.inningHalf ?? "TOP";

      let newInning = currentInning;
      let newHalf = currentHalf;
      let newOuts = game.outs + Math.floor(Math.random() * 3);
      let newStatus = game.status;

      if (newOuts >= 3) {
        newOuts = 0;
        if (currentHalf === "TOP") {
          newHalf = "BOTTOM";
        } else {
          newHalf = "TOP";
          newInning = currentInning + 1;
        }
      }

      // Game ends after 9th inning bottom (or top if home leading)
      if (newInning > 9 && newHalf === "TOP") {
        const homeTotal = game.homeScore + addHomeRuns;
        const awayTotal = game.awayScore + addAwayRuns;
        if (homeTotal !== awayTotal) {
          newStatus = "FINAL";
          newInning = 9;
          newHalf = "BOTTOM";
        }
      }

      // Upsert inning data
      if (addHomeRuns > 0 || addAwayRuns > 0) {
        await prisma.gameInning.upsert({
          where: {
            gameId_inningNumber: { gameId: game.id, inningNumber: currentInning },
          },
          update: {
            homeRuns: { increment: addHomeRuns },
            awayRuns: { increment: addAwayRuns },
          },
          create: {
            gameId: game.id,
            inningNumber: currentInning,
            homeRuns: addHomeRuns,
            awayRuns: addAwayRuns,
          },
        });
      }

      await prisma.game.update({
        where: { id: game.id },
        data: {
          homeScore: { increment: addHomeRuns },
          awayScore: { increment: addAwayRuns },
          inning: newInning,
          inningHalf: newHalf as any,
          outs: newOuts,
          status: newStatus as any,
        },
      });

      updated++;
    }

    return NextResponse.json({
      success: true,
      data: { message: `Updated ${updated} live games`, updated },
    });
  } catch (error) {
    console.error("Error updating scores:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update scores" },
      { status: 500 }
    );
  }
}
