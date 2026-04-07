// Admin-gated endpoint to generate a weekly snapshot of the Power Rankings.
//
// Usage (from a cron / human):
//
//   curl -X POST https://aloprofundomlb.com/api/admin/power-rankings/snapshot \
//        -H "x-admin-token: $ADMIN_TOKEN"
//
// The response is the JSON blob to append to
// public/data/power-rankings-history.json — either commit it manually or via
// a GitHub Action. The file itself is read-only at runtime on Vercel.

import { NextResponse } from "next/server";
import { buildPowerRankings, rankingsToSnapshot } from "@/lib/mlb/features/power-rankings";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const token = request.headers.get("x-admin-token");
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    return NextResponse.json(
      { success: false, error: "ADMIN_TOKEN no configurado en el servidor." },
      { status: 500 },
    );
  }
  if (token !== expected) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

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
