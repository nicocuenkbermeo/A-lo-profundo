import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const tipsterId = request.nextUrl.searchParams.get("tipsterId");
  if (!tipsterId) {
    return NextResponse.json({ error: "tipsterId is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: tipsterId },
    select: { id: true, username: true, displayName: true, avatar: true, role: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Tipster not found" }, { status: 404 });
  }

  const picks = await prisma.pick.findMany({
    where: { tipsterId },
    select: { result: true, stake: true, profit: true },
  });

  const totals = picks.reduce(
    (acc, p) => {
      acc.totalPicks += 1;
      acc.totalStaked += p.stake;
      acc.totalProfit += p.profit;
      if (p.result === "WIN") acc.wins += 1;
      else if (p.result === "LOSS") acc.losses += 1;
      else if (p.result === "PUSH") acc.pushes += 1;
      return acc;
    },
    { totalPicks: 0, wins: 0, losses: 0, pushes: 0, totalStaked: 0, totalProfit: 0 },
  );

  const resolved = totals.wins + totals.losses;
  const winRate = resolved > 0 ? +((totals.wins / resolved) * 100).toFixed(2) : 0;
  const roi = totals.totalStaked > 0
    ? +((totals.totalProfit / totals.totalStaked) * 100).toFixed(2)
    : 0;

  const [currentStreak, bestStreak] = await Promise.all([
    prisma.streak.findFirst({
      where: { userId: tipsterId, type: "CURRENT" },
      select: { count: true },
    }),
    prisma.streak.findFirst({
      where: { userId: tipsterId, type: "BEST" },
      select: { count: true },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      ...totals,
      winRate,
      roi,
      currentStreak: currentStreak?.count ?? 0,
      bestStreak: bestStreak?.count ?? 0,
    },
  });
}
