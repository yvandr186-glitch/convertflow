/**
 * ConvertFlow — Shared types
 */

export type ViewId =
  | "home"
  | "convert"
  | "dashboard"
  | "tools-pdf"
  | "tools-image"
  | "tools-video"
  | "pricing"
  | "admin";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  plan: "free" | "pro" | "business";
  storageUsed: number;
  createdAt: string;
}

export interface ConversionRecord {
  id: string;
  category: string;
  fromFormat: string;
  toFormat: string;
  originalName: string;
  originalSize: number;
  resultSize: number | null;
  status: "pending" | "processing" | "completed" | "failed";
  resultUrl: string | null;
  durationMs: number | null;
  createdAt: string;
}

export interface FavoriteRecord {
  id: string;
  fromFormat: string;
  toFormat: string;
  category: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface ConvertResult {
  id: string;
  ok: boolean;
  outputName: string;
  outputUrl: string;
  outputSize: number;
  originalSize: number;
  durationMs: number;
  qrCode: string;
  expiresAt: string;
  message?: string;
}

export interface Stats {
  totalConversions: number;
  storageUsed: number;
  filesConverted: number;
  avgDurationMs: number;
  topFormats: { format: string; count: number }[];
  daily: { date: string; count: number }[];
  categoryBreakdown: { category: string; count: number; fill: string }[];
}
