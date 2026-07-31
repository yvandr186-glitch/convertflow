"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/command-palette";
import { useAppStore } from "@/lib/store";

// Lazy-loaded views for code splitting
const LandingView = dynamic(
  () => import("@/components/landing/landing-view").then((m) => m.LandingView),
  { loading: () => <ViewSkeleton /> },
);
const ConverterView = dynamic(
  () => import("@/components/converter/converter-view").then((m) => m.ConverterView),
  { loading: () => <ViewSkeleton /> },
);
const DashboardView = dynamic(
  () => import("@/components/dashboard/dashboard-view").then((m) => m.DashboardView),
  { loading: () => <ViewSkeleton /> },
);
const ToolsView = dynamic(
  () => import("@/components/tools/tools-view").then((m) => m.ToolsView),
  { loading: () => <ViewSkeleton /> },
);
const PricingView = dynamic(
  () => import("@/components/landing/pricing-view").then((m) => m.PricingView),
  { loading: () => <ViewSkeleton /> },
);

function ViewSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="space-y-6">
        <div className="h-10 w-1/3 rounded-lg bg-muted animate-pulse" />
        <div className="h-6 w-2/3 rounded-lg bg-muted/60 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-3 mt-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { view, fetchMe } = useAppStore();
  const [authOpen, setAuthOpen] = React.useState(false);

  // Restore the user's session on first load
  React.useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 mask-fade-b" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-300/15 blur-3xl animate-blob animation-delay-4000" />
      </div>

      <Header />

      <main className="flex-1">
        {view === "home" && <LandingView onAuthOpen={() => setAuthOpen(true)} />}
        {view === "convert" && <ConverterView />}
        {view === "dashboard" && <DashboardView onAuthOpen={() => setAuthOpen(true)} />}
        {(view === "tools-pdf" || view === "tools-image" || view === "tools-video") && (
          <ToolsView />
        )}
        {view === "pricing" && <PricingView />}
      </main>

      <Footer />

      <CommandPalette onAuthOpen={() => setAuthOpen(true)} />
    </div>
  );
}
