import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tipsters = await prisma.user.findMany({
      where: { role: { in: ["TIPSTER", "ADMIN"] } },
      select: {
        id: true,
        displayName: true,
        username: true,
        avatar: true,
        picks: {
          where: { result: { not: "PENDING" } },
          select: { result: true, profit: true, stake: true, odds: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
        streaks: true,
      },
    });

    const leaderboard = tipsters.map((tipster) => {
      const picks = tipster.picks;
      const wins = picks.filter((p) => p.result === "WIN").length;
      const losses = picks.filter((p) => p.result === "LOSS").length;
      const pushes = picks.filter((p) => p.result === "PUSH").length;
      const total = picks.length;
      const profit = picks.reduce((sum, p) => sum + p.profit, 0);
      const staked = picks.reduce((sum, p) => sum + p.stake, 0);
      const winRate = total > 0 ? +((wins / total) * 100).toFixed(1) : 0;
      const roi = staked > 0 ? +((profit / staked) * 100).toFixed(1) : 0;

      // Calculate current streak
      let currentStreak = 0;
      let currentStreakType: "W" | "L" | null = null;
      for (const pick of picks) {
        if (pick.result === "PUSH" || pick.result === "VOID") continue;
        const isWin = pick.result === "WIN";
        if (currentStreakType === null) {
          currentStreakType = isWin ? "W" : "L";
          currentStreak = 1;
        } else if ((isWin && currentStreakType === "W") || (!isWin && currentStreakType === "L")) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate best win streak
      let bestStreak = 0;
      let tempStreak = 0;
      for (const pick of picks) {
        if (pick.result === "WIN") {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else if (pick.result === "LOSS") {
          tempStreak = 0;
        }
      }

      // Use DB streaks if available, otherwise use computed
      const dbCurrent = tipster.streaks.find((s) => s.type === "CURRENT");
      const dbBest = tipster.streaks.find((s) => s.type === "BEST");

      return {
        id: tipster.id,
        displayName: tipster.displayName,
        username: tipster.username,
        avatar: tipster.avatar,
        total,
        wins,
        losses,
        pushes,
        profit: +profit.toFixed(2),
        staked,
        winRate,
        roi,
        currentStreak: dbCurrent?.count ?? currentStreak,
        currentStreakType: currentStreakType ?? "W",
        bestStreak: dbBest?.count ?? bestStreak,
      };
    });

    leaderboard.sort((a, b) => b.currentStreak - a.currentStreak);

    return NextResponse.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error("Error fetching rachas:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
