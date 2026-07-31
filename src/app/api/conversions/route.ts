/**
 * ConvertFlow — GET /api/conversions (current user's list) / POST (persist for user)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const conversions = await db.conversion.findMany({
      where: user ? { userId: user.id } : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ ok: true, conversions });
  } catch {
    return NextResponse.json({ ok: true, conversions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const record = await db.conversion.create({
      data: {
        userId: user?.id ?? null,
        category: body.category,
        fromFormat: body.fromFormat,
        toFormat: body.toFormat,
        originalName: body.originalName,
        originalSize: body.originalSize,
        resultSize: body.resultSize ?? null,
        status: body.status ?? "completed",
        resultUrl: body.resultUrl ?? null,
        durationMs: body.durationMs ?? null,
      },
    });
    return NextResponse.json({ ok: true, conversion: record });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Impossible d'enregistrer la conversion." },
      { status: 500 },
    );
  }
}
