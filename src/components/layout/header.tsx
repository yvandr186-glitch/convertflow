"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Command,
  Zap,
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Sparkles,
  LogOut,
  ChevronDown,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppStore } from "@/lib/store";
import type { ViewId } from "@/types";
import { AuthModal } from "@/components/auth-modal";
import { toast } from "sonner";

const NAV: { id: ViewId; label: string }[] = [
  { id: "home", label: "Accueil" },
  { id: "convert", label: "Convertir" },
  { id: "tools-pdf", label: "Outils PDF" },
  { id: "tools-image", label: "Images" },
  { id: "pricing", label: "Tarifs" },
];

export function Header() {
  const { view, setView, user, logout, notifications, setPaletteOpen } = useAppStore();
  const [authOpen, setAuthOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  function nav(id: ViewId) {
    setView(id);
    setMobileOpen(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "glass border-b border-border/40 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => nav("home")}
            className="flex items-center gap-2 group"
            aria-label="ConvertFlow accueil"
          >
            <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center shadow-glow group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Convert<span className="gradient-text">Flow</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => nav(item.id)}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  view === item.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {view === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full gradient-brand"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Rechercher</span>
              <kbd className="inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium">
                <Command className="h-3 w-3" />K
              </kbd>
            </Button>

            <ThemeToggle />

            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full"
                      aria-label="Notifications"
                    >
                      <Bell className="h-[1.1rem] w-[1.1rem]" />
                      {unread > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      Notifications
                      <Badge variant="secondary" className="text-[10px]">
                        {unread} non lues
                      </Badge>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.slice(0, 6).map((n) => (
                        <DropdownMenuItem
                          key={n.id}
                          className="flex flex-col items-start gap-0.5 py-2"
                        >
                          <span className="text-sm font-medium">{n.title}</span>
                          <span className="text-xs text-muted-foreground line-clamp-2">
                            {n.message}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 pl-1.5 pr-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {(user.name ?? user.email)[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                        {user.name ?? user.email}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => nav("dashboard")}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Tableau de bord
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => nav("convert")}>
                      <Zap className="h-4 w-4 mr-2" />
                      Nouvelle conversion
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => nav("tools-pdf")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Outils PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => nav("tools-image")}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Outils Image
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        toast.success("Déconnecté", {
                          description: "À bientôt sur ConvertFlow.",
                        });
                      }}
                      className="text-rose-600 focus:text-rose-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Se connecter
                </Button>
                <Button
                  size="sm"
                  onClick={() => setAuthOpen(true)}
                  className="gradient-brand text-white hover:opacity-90"
                >
                  Essai gratuit
                </Button>
              </div>
            )}

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden glass border-t border-border/40"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => nav(item.id)}
                    className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      view === item.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {!user && (
                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAuthOpen(true);
                        setMobileOpen(false);
                      }}
                    >
                      Se connecter
                    </Button>
                    <Button
                      className="gradient-brand text-white"
                      onClick={() => {
                        setAuthOpen(true);
                        setMobileOpen(false);
                      }}
                    >
                      Essai gratuit
                    </Button>
                  </div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
