/**
 * ConvertFlow — GET /api/dashboard
 * Returns the logged-in user's personal dashboard data:
 * stats, recent conversions, top formats, daily activity, category breakdown.
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const CATEGORY_COLORS: Record<string, string> = {
  image: "#2563eb",
  document: "#e11d48",
  audio: "#7c3aed",
  video: "#ea580c",
  archive: "#059669",
  ebook: "#0d9488",
  developer: "#c026d3",
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Non authentifié." }, { status: 401 });
  }

  // Fetch the user's conversions (last 100)
  const conversions = await db.conversion.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const total = conversions.length;
  const completed = conversions.filter((c) => c.status === "completed");
  const totalSaved = completed.reduce(
    (acc, c) => acc + (c.originalSize - (c.resultSize ?? c.originalSize)),
    0,
  );
  const avgDuration =
    completed.length > 0
      ? completed.reduce((acc, c) => acc + (c.durationMs ?? 0), 0) / completed.length
      : 0;

  // Daily activity (last 7 days)
  const daily: { date: string; count: number; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = conversions.filter(
      (c) => c.createdAt >= d && c.createdAt < next,
    ).length;
    daily.push({
      date: d.toISOString().slice(0, 10),
      count,
      label: d.toLocaleDateString("fr-FR", { weekday: "short" }),
    });
  }

  // Category breakdown
  const catMap: Record<string, number> = {};
  for (const c of conversions) {
    catMap[c.category] = (catMap[c.category] ?? 0) + 1;
  }
  const categoryBreakdown = Object.entries(catMap).map(([category, count]) => ({
    category,
    count,
    fill: CATEGORY_COLORS[category] ?? "#2563eb",
  }));

  // Top formats
  const fmtMap: Record<string, number> = {};
  for (const c of conversions) {
    const key = `${c.fromFormat}→${c.toFormat}`;
    fmtMap[key] = (fmtMap[key] ?? 0) + 1;
  }
  const topFormats = Object.entries(fmtMap)
    .map(([format, count]) => ({ format, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Favorites (from the Favorite table)
  const favorites = await db.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

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
    stats: {
      totalConversions: total,
      storageSaved: totalSaved,
      filesConverted: completed.length,
      avgDurationMs: Math.round(avgDuration),
    },
    conversions: conversions.slice(0, 50).map((c) => ({
      id: c.id,
      category: c.category,
      fromFormat: c.fromFormat,
      toFormat: c.toFormat,
      originalName: c.originalName,
      originalSize: c.originalSize,
      resultSize: c.resultSize,
      status: c.status,
      resultUrl: c.resultUrl,
      durationMs: c.durationMs,
      createdAt: c.createdAt.toISOString(),
    })),
    daily,
    categoryBreakdown,
    topFormats,
    favorites: favorites.map((f) => ({
      id: f.id,
      fromFormat: f.fromFormat,
      toFormat: f.toFormat,
      category: f.category,
    })),
  });
}
