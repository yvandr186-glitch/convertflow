"use client";

import * as React from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useAppStore } from "@/lib/store";
import type { ViewId } from "@/types";
import {
  Home,
  Zap,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Video,
  Search,
  Sparkles,
  Github,
  Star,
  HelpCircle,
  Settings,
} from "lucide-react";

interface CommandPaletteProps {
  onAuthOpen: () => void;
}

const NAV_ITEMS: { id: ViewId; label: string; icon: typeof Home; hint: string }[] = [
  { id: "home", label: "Accueil", icon: Home, hint: "Page d'accueil" },
  { id: "convert", label: "Convertir un fichier", icon: Zap, hint: "Outil de conversion" },
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, hint: "Dashboard" },
  { id: "tools-pdf", label: "Outils PDF", icon: FileText, hint: "12 outils" },
  { id: "tools-image", label: "Outils Image", icon: ImageIcon, hint: "9 outils" },
  { id: "tools-video", label: "Outils Vidéo", icon: Video, hint: "4 outils" },
  { id: "pricing", label: "Tarifs", icon: Star, hint: "Plans & prix" },
];

export function CommandPalette({ onAuthOpen }: CommandPaletteProps) {
  const { paletteOpen, setPaletteOpen, setView, user } = useAppStore();

  // Global Ctrl/Cmd + K shortcut
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [paletteOpen, setPaletteOpen]);

  function go(id: ViewId) {
    setView(id);
    setPaletteOpen(false);
  }

  return (
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen}>
      <CommandInput placeholder="Recherchez une action, un outil, une conversion…" />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.id}
              value={`${item.label} ${item.hint}`}
              onSelect={() => go(item.id)}
              className="cursor-pointer"
            >
              <item.icon className="h-4 w-4 text-primary" />
              <span>{item.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {item.hint}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions rapides">
          <CommandItem
            onSelect={() => {
              setPaletteOpen(false);
              onAuthOpen();
            }}
            className="cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{user ? "Changer de compte" : "Se connecter / S'inscrire"}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setPaletteOpen(false);
              setView("convert");
            }}
            className="cursor-pointer"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span>Nouvelle conversion</span>
            <span className="ml-auto text-xs text-muted-foreground">⌘N</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setPaletteOpen(false);
              setView("dashboard");
            }}
            className="cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <span>Voir mon historique</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Liens utiles">
          <CommandItem
            onSelect={() => {
              setPaletteOpen(false);
              window.open("https://github.com", "_blank");
            }}
            className="cursor-pointer"
          >
            <Github className="h-4 w-4" />
            <span>Documentation GitHub</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setPaletteOpen(false);
              setView("pricing");
            }}
            className="cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Centre d&apos;aide</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setPaletteOpen(false);
              toastSettings();
            }}
            className="cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span>Paramètres du compte</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function toastSettings() {
  import("sonner").then(({ toast }) =>
    toast.info("Paramètres", {
      description: "Le panneau de paramètres sera disponible dans votre dashboard.",
    }),
  );
}
