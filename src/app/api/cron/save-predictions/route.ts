import { NextResponse } from "next/server";
import { saveTodaysPredictions } from "@/lib/mlb/features/save-predictions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function nowBogota(): string {
  return new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(`[cron:save-predictions] Started at ${nowBogota()}`);

  try {
    const result = await saveTodaysPredictions();
    console.log(`[cron:save-predictions] Completed at ${nowBogota()}:`, JSON.stringify(result));
    return NextResponse.json(result);
  } catch (err) {
    console.error(`[cron:save-predictions] Failed at ${nowBogota()}:`, err);
    return NextResponse.json({ error: "Failed to save predictions" }, { status: 500 });
  }
}
