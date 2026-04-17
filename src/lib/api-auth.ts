import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";

export type AuthedUser = { id: string; role: Role; email: string | null };
export type RoleGuardFailure = { ok: false; response: NextResponse };
export type RoleGuardSuccess = { ok: true; user: AuthedUser };
export type RoleGuardResult = RoleGuardSuccess | RoleGuardFailure;

export async function requireRole(...allowed: Role[]): Promise<RoleGuardResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const role = session.user.role;
  if (!allowed.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    ok: true,
    user: { id: session.user.id, role, email: session.user.email ?? null },
  };
}
