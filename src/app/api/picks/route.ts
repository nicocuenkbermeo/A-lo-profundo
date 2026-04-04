import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";

const getQuerySchema = z.object({
  tipster: z.string().optional(),
  type: z.enum(["MONEYLINE", "RUNLINE", "TOTAL", "PROP", "PARLAY"]).optional(),
  result: z.enum(["PENDING", "WIN", "LOSS", "PUSH", "VOID"]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

const postBodySchema = z.object({
  gameId: z.string().min(1),
  pickType: z.enum(["MONEYLINE", "RUNLINE", "TOTAL", "PROP", "PARLAY"]),
  selection: z.string().min(1),
  odds: z.number(),
  stake: z.number().int().min(1).max(10),
  analysis: z.string().min(10),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raw: Record<string, string | undefined> = {};
    for (const key of ["tipster", "type", "result", "date", "limit", "offset"]) {
      const v = searchParams.get(key);
      if (v !== null) raw[key] = v;
    }
    const parsed = getQuerySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const { tipster, type, result, date, limit, offset } = parsed.data;

    const where: any = {};
    if (tipster) where.tipsterId = tipster;
    if (type) where.pickType = type;
    if (result) where.result = result;
    if (date) {
      const d = new Date(date);
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      where.createdAt = { gte: start, lte: end };
    }

    const [picks, total] = await Promise.all([
      prisma.pick.findMany({
        where,
        include: {
          tipster: { select: { id: true, displayName: true, avatar: true, username: true } },
          game: {
            include: {
              homeTeam: { select: { abbreviation: true, name: true, logoUrl: true } },
              awayTeam: { select: { abbreviation: true, name: true, logoUrl: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.pick.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: picks, pagination: { total, limit, offset } });
  } catch (error) {
    console.error("Error fetching picks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch picks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as any;
    if (!["TIPSTER", "ADMIN"].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: "Only tipsters can create picks" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = postBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { gameId, pickType, selection, odds, stake, analysis } = parsed.data;

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 }
      );
    }

    if (game.status !== "SCHEDULED") {
      return NextResponse.json(
        { success: false, error: "Game has already started" },
        { status: 400 }
      );
    }

    const pick = await prisma.pick.create({
      data: {
        tipsterId: user.id,
        gameId,
        pickType,
        selection,
        odds,
        stake,
        analysis,
      },
      include: {
        tipster: { select: { id: true, displayName: true, avatar: true } },
        game: {
          include: {
            homeTeam: { select: { abbreviation: true, name: true } },
            awayTeam: { select: { abbreviation: true, name: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: pick }, { status: 201 });
  } catch (error) {
    console.error("Error creating pick:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create pick" },
      { status: 500 }
    );
  }
}
