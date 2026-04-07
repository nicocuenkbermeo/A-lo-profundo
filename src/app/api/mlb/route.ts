import { NextRequest, NextResponse } from "next/server";
import { fetchMlbGames, todayInBogota } from "@/lib/mlb-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? todayInBogota();
  try {
    const games = await fetchMlbGames(date);
    return NextResponse.json({ success: true, date, count: games.length, data: games });
  } catch (error) {
    console.error("[api/mlb] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch MLB games" },
      { status: 500 }
    );
  }
}
