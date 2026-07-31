/**
 * ConvertFlow — POST /api/auth/register
 * Creates a user, hashes the password, opens a session and seeds demo data.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";

const DEMO_SEED: { category: string; fromFormat: string; toFormat: string; originalName: string; originalSize: number; resultSize: number; durationMs: number; agoMin: number }[] = [
  { category: "image", fromFormat: "PNG", toFormat: "WEBP", originalName: "welcome-banner.png", originalSize: 2_340_000, resultSize: 612_000, durationMs: 820, agoMin: 8 },
  { category: "document", fromFormat: "PDF", toFormat: "DOCX", originalName: "getting-started.pdf", originalSize: 1_800_000, resultSize: 240_000, durationMs: 3_400, agoMin: 35 },
  { category: "image", fromFormat: "JPG", toFormat: "AVIF", originalName: "profile.jpg", originalSize: 4_120_000, resultSize: 380_000, durationMs: 1_540, agoMin: 120 },
];

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email et mot de passe requis." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Email invalide." },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Le mot de passe doit faire au moins 8 caractères." },
        { status: 400 },
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "Un compte existe déjà avec cet email." },
        { status: 409 },
      );
    }

    const passwordHash = hashPassword(password);
    const user = await db.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        passwordHash,
        plan: "free",
        role: "user",
      },
    });

    // Seed a few demo conversions so the first dashboard isn't empty
    const now = Date.now();
    await db.conversion.createMany({
      data: DEMO_SEED.map((s) => ({
        userId: user.id,
        category: s.category,
        fromFormat: s.fromFormat,
        toFormat: s.toFormat,
        originalName: s.originalName,
        originalSize: s.originalSize,
        resultSize: s.resultSize,
        status: "completed",
        durationMs: s.durationMs,
        createdAt: new Date(now - s.agoMin * 60 * 1000),
      })),
    });

    const token = await createSession(user.id);
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        storageUsed: user.storageUsed,
        createdAt: user.createdAt.toISOString(),
      },
      message: "Compte créé avec succès !",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json(
      { ok: false, error: `Inscription impossible: ${message}` },
      { status: 500 },
    );
  }
}
