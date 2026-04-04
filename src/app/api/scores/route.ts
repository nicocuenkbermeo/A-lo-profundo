import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod/v4";

const querySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  status: z
    .enum(["SCHEDULED", "LIVE", "FINAL", "POSTPONED", "CANCELLED"])
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      date: searchParams.get("date") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { date, status } = parsed.data;

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const games = await prisma.game.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        ...(status ? { status: status as any } : {}),
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        innings: { orderBy: { inningNumber: "asc" } },
        lines: true,
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scores" },
      { status: 500 }
    );
  }
}
