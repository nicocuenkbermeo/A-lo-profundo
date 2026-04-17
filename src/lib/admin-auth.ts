import { NextResponse } from "next/server";

export type AdminAuthFailure = { ok: false; response: NextResponse };
export type AdminAuthSuccess = { ok: true };
export type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

function extractToken(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);

  const xAdmin = request.headers.get("x-admin-token");
  if (xAdmin) return xAdmin;

  const url = new URL(request.url);
  return url.searchParams.get("key");
}

export function requireAdmin(request: Request): AdminAuthResult {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "ADMIN_SECRET not configured on server" },
        { status: 500 },
      ),
    };
  }

  const token = extractToken(request);
  if (!token || token !== expected) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true };
}

export function requireCron(request: Request): AdminAuthResult {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "CRON_SECRET not configured on server" },
        { status: 500 },
      ),
    };
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${expected}`) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true };
}
