// Admin-gated endpoint to generate a weekly snapshot of the Power Rankings.
//
// Usage:
//
//   curl -X POST https://aloprofundomlb.com/api/admin/power-rankings/snapshot \
//        -H "Authorization: Bearer $ADMIN_SECRET"
//
// Response is the JSON blob to append to
// public/data/power-rankings-history.json — commit manually or via GitHub Action.

import { NextResponse } from "next/server";
import { buildPowerRankings, rankingsToSnapshot } from "@/lib/mlb/features/power-rankings";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const guard = requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const report = await buildPowerRankings();
    const snapshot = rankingsToSnapshot(report);
    return NextResponse.json({
      success: true,
      instructions:
        "Copia el objeto 'snapshot' en public/data/power-rankings-history.json dentro del array 'snapshots' y commitea.",
      snapshot,
    });
  } catch (err) {
    console.error("[admin/power-rankings/snapshot] failed", err);
    return NextResponse.json(
      { success: false, error: "No se pudo generar el snapshot" },
      { status: 500 },
    );
  }
}
