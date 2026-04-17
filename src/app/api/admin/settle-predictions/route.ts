import { NextResponse } from "next/server";
import { settlePendingPredictions } from "@/lib/mlb/features/settle";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const guard = requireAdmin(request);
  if (!guard.ok) return guard.response;

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
