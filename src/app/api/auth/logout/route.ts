/**
 * ConvertFlow — POST /api/auth/logout
 * Deletes the session record and clears the cookie.
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionToken, clearSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    const token = await getSessionToken();
    if (token) {
      await db.session.deleteMany({ where: { token } }).catch(() => {});
    }
    await clearSessionCookie();
    return NextResponse.json({ ok: true, message: "Déconnecté." });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
