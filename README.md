# ConvertFlow

SaaS premium de conversion de fichiers — Next.js 16 + TypeScript + Prisma + Tailwind v4 + shadcn/ui.

> Convertissez, compressez et optimisez tous vos fichiers en quelques secondes.

## Démarrage

```bash
pnpm install
pnpm prisma generate
pnpm prisma db push
pnpm dev
```

Ouvrez http://localhost:3000

## Stack

- **Next.js 16** (App Router) + TypeScript 5
- **Prisma ORM** (SQLite en local, PostgreSQL/Neon en prod)
- **Tailwind CSS v4** + **shadcn/ui** (style New York)
- **framer-motion** (animations) + **recharts** (graphiques)
- **sharp** (conversion d'images réelle) + **qrcode** (téléchargement sécurisé)
- **Zustand** (state client) + **next-themes** (dark mode)
- **lucide-react** (icônes) + **sonner** (toasts)

## Fonctionnalités

- Landing page premium (Hero, Features, Tools, How it works, FAQ, Newsletter…)
- Convertisseur drag & drop avec **détection automatique du format** et **conversion réelle via sharp**
- 60+ conversions (images, documents, audio, vidéo, archives, eBooks, développeur)
- Outils dédiés PDF / Image / Vidéo (25 outils)
- **Authentification réelle** : mot de passe hashé (scrypt), sessions en DB, cookie httpOnly
- **Dashboard personnel par utilisateur** (données isolées par userId)
- Command Palette (Ctrl+K), mode sombre, responsive mobile
- SEO complet : metadata, OpenGraph, JSON-LD, sitemap, robots, PWA manifest
- QR code de téléchargement + liens temporaires sécurisés (24h)

## Structure

```
src/
├── app/
│   ├── api/          # 10 routes (convert, auth/*, dashboard, newsletter…)
│   ├── globals.css   # Design system (palette bleue + glassmorphism)
│   ├── layout.tsx    # SEO + ThemeProvider
│   └── page.tsx      # Router SPA (vues lazy-loaded)
├── components/
│   ├── layout/       # Header glassmorphism + Footer sticky
│   ├── landing/      # Landing page + Tarifs
│   ├── converter/    # Convertisseur drag & drop
│   ├── dashboard/    # Dashboard personnel
│   ├── tools/        # Outils PDF/Image/Vidéo
│   ├── auth-modal.tsx
│   ├── command-palette.tsx
│   └── theme-toggle.tsx
├── lib/              # auth, db, store (Zustand), conversion-catalog, format
├── services/         # conversion-service (sharp)
└── types/            # Types partagés
```

## Production (Neon PostgreSQL)

1. Changez le provider dans `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Mettez votre `DATABASE_URL` Neon dans `.env`
3. `pnpm prisma db push && pnpm build`

## Déploiement Vercel

```bash
vercel
```
Configurez `DATABASE_URL` dans les variables d'environnement Vercel.

---

© ConvertFlow — conçu avec passion.
