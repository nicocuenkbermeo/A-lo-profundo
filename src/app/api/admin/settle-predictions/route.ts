import { NextResponse } from "next/server";
import { settlePendingPredictions } from "@/lib/mlb/features/settle";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const url = new URL(request.url);
  const queryKey = url.searchParams.get("key");
  const token = bearerToken ?? queryKey;

  if (token !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await settlePendingPredictions();
    console.log("[admin:settle]", JSON.stringify(result));
    return NextResponse.json({
      settled: result.settled,
      errors: result.errors,
      message: `Settled ${result.settled} predictions.`,
    });
  } catch (err) {
    console.error("[admin:settle] Error:", err);
    return NextResponse.json({ error: "Failed to settle predictions" }, { status: 500 });
  }
}
