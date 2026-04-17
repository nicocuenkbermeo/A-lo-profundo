import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const guard = requireAdmin(request);
  if (!guard.ok) return guard.response;
  return NextResponse.json({ ok: true });
}
