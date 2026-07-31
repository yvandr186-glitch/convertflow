"use client";

import { Sparkles, Twitter, Github, Linkedin, Youtube, Mail } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { ViewId } from "@/types";

const FOOTER_LINKS: { title: string; links: { label: string; view?: ViewId }[] }[] = [
  {
    title: "Produit",
    links: [
      { label: "Convertisseur", view: "convert" },
      { label: "Outils PDF", view: "tools-pdf" },
      { label: "Outils Image", view: "tools-image" },
      { label: "Outils Vidéo", view: "tools-video" },
      { label: "Tarifs", view: "pricing" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Documentation" },
      { label: "API publique" },
      { label: "Blog" },
      { label: "Tutoriels" },
      { label: "Statut" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos" },
      { label: "Carrières" },
      { label: "Partenaires" },
      { label: "Presse" },
      { label: "Contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Conditions" },
      { label: "Confidentialité" },
      { label: "Cookies" },
      { label: "RGPD" },
      { label: "Sécurité" },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export function Footer() {
  const { setView } = useAppStore();

  return (
    <footer className="mt-auto border-t border-border/60 bg-gradient-to-b from-transparent to-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-2"
            >
              <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center shadow-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Convert<span className="gradient-text">Flow</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              La plateforme premium pour convertir, compresser et optimiser tous
              vos fichiers en quelques secondes. Rapide, sécurisé, illimité.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => l.view && setView(l.view)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ConvertFlow. Conçu avec passion.
            Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Tous les systèmes opérationnels
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" /> support@convertflow.app
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
