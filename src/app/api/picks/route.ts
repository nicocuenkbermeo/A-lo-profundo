import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const pickTypeSchema = z.enum(["MONEYLINE", "RUNLINE", "TOTAL", "PROP", "PARLAY"]);
const pickResultSchema = z.enum(["PENDING", "WIN", "LOSS", "PUSH", "VOID"]);

const createPickSchema = z.object({
  gameId: z.string().min(1),
  pickType: pickTypeSchema,
  selection: z.string().min(1).max(200),
  odds: z.number().finite().refine((n) => n !== 0, "odds cannot be zero"),
  stake: z.number().int().min(1).max(10),
  analysis: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  const guard = await requireRole("TIPSTER", "ADMIN");
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createPickSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const game = await prisma.game.findUnique({
    where: { id: data.gameId },
    select: { id: true, status: true, date: true },
  });
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  if (game.status !== "SCHEDULED") {
    return NextResponse.json(
      { error: "Picks can only be created for scheduled games" },
      { status: 409 },
    );
  }

  const pick = await prisma.pick.create({
    data: {
      tipsterId: guard.user.id,
      gameId: data.gameId,
      pickType: data.pickType,
      selection: data.selection,
      odds: data.odds,
      stake: data.stake,
      analysis: data.analysis,
      result: "PENDING",
      profit: 0,
    },
    include: {
      tipster: { select: { id: true, username: true, displayName: true, avatar: true } },
      game: {
        select: {
          id: true,
          date: true,
          status: true,
          homeTeam: { select: { abbreviation: true, name: true } },
          awayTeam: { select: { abbreviation: true, name: true } },
        },
      },
    },
  });

  return NextResponse.json({ success: true, data: pick }, { status: 201 });
}

const listQuerySchema = z.object({
  tipsterId: z.string().optional(),
  gameId: z.string().optional(),
  result: pickResultSchema.optional(),
  pickType: pickTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const parsed = listQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { tipsterId, gameId, result, pickType, limit, cursor } = parsed.data;

  const picks = await prisma.pick.findMany({
    where: {
      ...(tipsterId ? { tipsterId } : {}),
      ...(gameId ? { gameId } : {}),
      ...(result ? { result } : {}),
      ...(pickType ? { pickType } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      tipster: { select: { id: true, username: true, displayName: true, avatar: true } },
      game: {
        select: {
          id: true,
          date: true,
          status: true,
          homeTeam: { select: { abbreviation: true, name: true } },
          awayTeam: { select: { abbreviation: true, name: true } },
        },
      },
    },
  });

  const hasMore = picks.length > limit;
  const items = hasMore ? picks.slice(0, limit) : picks;

  return NextResponse.json({
    success: true,
    data: items,
    nextCursor: hasMore ? items[items.length - 1].id : null,
  });
}
