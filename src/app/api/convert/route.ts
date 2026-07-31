/**
 * ConvertFlow — POST /api/convert
 * Accepts a file (multipart) + from/to formats, runs the conversion and
 * returns a base64 result with a QR code for secure temporary download.
 */

import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { runConversion } from "@/services/conversion-service";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fromFormat = String(formData.get("fromFormat") ?? "");
    const toFormat = String(formData.get("toFormat") ?? "");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Aucun fichier reçu." },
        { status: 400 },
      );
    }
    if (!fromFormat || !toFormat) {
      return NextResponse.json(
        { ok: false, error: "Formats source/cible manquants." },
        { status: 400 },
      );
    }

    // 25 MB hard cap for the demo
    const MAX = 25 * 1024 * 1024;
    if (file.size > MAX) {
      return NextResponse.json(
        { ok: false, error: "Fichier trop volumineux (max 25 Mo)." },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const out = await runConversion({
      buffer,
      fromFormat,
      toFormat,
      originalName: file.name,
    });

    const baseName = file.name.replace(/\.[^.]+$/, "");
    const outputName = `${baseName}.${out.ext}`;

    // Build a secure temporary download token (demo: data URL).
    const dataUrl = `data:${out.mime};base64,${out.buffer.toString("base64")}`;

    // QR code pointing to a self-contained data URL is too large; instead we
    // encode a short signed-looking token the frontend can resolve.
    const token = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    const downloadUrl = `/download/${token}`;
    const qrCode = await QRCode.toDataURL(downloadUrl, {
      margin: 1,
      width: 240,
      color: { dark: "#1d4ed8", light: "#ffffff" },
    });

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(); // 24h

    return NextResponse.json({
      id: token,
      ok: true,
      outputName,
      outputUrl: dataUrl,
      outputMime: out.mime,
      outputSize: out.buffer.length,
      originalSize: buffer.length,
      durationMs: out.durationMs,
      qrCode,
      downloadUrl,
      expiresAt,
      message: `Converti de ${fromFormat.toUpperCase()} vers ${toFormat.toUpperCase()} en ${out.durationMs} ms.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json(
      { ok: false, error: `Échec de la conversion: ${message}` },
      { status: 500 },
    );
  }
}
