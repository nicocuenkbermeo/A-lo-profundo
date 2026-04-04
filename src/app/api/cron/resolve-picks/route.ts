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

    // Find FINAL games that have PENDING picks
    const pendingPicks = await prisma.pick.findMany({
      where: {
        result: "PENDING",
        game: { status: "FINAL" },
      },
      include: {
        game: {
          include: {
            homeTeam: { select: { abbreviation: true, name: true } },
            awayTeam: { select: { abbreviation: true, name: true } },
          },
        },
      },
    });

    if (pendingPicks.length === 0) {
      return NextResponse.json({
        success: true,
        data: { message: "No pending picks to resolve", resolved: 0 },
      });
    }

    let resolved = 0;

    for (const pick of pendingPicks) {
      const { game } = pick;
      const homeWon = game.homeScore > game.awayScore;
      const winner = homeWon ? game.homeTeam.abbreviation : game.awayTeam.abbreviation;
      const margin = Math.abs(game.homeScore - game.awayScore);
      const totalRuns = game.homeScore + game.awayScore;

      let result: "WIN" | "LOSS" | "PUSH" = "LOSS";
      let profit = -pick.stake;

      switch (pick.pickType) {
        case "MONEYLINE": {
          if (pick.selection === winner) {
            result = "WIN";
            profit = pick.odds > 0
              ? (pick.odds / 100) * pick.stake
              : (100 / Math.abs(pick.odds)) * pick.stake;
          }
          break;
        }
        case "RUNLINE": {
          // Selection format: "NYY -1.5" or "BOS +1.5"
          const parts = pick.selection.split(" ");
          const team = parts[0];
          const spread = parseFloat(parts[1] || "0");
          const teamScore = team === game.homeTeam.abbreviation ? game.homeScore : game.awayScore;
          const oppScore = team === game.homeTeam.abbreviation ? game.awayScore : game.homeScore;
          const adjustedMargin = teamScore - oppScore + spread;

          if (adjustedMargin > 0) {
            result = "WIN";
            profit = pick.odds > 0
              ? (pick.odds / 100) * pick.stake
              : (100 / Math.abs(pick.odds)) * pick.stake;
          } else if (adjustedMargin === 0) {
            result = "PUSH";
            profit = 0;
          }
          break;
        }
        case "TOTAL": {
          // Selection format: "OVER 8.5" or "UNDER 8.5"
          const totalParts = pick.selection.split(" ");
          const direction = totalParts[0];
          const line = parseFloat(totalParts[1] || "0");

          if (
            (direction === "OVER" && totalRuns > line) ||
            (direction === "UNDER" && totalRuns < line)
          ) {
            result = "WIN";
            profit = pick.odds > 0
              ? (pick.odds / 100) * pick.stake
              : (100 / Math.abs(pick.odds)) * pick.stake;
          } else if (totalRuns === line) {
            result = "PUSH";
            profit = 0;
          }
          break;
        }
        default: {
          // PROP/PARLAY: simple win/loss based on whether home team won as fallback
          if (pick.selection === winner) {
            result = "WIN";
            profit = pick.odds > 0
              ? (pick.odds / 100) * pick.stake
              : (100 / Math.abs(pick.odds)) * pick.stake;
          }
        }
      }

      profit = +profit.toFixed(2);

      await prisma.pick.update({
        where: { id: pick.id },
        data: {
          result,
          profit,
          resolvedAt: new Date(),
        },
      });

      // Update tipster's current streak
      const recentPicks = await prisma.pick.findMany({
        where: { tipsterId: pick.tipsterId, result: { not: "PENDING" } },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      let streak = 0;
      for (const rp of recentPicks) {
        if (rp.result === "PUSH" || rp.result === "VOID") continue;
        if (rp.result === "WIN") streak++;
        else break;
      }

      // Upsert current streak
      const existingCurrent = await prisma.streak.findFirst({
        where: { userId: pick.tipsterId, type: "CURRENT" },
      });

      if (existingCurrent) {
        await prisma.streak.update({
          where: { id: existingCurrent.id },
          data: { count: streak, isActive: streak > 0 },
        });
      } else {
        await prisma.streak.create({
          data: { userId: pick.tipsterId, type: "CURRENT", count: streak, isActive: streak > 0 },
        });
      }

      // Update best streak if needed
      const existingBest = await prisma.streak.findFirst({
        where: { userId: pick.tipsterId, type: "BEST" },
      });

      if (!existingBest || streak > existingBest.count) {
        if (existingBest) {
          await prisma.streak.update({
            where: { id: existingBest.id },
            data: { count: streak },
          });
        } else {
          await prisma.streak.create({
            data: { userId: pick.tipsterId, type: "BEST", count: streak },
          });
        }
      }

      resolved++;
    }

    return NextResponse.json({
      success: true,
      data: { message: `Resolved ${resolved} picks`, resolved },
    });
  } catch (error) {
    console.error("Error resolving picks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resolve picks" },
      { status: 500 }
    );
  }
}
