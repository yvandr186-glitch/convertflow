/**
 * ConvertFlow — GET /api/auth/me
 * Returns the currently authenticated user (or null).
 */

import { NextResponse } from "next/server";
import { getCurrentUserClient } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUserClient();
  return NextResponse.json({ ok: true, user });
}
