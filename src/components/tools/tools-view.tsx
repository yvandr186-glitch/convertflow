"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  Download,
  Settings2,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Video,
  Sparkles,
  Gauge,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { PDF_TOOLS, IMAGE_TOOLS, VIDEO_TOOLS, type ToolDef } from "@/lib/conversion-catalog";
import { toast } from "sonner";

type ToolKind = "pdf" | "image" | "video";

export function ToolsView() {
  const { view } = useAppStore();
  const kind: ToolKind =
    view === "tools-image" ? "image" : view === "tools-video" ? "video" : "pdf";
  const tools =
    kind === "image" ? IMAGE_TOOLS : kind === "video" ? VIDEO_TOOLS : PDF_TOOLS;

  const [selected, setSelected] = React.useState<ToolDef | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <ToolDetail tool={selected} onBack={() => setSelected(null)} kind={kind} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
                {kind === "pdf" && <FileText className="h-3.5 w-3.5" />}
                {kind === "image" && <ImageIcon className="h-3.5 w-3.5" />}
                {kind === "video" && <Video className="h-3.5 w-3.5" />}
                {tools.length} outils disponibles
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {kind === "pdf" && "Outils PDF avancés"}
                {kind === "image" && "Outils Image avancés"}
                {kind === "video" && "Outils Vidéo avancés"}
              </h1>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                {kind === "pdf" &&
                  "Fusionnez, divisez, compressez, protégez et transformez vos PDF avec une précision professionnelle."}
                {kind === "image" &&
                  "Optimisez, redimensionnez, rognez et convertissez vos images avec une qualité préservée."}
                {kind === "video" &&
                  "Compressez, extrayez l'audio, créez des GIFs et capturez vos vidéos en quelques clics."}
              </p>
            </div>

            {/* Tools grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (i % 6) * 0.05 }}
                >
                  <Card
                    className="group h-full p-5 cursor-pointer hover:shadow-glow hover:-translate-y-0.5 transition-all"
                    onClick={() => setSelected(tool)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-11 w-11 rounded-xl bg-gradient-to-br ${tool.color} grid place-items-center shadow-sm group-hover:scale-110 transition-transform`}
                      >
                        <tool.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{tool.label}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolDetail({
  tool,
  onBack,
  kind,
}: {
  tool: ToolDef;
  onBack: () => void;
  kind: ToolKind;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [quality, setQuality] = React.useState(75);
  const [keepOriginal, setKeepOriginal] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setFile(f);
    setDone(false);
  }

  async function process() {
    if (!file) return;
    setProcessing(true);
    // Simulated processing with realistic timing
    const delay = 1200 + Math.random() * 2000;
    await new Promise((r) => setTimeout(r, delay));
    setProcessing(false);
    setDone(true);
    toast.success(`${tool.label} terminé`, {
      description: `${file.name} traité avec succès.`,
    });
  }

  function reset() {
    setFile(null);
    setDone(false);
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Retour aux outils
      </Button>

      <Card className="overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-br ${tool.color} p-6 sm:p-8 text-white`}>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center">
              <tool.icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{tool.label}</h1>
              <p className="text-white/85 text-sm">{tool.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {!file ? (
            /* Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-10 text-center ${
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/40 hover:bg-accent/30"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                accept={kind === "image" ? "image/*" : kind === "video" ? "video/*" : ".pdf"}
              />
              <div className="mx-auto h-14 w-14 rounded-2xl gradient-brand grid place-items-center shadow-glow mb-3">
                <UploadCloud className="h-6 w-6 text-white" />
              </div>
              <p className="font-medium">Déposez votre fichier ici</p>
              <p className="text-sm text-muted-foreground mt-1">
                ou cliquez pour parcourir
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File info */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/30">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${tool.color} grid place-items-center shrink-0`}
                >
                  {processing ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : done ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : (
                    <tool.icon className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} Ko
                    {done && " · traité avec succès"}
                  </p>
                </div>
                {!processing && !done && (
                  <Button variant="ghost" size="icon" onClick={reset}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Options */}
              {!done && !processing && (
                <div className="grid sm:grid-cols-2 gap-5 p-4 rounded-xl border border-border bg-card">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5" />
                        Niveau de qualité
                      </Label>
                      <span className="text-sm font-medium text-primary">
                        {quality}%
                      </span>
                    </div>
                    <Slider
                      value={[quality]}
                      onValueChange={(v) => setQuality(v[0])}
                      min={10}
                      max={100}
                      step={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Plus bas = plus de compression
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-1.5">
                        <Sliders className="h-3.5 w-3.5" />
                        Préserver l&apos;original
                      </Label>
                      <Switch
                        checked={keepOriginal}
                        onCheckedChange={setKeepOriginal}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Conserve une copie du fichier source
                    </p>
                    <div className="pt-1">
                      <Badge variant="secondary" className="gap-1">
                        <Settings2 className="h-3 w-3" />
                        Compression intelligente
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Action */}
              {!done && (
                <Button
                  className="w-full gradient-brand text-white hover:opacity-90"
                  size="lg"
                  disabled={processing}
                  onClick={process}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {tool.label}
                    </>
                  )}
                </Button>
              )}

              {/* Result */}
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold">Traitement terminé !</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Votre fichier est prêt à être téléchargé.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="flex-1 gradient-brand text-white hover:opacity-90"
                      onClick={() =>
                        toast.success("Téléchargement démarré", {
                          description: file.name,
                        })
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le résultat
                    </Button>
                    <Button variant="outline" onClick={reset}>
                      Nouveau fichier
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Info footer */}
          <div className="mt-6 pt-6 border-t border-border/60 grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Sécurité</p>
              <p className="text-muted-foreground text-xs">
                Chiffré SSL · Suppression auto 24h
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Performance</p>
              <p className="text-muted-foreground text-xs">
                Traitement moyen &lt; 3 secondes
              </p>
            </div>
            <div>
              <p className="font-medium mb-1">Qualité</p>
              <p className="text-muted-foreground text-xs">
                Compression intelligente IA
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
