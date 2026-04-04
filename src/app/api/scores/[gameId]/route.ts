import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        homeTeam: true,
        awayTeam: true,
        innings: { orderBy: { inningNumber: "asc" } },
        lines: true,
        picks: {
          include: { tipster: { select: { id: true, displayName: true, avatar: true } } },
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: game });
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}
