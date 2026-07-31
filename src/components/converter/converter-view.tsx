"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  File as FileIcon,
  X,
  Loader2,
  CheckCircle2,
  Download,
  QrCode,
  Sparkles,
  ArrowRight,
  Trash2,
  Clock,
  Zap,
  Image as ImageIcon,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import {
  detectFormat,
  targetsForFormat,
  suggestTarget,
  CONVERSIONS,
  CATEGORIES,
  categoryOfFormat,
} from "@/lib/conversion-catalog";
import { formatBytes, formatDuration, compressionRatio, formatRelativeTime } from "@/lib/format";
import { toast } from "sonner";
import type { ConvertResult, ConversionRecord } from "@/types";

interface Job {
  id: string;
  file: File;
  fromFormat: string;
  toFormat: string;
  category: string;
  status: "queued" | "processing" | "done" | "error";
  progress: number;
  result?: ConvertResult;
  error?: string;
  startedAt?: number;
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function ConverterView() {
  const { addConversion, history, removeConversion } = useAppStore();
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    const newJobs: Job[] = [];
    for (const file of arr) {
      const fmt = detectFormat(file.name);
      if (!fmt) {
        toast.error(`Format non supporté: ${file.name}`, {
          description: "Vérifiez l'extension du fichier.",
        });
        continue;
      }
      const targets = targetsForFormat(fmt);
      if (targets.length === 0) {
        toast.error(`Aucune conversion disponible pour ${fmt}`, {
          description: "Ce format source n'est pas pris en charge.",
        });
        continue;
      }
      const suggested = suggestTarget(fmt) ?? targets[0].to;
      const category = categoryOfFormat(fmt) ?? "image";
      newJobs.push({
        id: uid(),
        file,
        fromFormat: fmt,
        toFormat: suggested,
        category,
        status: "queued",
        progress: 0,
      });
    }
    if (newJobs.length > 0) {
      setJobs((prev) => [...newJobs, ...prev]);
      toast.success(`${newJobs.length} fichier(s) prêt(s) à convertir`, {
        description: "Format détecté automatiquement.",
      });
    }
  }

  async function runJob(job: Job) {
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "processing", progress: 10, startedAt: Date.now() } : j)),
    );

    // Animate progress while waiting
    const progressTimer = setInterval(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id && j.status === "processing" && j.progress < 90
            ? { ...j, progress: Math.min(90, j.progress + Math.random() * 12) }
            : j,
        ),
      );
    }, 250);

    try {
      const formData = new FormData();
      formData.append("file", job.file);
      formData.append("fromFormat", job.fromFormat);
      formData.append("toFormat", job.toFormat);

      const res = await fetch("/api/convert", { method: "POST", body: formData });
      const data: ConvertResult = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Échec de la conversion");
      }

      clearInterval(progressTimer);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? { ...j, status: "done", progress: 100, result: data }
            : j,
        ),
      );

      const record: ConversionRecord = {
        id: data.id,
        category: job.category,
        fromFormat: job.fromFormat,
        toFormat: job.toFormat,
        originalName: job.file.name,
        originalSize: data.originalSize,
        resultSize: data.outputSize,
        status: "completed",
        resultUrl: data.downloadUrl,
        durationMs: data.durationMs,
        createdAt: new Date().toISOString(),
      };
      addConversion(record);

      const ratio = compressionRatio(data.originalSize, data.outputSize);
      toast.success("Conversion terminée", {
        description:
          ratio > 0
            ? `${job.fromFormat} → ${job.toFormat} · -${ratio}% (${formatDuration(data.durationMs)})`
            : `${job.fromFormat} → ${job.toFormat} · ${formatDuration(data.durationMs)}`,
      });

      // Persist to DB (best effort)
      fetch("/api/conversions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch(() => {});
    } catch (err) {
      clearInterval(progressTimer);
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: "error", error: message } : j)),
      );
      toast.error("Échec de la conversion", { description: message });
    }
  }

  function updateTarget(jobId: string, target: string) {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, toFormat: target } : j)),
    );
  }

  function removeJob(id: string) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  function downloadResult(job: Job) {
    if (!job.result) return;
    const a = document.createElement("a");
    a.href = job.result.outputUrl;
    a.download = job.result.outputName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Téléchargement démarré", {
      description: job.result.outputName,
    });
  }

  const queuedCount = jobs.filter((j) => j.status === "queued").length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4"
        >
          <Zap className="h-3.5 w-3.5" />
          Moteur de conversion intelligent
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance"
        >
          Convertissez vos fichiers en{" "}
          <span className="gradient-text">quelques secondes</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="mt-4 text-muted-foreground max-w-2xl mx-auto text-balance"
        >
          Glissez-déposez vos fichiers, nous détectons automatiquement le format
          et suggérons la meilleure conversion. Traitement par lot inclus.
        </motion.p>
      </div>

      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ${
          dragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-accent/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          accept="image/*,video/*,audio/*,.pdf,.docx,.txt,.html,.md,.pptx,.xlsx,.odt,.rtf,.zip,.rar,.7z,.tar,.gz,.epub,.mobi,.azw3,.json,.yaml,.yml,.xml,.csv,.sql"
        />
        <div className="px-6 py-14 text-center">
          <motion.div
            animate={dragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
            className="mx-auto h-16 w-16 rounded-2xl gradient-brand grid place-items-center shadow-glow mb-4"
          >
            <UploadCloud className="h-8 w-8 text-white" />
          </motion.div>
          <p className="text-lg font-semibold">
            Glissez vos fichiers ici
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            ou <span className="text-primary font-medium">parcourez</span> votre
            appareil — traitement par lot supporté
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 5).map((c) => (
              <Badge key={c.id} variant="secondary" className="gap-1.5">
                <c.icon className="h-3 w-3" />
                {c.label}
              </Badge>
            ))}
            <Badge variant="secondary">+30 formats</Badge>
          </div>
        </div>
      </motion.div>

      {/* Jobs queue */}
      {jobs.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              File de conversion
              {queuedCount > 0 && (
                <Badge variant="secondary">{queuedCount} en attente</Badge>
              )}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setJobs([])}
              className="text-muted-foreground"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Tout effacer
            </Button>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onTargetChange={updateTarget}
                  onRun={runJob}
                  onRemove={removeJob}
                  onDownload={downloadResult}
                />
              ))}
            </AnimatePresence>
          </div>

          {queuedCount > 0 && (
            <Button
              className="w-full gradient-brand text-white hover:opacity-90"
              size="lg"
              onClick={() => jobs.filter((j) => j.status === "queued").forEach(runJob)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Lancer {queuedCount} conversion{queuedCount > 1 ? "s" : ""}
            </Button>
          )}
        </div>
      )}

      {/* Recent history */}
      {history.length > 0 && jobs.length === 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Conversions récentes
            </h2>
          </div>
          <Card className="overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {history.slice(0, 8).map((c) => {
                const cat = CATEGORIES.find((x) => x.id === c.category);
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 px-4 py-3 border-b border-border/40 last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <div
                      className={`h-10 w-10 rounded-lg bg-gradient-to-br ${cat?.color ?? "from-blue-500 to-indigo-600"} grid place-items-center shrink-0`}
                    >
                      {cat && <cat.icon className="h-4 w-4 text-white" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {c.originalName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.fromFormat} → {c.toFormat} ·{" "}
                        {formatBytes(c.originalSize)}
                        {c.resultSize
                          ? ` → ${formatBytes(c.resultSize)}`
                          : ""}{" "}
                        · {formatRelativeTime(c.createdAt)}
                      </p>
                    </div>
                    {c.resultSize && (
                      <Badge
                        variant="secondary"
                        className="text-emerald-600 bg-emerald-500/10"
                      >
                        -{compressionRatio(c.originalSize, c.resultSize)}%
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                      onClick={() => removeConversion(c.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Quick conversions */}
      {jobs.length === 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              Conversions populaires
            </h2>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CONVERSIONS.filter(
              (c) => categoryFilter === "all" || c.category === categoryFilter,
            )
              .slice(0, 18)
              .map((conv) => {
                const cat = CATEGORIES.find((x) => x.id === conv.category)!;
                return (
                  <button
                    key={`${conv.from}-${conv.to}`}
                    onClick={() => inputRef.current?.click()}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <div
                      className={`h-8 w-8 rounded-lg bg-gradient-to-br ${cat.color} grid place-items-center shrink-0`}
                    >
                      <cat.icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <span>{conv.from}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      <span className="text-primary">{conv.to}</span>
                    </div>
                    {conv.engine === "sharp" && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-[10px] py-0 h-5 bg-emerald-500/10 text-emerald-600"
                      >
                        Live
                      </Badge>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function JobCard({
  job,
  onTargetChange,
  onRun,
  onRemove,
  onDownload,
}: {
  job: Job;
  onTargetChange: (id: string, target: string) => void;
  onRun: (job: Job) => void;
  onRemove: (id: string) => void;
  onDownload: (job: Job) => void;
}) {
  const targets = targetsForFormat(job.fromFormat);
  const cat = CATEGORIES.find((x) => x.id === job.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
    >
      <Card className="overflow-hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-4">
            {/* Icon / preview */}
            <div
              className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat?.color ?? "from-blue-500 to-indigo-600"} grid place-items-center shrink-0 shadow-sm`}
            >
              {job.status === "done" ? (
                <CheckCircle2 className="h-5 w-5 text-white" />
              ) : job.status === "processing" ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : job.status === "error" ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                cat && <cat.icon className="h-5 w-5 text-white" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{job.file.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {job.fromFormat} · {formatBytes(job.file.size)}
                    {job.result && job.result.outputSize
                      ? ` → ${formatBytes(job.result.outputSize)}`
                      : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 -mt-1 -mr-1 text-muted-foreground hover:text-rose-500 shrink-0"
                  onClick={() => onRemove(job.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Format selector + action */}
              {job.status === "queued" && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Badge variant="outline">{job.fromFormat}</Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <Select
                    value={job.toFormat}
                    onValueChange={(v) => onTargetChange(job.id, v)}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targets.map((t) => (
                        <SelectItem key={t.to} value={t.to}>
                          {t.to}
                          {t.engine === "sharp" && (
                            <span className="ml-2 text-[10px] text-emerald-600">
                              live
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="gradient-brand text-white hover:opacity-90"
                    onClick={() => onRun(job)}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Convertir
                  </Button>
                </div>
              )}

              {/* Progress */}
              {job.status === "processing" && (
                <div className="mt-3 space-y-1.5">
                  <Progress value={job.progress} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">
                    Conversion en cours… {Math.round(job.progress)}%
                  </p>
                </div>
              )}

              {/* Result */}
              {job.status === "done" && job.result && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    className="gradient-brand text-white hover:opacity-90"
                    onClick={() => onDownload(job)}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Télécharger
                  </Button>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-600"
                  >
                    -{compressionRatio(job.result.originalSize, job.result.outputSize)}%
                    · {formatDuration(job.result.durationMs)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Expire {formatRelativeTime(job.result.expiresAt)}
                  </span>
                </div>
              )}

              {job.status === "error" && (
                <p className="mt-2 text-xs text-rose-500">{job.error}</p>
              )}
            </div>

            {/* QR code */}
            {job.status === "done" && job.result?.qrCode && (
              <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
                <div className="rounded-lg border border-border p-1.5 bg-white">
                  <img
                    src={job.result.qrCode}
                    alt="QR code de téléchargement"
                    className="h-20 w-20"
                  />
                </div>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <QrCode className="h-3 w-3" />
                  Scan pour télécharger
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
