# Седмично Меню (Weekly Meal Planner)

A mobile-first PWA in Bulgarian that helps you plan weekly meals and generate shopping lists. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- 📅 Week view with 4 meal slots per day (закуска, обяд, вечеря, снакс)
- 🍲 Recipe library with ingredients, instructions, macros, tags
- 🛒 Auto-generated shopping list aggregated and scaled across the week
- 📋 "Copy from previous week" one-click planning
- 📊 Daily and weekly macro totals
- 📱 Installable PWA with offline fallback
- 🌗 Light + dark mode (system)
- 🇧🇬 Bulgarian UI, English codebase

## Tech stack

- **Framework:** Next.js 14 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui + lucide-react
- **DB:** Supabase Postgres (no auth, anon key)
- **Forms:** react-hook-form + zod
- **PWA:** next-pwa (service worker, offline fallback)
- **Dates:** date-fns + `bg` locale
- **Tests:** vitest

## Setup

### 1. Install dependencies

```bash
pnpm install
# or: npm install / yarn
```

### 2. Set up Supabase

1. Create a free project at <https://supabase.com>.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`.
3. (Optional) Run `supabase/seed.sql` to load 7 sample Bulgarian recipes.
4. Copy the **Project URL** and **anon public key** from Settings → API.

### 3. Configure env vars

```bash
cp .env.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Run locally

```bash
pnpm dev
```

Open <http://localhost:3000>. The PWA service worker is **disabled in dev** — to test PWA features run `pnpm build && pnpm start`.

### 5. Tests

```bash
pnpm test
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import into Vercel — zero config needed.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` env vars in the project settings.
4. Deploy. The PWA manifest, service worker, and offline page are automatically built.

## Project structure

```
app/
  (tabs)/
    page.tsx                       # redirects to current week
    week/[isoDate]/page.tsx        # week view
    recipes/page.tsx               # recipe list
    recipes/new/page.tsx
    recipes/[id]/page.tsx
    recipes/[id]/edit/page.tsx
    shopping/[isoDate]/page.tsx
  offline/page.tsx                 # PWA fallback
  actions.ts                       # server actions (writes)
  layout.tsx                       # root layout (PWA meta)
components/
  ui/                              # shadcn primitives
  bottom-nav.tsx, week-grid.tsx, meal-slot.tsx,
  recipe-picker-sheet.tsx, recipe-card.tsx,
  recipe-form.tsx, shopping-list-client.tsx,
  macros-summary.tsx, week-header.tsx
lib/
  supabase.ts                      # SSR + browser client
  queries.ts                       # all DB reads
  date-utils.ts                    # ISO week helpers
  shopping-aggregator.ts           # pure, unit-tested
  constants.ts, types.ts, utils.ts
supabase/
  migrations/0001_init.sql
  seed.sql
public/
  manifest.json, icons/
```

## Icons

Placeholder SVG is included at `public/icons/icon.svg`. Generate PNG icons (192px and 512px) for full PWA installability:

```bash
# Quick method with ImageMagick:
magick public/icons/icon.svg -resize 192x192 public/icons/icon-192.png
magick public/icons/icon.svg -resize 512x512 public/icons/icon-512.png
```

Or use any online "PWA icon generator" with `public/icons/icon.svg` as input.
