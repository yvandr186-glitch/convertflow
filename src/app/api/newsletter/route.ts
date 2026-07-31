/**
 * ConvertFlow — POST /api/newsletter
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Email invalide." },
        { status: 400 },
      );
    }

    const existing = await db.newsletter.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "Vous êtes déjà inscrit !",
      });
    }

    await db.newsletter.create({ data: { email } });
    return NextResponse.json({
      ok: true,
      message: "Inscription confirmée. Bienvenue dans la famille ConvertFlow !",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erreur lors de l'inscription." },
      { status: 500 },
    );
  }
}
