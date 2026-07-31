/**
 * ConvertFlow — POST /api/contact
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Tous les champs sont requis." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Email invalide." },
        { status: 400 },
      );
    }

    await db.contact.create({
      data: { name, email, subject, message },
    });

    return NextResponse.json({
      ok: true,
      message: "Message envoyé. Notre équipe vous répondra sous 24h.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erreur lors de l'envoi du message." },
      { status: 500 },
    );
  }
}
