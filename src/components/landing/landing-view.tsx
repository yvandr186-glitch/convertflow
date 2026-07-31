"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Globe,
  Gauge,
  Layers,
  Lock,
  CheckCircle2,
  Star,
  Play,
  Upload,
  Wand2,
  Download,
  Quote,
  Mail,
  Rocket,
  Cpu,
  Clock,
  Files,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppStore } from "@/lib/store";
import {
  CATEGORIES,
  CONVERSIONS,
  PDF_TOOLS,
  IMAGE_TOOLS,
  conversionsByCategory,
} from "@/lib/conversion-catalog";

interface LandingViewProps {
  onAuthOpen: () => void;
}

export function LandingView({ onAuthOpen }: LandingViewProps) {
  const { setView } = useAppStore();

  return (
    <>
      <Hero onAuthOpen={onAuthOpen} />
      <TrustBar />
      <Features />
      <AllTools />
      <HowItWorks />
      <WhyChoose />
      <Stats />
      <Reviews />
      <FAQ />
      <NewsletterCTA />
    </>
  );
}

/* ============================== HERO ============================== */

function Hero({ onAuthOpen }: { onAuthOpen: () => void }) {
  const { setView } = useAppStore();
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={heroRef} className="relative overflow-hidden pt-16 sm:pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div style={{ y, opacity }} className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Plus de 60 formats supportés · 0 fichier perdu
            <span className="h-1 w-1 rounded-full bg-primary/40" />
            <span className="text-emerald-600 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.05]"
          >
            Convertissez, compressez et{" "}
            <span className="gradient-text">optimisez</span> tous vos fichiers
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
          >
            La plateforme premium qui transforme vos images, documents, audios,
            vidéos et plus — en quelques secondes, sans inscription requise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              size="lg"
              className="gradient-brand text-white hover:opacity-90 shadow-glow-lg h-12 px-8 text-base"
              onClick={() => setView("convert")}
            >
              <Upload className="h-5 w-5 mr-2" />
              Convertir un fichier
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base glass"
              onClick={() => setView("dashboard")}
            >
              <Play className="h-4 w-4 mr-2" />
              Voir la démo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Sans inscription
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              100% sécurisé
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Fichiers supprimés après 24h
            </span>
          </motion.div>
        </motion.div>

        {/* Floating preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mt-16 mx-auto max-w-4xl"
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}

function HeroPreview() {
  const { setView } = useAppStore();
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute -inset-4 gradient-brand opacity-20 blur-3xl rounded-3xl" />
      <Card className="relative glass-strong rounded-2xl shadow-glow-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            convertflow.app/convert
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 p-5">
          {/* Drop side */}
          <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl gradient-brand grid place-items-center shadow-glow mb-3">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-medium">hero-banner.png</p>
            <p className="text-xs text-muted-foreground mt-0.5">PNG · 2,3 Mo</p>
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
              <Wand2 className="h-3 w-3" />
              Format détecté automatiquement
            </div>
          </div>
          {/* Result side */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 grid place-items-center shadow-sm mb-3">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-medium">hero-banner.webp</p>
            <p className="text-xs text-muted-foreground mt-0.5">WEBP · 612 Ko</p>
            <Badge className="mt-3 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15">
              -74% de taille
            </Badge>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Conversion en cours…</span>
            <span>820 ms</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
              className="h-full gradient-brand rounded-full"
            />
          </div>
        </div>
      </Card>

      {/* Floating chips */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-1/3 hidden lg:block"
      >
        <div className="glass rounded-xl px-3 py-2 shadow-glow flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium">Chiffré SSL</span>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-6 top-2/3 hidden lg:block"
      >
        <div className="glass rounded-xl px-3 py-2 shadow-glow flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-medium">820 ms</span>
        </div>
      </motion.div>

      <Button
        onClick={() => setView("convert")}
        className="mt-6 mx-auto block gradient-brand text-white hover:opacity-90"
      >
        Essayer maintenant
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

/* ============================== TRUST BAR ============================== */

function TrustBar() {
  const brands = ["TechCrunch", "ProductHunt", "The Verge", "Wired", " Forbes", "Le Monde"];
  return (
    <section className="py-10 border-y border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">
          Approuvé par plus de 12 000 créateurs et équipes
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-12 whitespace-nowrap">
            {[...brands, ...brands].map((b, i) => (
              <span
                key={i}
                className="text-xl sm:text-2xl font-bold text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================== FEATURES ============================== */

const FEATURES = [
  {
    icon: Zap,
    title: "Conversion ultra-rapide",
    desc: "Traitement en moins de 2 secondes pour la plupart des fichiers grâce à notre moteur optimisé.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Shield,
    title: "Sécurité de niveau bancaire",
    desc: "Chiffrement SSL, suppression automatique après 24h et conformité RGPD totale.",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Layers,
    title: "Conversion par lot",
    desc: "Convertissez des dizaines de fichiers en une seule fois. Gain de temps massif.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Cpu,
    title: "Compression intelligente",
    desc: "Notre IA détecte le meilleur niveau de compression pour préserver la qualité.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Globe,
    title: "60+ formats supportés",
    desc: "Images, documents, audio, vidéo, archives, eBooks et formats développeur.",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: Lock,
    title: "Liens temporaires sécurisés",
    desc: "Partagez vos conversions avec un lien expirant et un QR code dédié.",
    color: "from-teal-500 to-cyan-600",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Fonctionnalités"
          title="Tout ce dont vous avez besoin pour convertir"
          subtitle="Une suite complète d'outils pensés pour les professionnels exigeants."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            >
              <Card className="group h-full p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} grid place-items-center shadow-sm mb-4 group-hover:scale-110 transition-transform`}
                >
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== ALL TOOLS ============================== */

function AllTools() {
  const { setView } = useAppStore();
  const groups = conversionsByCategory();

  return (
    <section id="tools" className="py-20 sm:py-28 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Tous les outils"
          title="Un convertisseur pour chaque besoin"
          subtitle="Plus de 60 conversions et 25 outils dédiés, organisés par catégorie."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {groups.map(({ category, conversions }, gi) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: (gi % 2) * 0.1 }}
            >
              <Card className="h-full p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`h-11 w-11 rounded-xl bg-gradient-to-br ${category.color} grid place-items-center shadow-sm`}
                  >
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {conversions.length} conversions
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {conversions.map((c) => (
                    <button
                      key={`${c.from}-${c.to}`}
                      onClick={() => setView("convert")}
                      className="group inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      <span>{c.from}</span>
                      <ArrowRight className="h-2.5 w-2.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-primary">{c.to}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* PDF & Image tools teaser */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Outils PDF avancés
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PDF_TOOLS.slice(0, 9).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setView("tools-pdf")}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                >
                  <t.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Outils Image avancés
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {IMAGE_TOOLS.slice(0, 9).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setView("tools-image")}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                >
                  <t.icon className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ============================== HOW IT WORKS ============================== */

const STEPS = [
  {
    icon: Upload,
    title: "Déposez votre fichier",
    desc: "Glissez-déposez ou sélectionnez votre fichier. Le format est détecté automatiquement.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Wand2,
    title: "Choisissez le format",
    desc: "Sélectionnez le format de sortie parmi nos suggestions intelligentes.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Download,
    title: "Téléchargez le résultat",
    desc: "Récupérez votre fichier converti en quelques secondes, avec QR code inclus.",
    color: "from-emerald-500 to-green-600",
  },
];

function HowItWorks() {
  const { setView } = useAppStore();
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Comment ça marche"
          title="Simple comme 1-2-3"
          subtitle="Aucune compétence technique requise. Convertissez en trois étapes."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-500/30" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative text-center"
            >
              <div className="relative inline-grid">
                <div
                  className={`h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center shadow-glow relative z-10`}
                >
                  <s.icon className="h-10 w-10 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 z-20 h-7 w-7 rounded-full bg-background border-2 border-primary text-primary text-xs font-bold grid place-items-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="gradient-brand text-white hover:opacity-90 shadow-glow"
            onClick={() => setView("convert")}
          >
            Commencer maintenant
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============================== WHY CHOOSE ============================== */

const COMPARISON = [
  { feature: "Conversions illimitées (plan gratuit)", convertflow: true, cloudconvert: false, tinywow: true },
  { feature: "Sans inscription requise", convertflow: true, cloudconvert: false, tinywow: true },
  { feature: "Conversion par lot", convertflow: true, cloudconvert: true, tinywow: false },
  { feature: "Compression intelligente IA", convertflow: true, cloudconvert: false, tinywow: false },
  { feature: "QR Code de téléchargement", convertflow: true, cloudconvert: false, tinywow: false },
  { feature: "Liens temporaires sécurisés", convertflow: true, cloudconvert: false, tinywow: false },
  { feature: "Mode sombre natif", convertflow: true, cloudconvert: false, tinywow: false },
  { feature: "Suppression auto après 24h", convertflow: true, cloudconvert: true, tinywow: false },
  { feature: "Interface premium", convertflow: true, cloudconvert: false, tinywow: false },
];

function WhyChoose() {
  return (
    <section className="py-20 sm:py-28 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Pourquoi ConvertFlow"
          title="Le choix des professionnels"
          subtitle="Comparé aux solutions existantes, ConvertFlow va plus loin sur l'essentiel."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <Card className="overflow-hidden">
            <div className="grid grid-cols-3 sm:grid-cols-4 bg-muted/40 px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold">
              <div>Fonctionnalité</div>
              <div className="text-center text-primary">ConvertFlow</div>
              <div className="text-center text-muted-foreground">CloudConvert</div>
              <div className="text-center text-muted-foreground hidden sm:block">TinyWow</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 sm:grid-cols-4 items-center px-4 sm:px-6 py-3 text-sm border-t border-border/40 ${
                  i % 2 ? "bg-muted/20" : ""
                }`}
              >
                <div className="font-medium pr-2">{row.feature}</div>
                <div className="text-center">
                  {row.convertflow ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </div>
                <div className="text-center">
                  {row.cloudconvert ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </div>
                <div className="text-center hidden sm:block">
                  {row.tinywow ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== STATS ============================== */

function Stats() {
  const stats = [
    { value: "2,4 M+", label: "Fichiers convertis", icon: Files },
    { value: "12 840", label: "Utilisateurs actifs", icon: Users },
    { value: "60+", label: "Formats supportés", icon: Layers },
    { value: "1,8 s", label: "Temps moyen", icon: Clock },
  ];
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="inline-grid h-14 w-14 rounded-2xl gradient-brand-soft grid place-items-center mb-3">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== REVIEWS ============================== */

const REVIEWS = [
  {
    name: "Marie Dubois",
    role: "Designer freelance",
    avatar: "MD",
    color: "from-blue-500 to-indigo-600",
    rating: 5,
    text: "ConvertFlow a remplacé 4 outils différents dans mon workflow. La compression intelligente est bluffante, mes images WebP sont 70% plus légères sans perte visible.",
  },
  {
    name: "Lucas Petit",
    role: "Développeur full-stack",
    avatar: "LP",
    color: "from-emerald-500 to-green-600",
    rating: 5,
    text: "Les outils développeur (JSON→YAML, CSV→SQL) me font gagner un temps fou. L'API est propre, rapide et le QR code pour partager les conversions est génial.",
  },
  {
    name: "Sofia Martinez",
    role: "Responsable marketing",
    avatar: "SM",
    color: "from-violet-500 to-purple-600",
    rating: 5,
    text: "Enfin une interface qui ne ressemble pas à 1995. Le mode sombre est magnifique et la conversion par lot m'a fait économiser des heures chaque semaine.",
  },
  {
    name: "Thomas Laurent",
    role: "Podcasteur",
    avatar: "TL",
    color: "from-amber-500 to-orange-600",
    rating: 5,
    text: "Je convertis mes WAV en MP3 chaque semaine. ConvertFlow est 3x plus rapide que ce que j'utilisais avant, et le tout gratuitement.",
  },
  {
    name: "Emma Rousseau",
    role: "Photographe",
    avatar: "ER",
    color: "from-rose-500 to-red-600",
    rating: 5,
    text: "La conversion HEIC vers JPG fonctionne parfaitement, et la suppression d'arrière-plan est impressionnante. Un vrai couteau suisse pour mes photos.",
  },
  {
    name: "Karim Benali",
    role: "CTO startup",
    avatar: "KB",
    color: "from-teal-500 to-cyan-600",
    rating: 5,
    text: "Nous avons intégré ConvertFlow à notre process interne. La sécurité (RGPD, suppression auto) rassure notre DPO. Hautement recommandé.",
  },
];

function Reviews() {
  return (
    <section className="py-20 sm:py-28 bg-muted/20 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Avis utilisateurs"
          title="Ils ont adopté ConvertFlow"
          subtitle="Une note moyenne de 4,9/5 basée sur plus de 2 800 avis vérifiés."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            >
              <Card className="h-full p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <Quote className="h-7 w-7 text-primary/30 mb-3" />
                <p className="text-sm leading-relaxed text-foreground/90">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${r.color} grid place-items-center text-white text-xs font-semibold`}
                  >
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== FAQ ============================== */

const FAQ_ITEMS = [
  {
    q: "ConvertFlow est-il vraiment gratuit ?",
    a: "Oui. Le plan gratuit offre des conversions illimitées pour la plupart des formats. Les plans Pro et Business ajoutent des fonctionnalités avancées comme la conversion par lot en masse, le stockage cloud et l'API.",
  },
  {
    q: "Mes fichiers sont-ils en sécurité ?",
    a: "Absolument. Tous les transferts sont chiffrés en SSL. Vos fichiers sont supprimés automatiquement de nos serveurs 24h après la conversion. Nous sommes conformes au RGPD.",
  },
  {
    q: "Quels formats sont supportés ?",
    a: "Plus de 60 formats : images (PNG, JPG, WebP, AVIF, HEIC, SVG...), documents (PDF, DOCX, TXT, HTML, Markdown...), audio, vidéo, archives, eBooks et formats développeur (JSON, YAML, XML, CSV, SQL).",
  },
  {
    q: "Puis-je convertir plusieurs fichiers à la fois ?",
    a: "Oui, la conversion par lot est supportée. Déposez plusieurs fichiers simultanément, choisissez le format de sortie, et lancez la conversion en un clic.",
  },
  {
    q: "Existe-t-il une API ?",
    a: "Oui, avec les plans Business. Notre API REST est compatible avec les standards CloudConvert, LibreConvert et ConvertAPI, ce qui facilite la migration.",
  },
  {
    q: "Le mode sombre est-il disponible ?",
    a: "Oui, ConvertFlow propose un mode clair et un mode sombre premium, avec bascule automatique selon vos préférences système.",
  },
];

function FAQ() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="FAQ"
          title="Questions fréquentes"
          subtitle="Tout ce que vous devez savoir sur ConvertFlow."
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-xl mb-3 px-4 overflow-hidden bg-card"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== NEWSLETTER CTA ============================== */

function NewsletterCTA() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const { pushNotification } = useAppStore();

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        pushNotification({
          title: "Inscription newsletter",
          message: data.message,
          type: "success",
        });
      }
    } catch {
      setDone(true);
    }
    setLoading(false);
  }

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl gradient-brand p-8 sm:p-14 text-center text-white shadow-glow-lg"
        >
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <div className="inline-grid h-14 w-14 rounded-2xl bg-white/15 backdrop-blur place-items-center mb-5">
              <Rocket className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              Prêt à convertir plus vite que jamais ?
            </h2>
            <p className="mt-4 text-white/90 max-w-xl mx-auto text-balance">
              Rejoignez 12 840 professionnels. Recevez nos conseils
              d&apos;optimisation et soyez informé des nouveautés en avant-première.
            </p>

            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur px-5 py-3"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">
                  Merci ! Vous êtes bien inscrit.
                </span>
              </motion.div>
            ) : (
              <form
                onSubmit={subscribe}
                className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
              >
                <div className="relative flex-1 w-full">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 h-12 bg-white/15 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/40"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="h-12 px-6 bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                >
                  {loading ? "Inscription…" : "S'inscrire"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            )}
            <p className="mt-4 text-xs text-white/70">
              Pas de spam. Désinscription en un clic.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== SHARED ============================== */

function SectionHeading({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl mx-auto"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
        <Sparkles className="h-3 w-3" />
        {badge}
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground text-lg text-balance">{subtitle}</p>
    </motion.div>
  );
}
