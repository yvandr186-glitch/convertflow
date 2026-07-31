"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  HardDrive,
  Files,
  Timer,
  TrendingUp,
  Clock,
  Star,
  Activity,
  Sparkles,
  Download,
  ChevronRight,
  LogIn,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore, getDemoHistory } from "@/lib/store";
import {
  formatBytes,
  formatDuration,
  formatRelativeTime,
  compressionRatio,
} from "@/lib/format";
import { CATEGORIES } from "@/lib/conversion-catalog";
import type { ConversionRecord } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  image: "#2563eb",
  document: "#e11d48",
  audio: "#7c3aed",
  video: "#ea580c",
  archive: "#059669",
  ebook: "#0d9488",
  developer: "#c026d3",
};

const ACTIVITY = [
  { user: "Marie D.", action: "a converti", file: "presentation.pdf", time: "il y a 2 min", color: "from-blue-500 to-indigo-600" },
  { user: "Lucas P.", action: "a compressé", file: "photo.jpg", time: "il y a 5 min", color: "from-emerald-500 to-green-600" },
  { user: "Sofia M.", action: "a fusionné", file: "3 PDFs", time: "il y a 8 min", color: "from-violet-500 to-purple-600" },
  { user: "Thomas L.", action: "a converti", file: "podcast.wav", time: "il y a 12 min", color: "from-amber-500 to-orange-600" },
  { user: "Emma R.", action: "a optimisé", file: "banner.png", time: "il y a 18 min", color: "from-rose-500 to-red-600" },
];

interface DashboardData {
  conversions: ConversionRecord[];
  stats: {
    totalConversions: number;
    storageSaved: number;
    filesConverted: number;
    avgDurationMs: number;
  };
  daily: { date: string; count: number; label: string }[];
  categoryBreakdown: { category: string; count: number; fill: string }[];
  topFormats: { format: string; count: number }[];
}

export function DashboardView({ onAuthOpen }: { onAuthOpen: () => void }) {
  const { user, authLoading, setView } = useAppStore();
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch the logged-in user's personal dashboard data
  const loadDashboard = React.useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (json.ok) {
        setData({
          conversions: json.conversions,
          stats: json.stats,
          daily: json.daily,
          categoryBreakdown: json.categoryBreakdown,
          topFormats: json.topFormats,
        });
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [user]);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Loading state while we check the session
  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
        <p className="text-muted-foreground">Chargement de votre tableau de bord…</p>
      </div>
    );
  }

  // Not logged in → show demo + CTA
  if (!user) {
    return <DemoDashboard onAuthOpen={onAuthOpen} />;
  }

  return (
    <PersonalDashboard
      user={user}
      data={data}
      loading={loading}
      onRefresh={loadDashboard}
      onGoConvert={() => setView("convert")}
    />
  );
}

/* =================== Personal dashboard (logged in) =================== */

function PersonalDashboard({
  user,
  data,
  loading,
  onRefresh,
  onGoConvert,
}: {
  user: { name: string | null; email: string; plan: string };
  data: DashboardData | null;
  loading: boolean;
  onRefresh: () => void;
  onGoConvert: () => void;
}) {
  const { setView } = useAppStore();

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
        <p className="text-muted-foreground">Récupération de vos conversions…</p>
      </div>
    );
  }

  const { conversions, stats, daily, categoryBreakdown, topFormats } = data;
  const isEmpty = conversions.length === 0;

  const statCards = [
    {
      label: "Mes conversions",
      value: String(stats.totalConversions),
      icon: Zap,
      color: "from-blue-500 to-indigo-600",
      delta: stats.totalConversions > 0 ? "+100%" : "—",
      hint: "total personnel",
    },
    {
      label: "Stockage économisé",
      value: formatBytes(stats.storageSaved),
      icon: HardDrive,
      color: "from-emerald-500 to-green-600",
      delta: stats.storageSaved > 0 ? "optimisé" : "—",
      hint: "grâce à ConvertFlow",
    },
    {
      label: "Fichiers traités",
      value: String(stats.filesConverted),
      icon: Files,
      color: "from-violet-500 to-purple-600",
      delta: stats.filesConverted > 0 ? "réussis" : "—",
      hint: "avec succès",
    },
    {
      label: "Temps moyen",
      value: stats.avgDurationMs > 0 ? formatDuration(stats.avgDurationMs) : "—",
      icon: Timer,
      color: "from-amber-500 to-orange-600",
      delta: stats.avgDurationMs > 0 ? "rapide" : "—",
      hint: "par conversion",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Bonjour, {user.name ?? user.email} 👋
            </h1>
            <Badge className="gradient-brand text-white">
              {user.plan === "free" ? "Gratuit" : user.plan === "pro" ? "Pro" : "Business"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Votre dashboard personnel — données privées et sécurisées.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <Sparkles className="h-4 w-4 mr-1.5" />
            Actualiser
          </Button>
          <Button
            size="sm"
            className="gradient-brand text-white hover:opacity-90"
            onClick={onGoConvert}
          >
            <Zap className="h-4 w-4 mr-1.5" />
            Nouvelle conversion
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {isEmpty ? (
        <Card className="p-12 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl gradient-brand-soft grid place-items-center mb-4">
            <Files className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Aucune conversion pour l&apos;instant</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Lancez votre première conversion : elle apparaîtra ici avec toutes
            vos statistiques personnelles.
          </p>
          <Button
            className="mt-6 gradient-brand text-white hover:opacity-90"
            onClick={onGoConvert}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Convertir mon premier fichier
          </Button>
        </Card>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
              >
                <Card className="relative overflow-hidden p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div
                      className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center shadow-sm`}
                    >
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <TrendingUp className="h-3 w-3" />
                      {s.delta}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">{s.hint}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid gap-4 lg:grid-cols-3 mb-8">
            <Card className="lg:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Votre activité (7 jours)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Nombre de conversions par jour
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Personnel
                </Badge>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={daily} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.12)" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} stroke="currentColor" className="text-muted-foreground" />
                    <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="currentColor" className="text-muted-foreground" width={32} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 8px 24px -8px rgba(0,0,0,0.15)", fontSize: 12 }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} fill="url(#convGrad)" dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#1d4ed8" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold flex items-center gap-2 mb-1">
                <Files className="h-4 w-4 text-primary" />
                Répartition
              </h2>
              <p className="text-xs text-muted-foreground mb-2">Vos catégories</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryBreakdown} dataKey="count" nameKey="category" cx="50%" cy="50%" innerRadius={42} outerRadius={64} paddingAngle={3}>
                      {categoryBreakdown.map((entry) => (
                        <Cell key={entry.category} fill={entry.fill} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {categoryBreakdown.map((c) => {
                  const cat = CATEGORIES.find((x) => x.id === c.category);
                  return (
                    <div key={c.category} className="flex items-center gap-1.5 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.fill }} />
                      <span className="text-muted-foreground truncate">{cat?.label ?? c.category}</span>
                      <span className="ml-auto font-medium">{c.count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* History + side panels */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Mes conversions récentes
                </h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setView("convert")}>
                  Nouvelle
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {conversions.slice(0, 12).map((c) => {
                  const cat = CATEGORIES.find((x) => x.id === c.category);
                  return (
                    <div key={c.id} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${cat?.color ?? "from-blue-500 to-indigo-600"} grid place-items-center shrink-0`}>
                        {cat && <cat.icon className="h-4 w-4 text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{c.originalName}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.fromFormat} → {c.toFormat} · {formatRelativeTime(c.createdAt)}
                        </p>
                      </div>
                      {c.resultSize && (
                        <div className="text-right shrink-0">
                          <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10">
                            -{compressionRatio(c.originalSize, c.resultSize)}%
                          </Badge>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{formatBytes(c.resultSize)}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <h2 className="font-semibold flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-primary" />
                  Mes formats favoris
                </h2>
                <div className="space-y-2">
                  {topFormats.length > 0 ? (
                    topFormats.map((f, i) => (
                      <div key={f.format} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                        <span className="text-sm font-medium flex-1">{f.format}</span>
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div className="h-full gradient-brand rounded-full" style={{ width: `${(f.count / topFormats[0].count) * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-6 text-right">{f.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun favori encore.</p>
                  )}
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="font-semibold flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-primary" />
                  Activité globale
                </h2>
                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className={`bg-gradient-to-br ${a.color} text-white text-[10px] font-semibold`}>
                          {a.user.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-snug">
                          <span className="font-medium">{a.user}</span>{" "}
                          <span className="text-muted-foreground">{a.action}</span>{" "}
                          <span className="font-medium">{a.file}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Volume bar chart */}
          <Card className="p-5 mt-4">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              Volume par catégorie
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown.map((c) => ({ name: CATEGORIES.find((x) => x.id === c.category)?.label ?? c.category, value: c.count, fill: c.fill }))} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.12)" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} className="text-muted-foreground" />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} className="text-muted-foreground" width={32} allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(37,99,235,0.06)" }} contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

/* ============== Demo dashboard (not logged in — preview + CTA) ============== */

function DemoDashboard({ onAuthOpen }: { onAuthOpen: () => void }) {
  const { setView } = useAppStore();
  const demo = React.useMemo(() => getDemoHistory(), []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* CTA banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-2xl gradient-brand p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow"
      >
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur grid place-items-center shrink-0">
            <LogIn className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-lg">Ceci est un aperçu démo</p>
            <p className="text-white/85 text-sm">
              Créez votre compte gratuit pour avoir votre dashboard personnel avec
              vos vraies conversions, statistiques et historique.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          className="bg-white text-primary hover:bg-white/90 shrink-0"
          onClick={onAuthOpen}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Créer mon compte
        </Button>
      </motion.div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Aperçu du tableau de bord
          </h1>
          <p className="text-muted-foreground text-sm">
            Voici à quoi ressemblera votre espace personnel.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setView("convert")}>
          <Zap className="h-4 w-4 mr-1.5" />
          Essayer le convertisseur
        </Button>
      </div>

      {/* Demo stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { label: "Conversions totales", value: "1 284", icon: Zap, color: "from-blue-500 to-indigo-600", delta: "+12,4%" },
          { label: "Stockage économisé", value: "482 Mo", icon: HardDrive, color: "from-emerald-500 to-green-600", delta: "+8,2%" },
          { label: "Fichiers traités", value: "327", icon: Files, color: "from-violet-500 to-purple-600", delta: "+24" },
          { label: "Temps moyen", value: "1,8 s", icon: Timer, color: "from-amber-500 to-orange-600", delta: "-0,3 s" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}>
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center shadow-sm`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {s.delta}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Demo history */}
      <Card className="p-5">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          Historique (démo)
        </h2>
        <div className="space-y-1">
          {demo.map((c) => {
            const cat = CATEGORIES.find((x) => x.id === c.category);
            return (
              <div key={c.id} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${cat?.color ?? "from-blue-500 to-indigo-600"} grid place-items-center shrink-0`}>
                  {cat && <cat.icon className="h-4 w-4 text-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{c.originalName}</p>
                  <p className="text-xs text-muted-foreground">{c.fromFormat} → {c.toFormat} · {formatRelativeTime(c.createdAt)}</p>
                </div>
                {c.resultSize && (
                  <Badge variant="secondary" className="text-emerald-600 bg-emerald-500/10">
                    -{compressionRatio(c.originalSize, c.resultSize)}%
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-border/60 text-center">
          <Button className="gradient-brand text-white hover:opacity-90" onClick={onAuthOpen}>
            <Sparkles className="h-4 w-4 mr-2" />
            Créer mon compte pour mon dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
