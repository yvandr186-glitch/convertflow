"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Gratuit",
    icon: Sparkles,
    price: "0",
    period: "/mois",
    description: "Pour démarrer et les usages occasionnels",
    color: "from-slate-500 to-slate-600",
    cta: "Commencer gratuitement",
    highlighted: false,
    features: [
      "Conversions illimitées",
      "60+ formats supportés",
      "Taille max 25 Mo / fichier",
      "Conversion par lot (5 fichiers)",
      "Suppression auto après 24h",
      "Mode sombre",
    ],
  },
  {
    name: "Pro",
    icon: Zap,
    price: "9",
    period: "/mois",
    description: "Pour les créateurs et freelances",
    color: "from-blue-500 to-indigo-600",
    cta: "Essai 14 jours",
    highlighted: true,
    features: [
      "Tout du plan Gratuit, plus :",
      "Taille max 2 Go / fichier",
      "Conversion par lot illimitée",
      "Compression intelligente IA",
      "QR codes de téléchargement",
      "Liens temporaires sécurisés",
      "Historique étendu (1 an)",
      "Support prioritaire",
    ],
  },
  {
    name: "Business",
    icon: Building2,
    price: "49",
    period: "/mois",
    description: "Pour les équipes et entreprises",
    color: "from-violet-500 to-purple-600",
    cta: "Contacter les ventes",
    highlighted: false,
    features: [
      "Tout du plan Pro, plus :",
      "Taille max 10 Go / fichier",
      "API REST complète",
      "5 utilisateurs inclus",
      "Stockage cloud 500 Go",
      "Webhooks & intégrations",
      "SSO & SAML",
      "SLA 99,9% & support dédié",
    ],
  },
];

export function PricingView() {
  const { setView, user } = useAppStore();
  const [annual, setAnnual] = React.useState(true);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
          <Crown className="h-3 w-3" />
          Tarifs
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
          Un prix juste pour{" "}
          <span className="gradient-text">chaque besoin</span>
        </h1>
        <p className="mt-4 text-muted-foreground text-lg text-balance">
          Commencez gratuitement, passez à la vitesse supérieure quand vous voulez.
          Sans engagement.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !annual ? "gradient-brand text-white" : "text-muted-foreground"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              annual ? "gradient-brand text-white" : "text-muted-foreground"
            }`}
          >
            Annuel
            <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 text-[10px] py-0 h-4">
              -20%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {PLANS.map((plan, i) => {
          const price = annual
            ? Math.round(Number(plan.price) * 0.8)
            : Number(plan.price);
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative"
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="gradient-brand text-white shadow-glow">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}
              <Card
                className={`h-full p-6 sm:p-8 relative overflow-hidden ${
                  plan.highlighted
                    ? "border-primary shadow-glow-lg"
                    : "hover:shadow-md transition-shadow"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute inset-0 gradient-brand-soft opacity-40 pointer-events-none" />
                )}
                <div className="relative">
                  <div
                    className={`h-12 w-12 rounded-xl bg-gradient-to-br ${plan.color} grid place-items-center shadow-sm mb-4`}
                  >
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{price}€</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {annual && Number(plan.price) > 0 && (
                    <p className="text-xs text-emerald-600 mt-1">
                      Économisez {Number(plan.price) * 12 - price * 12}€/an
                    </p>
                  )}
                  <Button
                    className={`w-full mt-6 ${
                      plan.highlighted
                        ? "gradient-brand text-white hover:opacity-90"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => {
                      if (user) {
                        toast.success(`Plan ${plan.name} sélectionné`, {
                          description: "Redirection vers le paiement…",
                        });
                      } else {
                        setView("convert");
                        toast.info("Créez un compte pour continuer", {
                          description: "Inscription en 30 secondes.",
                        });
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                  <ul className="mt-7 space-y-3">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={`h-4 w-4 mt-0.5 shrink-0 ${
                            idx === 0 && f.endsWith(":")
                              ? "text-primary font-semibold"
                              : "text-emerald-500"
                          }`}
                        />
                        <span
                          className={
                            idx === 0 && f.endsWith(":")
                              ? "font-semibold"
                              : "text-muted-foreground"
                          }
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Enterprise strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <Card className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 grid place-items-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Enterprise</h3>
              <p className="text-sm text-muted-foreground">
                Volume personnalisé, infrastructure dédiée, conformité avancée.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              toast.info("Contact commercial", {
                description: "sales@convertflow.app vous répondra sous 24h.",
              })
            }
          >
            Nous contacter
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
