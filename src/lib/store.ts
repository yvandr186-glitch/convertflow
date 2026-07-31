/**
 * ConvertFlow — Client state store (Zustand)
 * Auth talks to the real API (/api/auth/*) with httpOnly session cookies.
 * History & notifications are kept in localStorage for offline demo mode.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ViewId,
  User,
  ConversionRecord,
  AppNotification,
} from "@/types";

interface AppState {
  // view routing
  view: ViewId;
  setView: (v: ViewId) => void;

  // auth — real API backed
  user: User | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;

  // history (client cache; dashboard fetches its own from /api/dashboard)
  history: ConversionRecord[];
  setHistory: (h: ConversionRecord[]) => void;
  addConversion: (c: ConversionRecord) => void;
  removeConversion: (id: string) => void;
  clearHistory: () => void;

  // notifications
  notifications: AppNotification[];
  pushNotification: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  clearNotifications: () => void;

  // command palette
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "home",
      setView: (v) => {
        set({ view: v });
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },

      /* ------------------------------- Auth ------------------------------- */
      user: null,
      authLoading: true,

      fetchMe: async () => {
        try {
          const res = await fetch("/api/auth/me");
          const data = await res.json();
          set({ user: data.user ?? null, authLoading: false });
        } catch {
          set({ authLoading: false });
        }
      },

      login: async (email, password) => {
        set({ authLoading: true });
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.ok && data.user) {
            set({
              user: data.user,
              authLoading: false,
              notifications: [
                {
                  id: uid(),
                  title: "Connexion réussie",
                  message: `Heureux de vous revoir, ${data.user.name} !`,
                  type: "success",
                  read: false,
                  createdAt: new Date().toISOString(),
                },
                ...get().notifications,
              ].slice(0, 30),
            });
            return true;
          }
          set({ authLoading: false });
          return false;
        } catch {
          set({ authLoading: false });
          return false;
        }
      },

      register: async (name, email, password) => {
        set({ authLoading: true });
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await res.json();
          if (data.ok && data.user) {
            set({
              user: data.user,
              authLoading: false,
              notifications: [
                {
                  id: uid(),
                  title: "Bienvenue sur ConvertFlow 🎉",
                  message: "Votre compte est prêt. Quelques conversions d'exemple ont été ajoutées à votre tableau de bord.",
                  type: "success",
                  read: false,
                  createdAt: new Date().toISOString(),
                },
                ...get().notifications,
              ].slice(0, 30),
            });
            return true;
          }
          set({ authLoading: false });
          return false;
        } catch {
          set({ authLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {
          /* ignore */
        }
        set({ user: null, view: "home", history: [] });
      },

      /* ------------------------------ History ----------------------------- */
      history: [],
      setHistory: (h) => set({ history: h }),
      addConversion: (c) =>
        set((s) => ({ history: [c, ...s.history].slice(0, 100) })),
      removeConversion: (id) =>
        set((s) => ({ history: s.history.filter((c) => c.id !== id) })),
      clearHistory: () => set({ history: [] }),

      /* --------------------------- Notifications -------------------------- */
      notifications: [
        {
          id: uid(),
          title: "Bienvenue sur ConvertFlow",
          message: "Inscrivez-vous pour profiter de votre dashboard personnel.",
          type: "info",
          read: false,
          createdAt: new Date().toISOString(),
        },
      ],
      pushNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: uid(), createdAt: new Date().toISOString(), read: false },
            ...s.notifications,
          ].slice(0, 30),
        })),
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),

      /* -------------------------- Command palette ------------------------- */
      paletteOpen: false,
      setPaletteOpen: (open) => set({ paletteOpen: open }),
    }),
    {
      name: "convertflow-store",
      partialize: (s) => ({
        notifications: s.notifications,
      }),
    },
  ),
);

/**
 * Demo history shown only to visitors who are NOT logged in,
 * so the dashboard preview isn't empty before signup.
 */
export function getDemoHistory(): ConversionRecord[] {
  const now = Date.now();
  return [
    { id: uid(), category: "image", fromFormat: "PNG", toFormat: "WEBP", originalName: "hero-banner.png", originalSize: 2_340_000, resultSize: 612_000, status: "completed", resultUrl: null, durationMs: 820, createdAt: new Date(now - 1000 * 60 * 12).toISOString() },
    { id: uid(), category: "document", fromFormat: "PDF", toFormat: "DOCX", originalName: "rapport-q3.pdf", originalSize: 1_800_000, resultSize: 240_000, status: "completed", resultUrl: null, durationMs: 3_400, createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString() },
    { id: uid(), category: "image", fromFormat: "JPG", toFormat: "AVIF", originalName: "photo-vacances.jpg", originalSize: 4_120_000, resultSize: 380_000, status: "completed", resultUrl: null, durationMs: 1_540, createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString() },
    { id: uid(), category: "audio", fromFormat: "WAV", toFormat: "MP3", originalName: "podcast-ep12.wav", originalSize: 28_000_000, resultSize: 3_200_000, status: "completed", resultUrl: null, durationMs: 5_600, createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString() },
    { id: uid(), category: "developer", fromFormat: "JSON", toFormat: "YAML", originalName: "config.json", originalSize: 24_000, resultSize: 18_000, status: "completed", resultUrl: null, durationMs: 120, createdAt: new Date(now - 1000 * 60 * 60 * 30).toISOString() },
    { id: uid(), category: "video", fromFormat: "MOV", toFormat: "MP4", originalName: "clip-publicite.mov", originalSize: 96_000_000, resultSize: 22_000_000, status: "completed", resultUrl: null, durationMs: 12_400, createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString() },
  ];
}
