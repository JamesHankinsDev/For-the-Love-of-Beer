# For the Love of Beer — Brewery Passport App

## Project Overview
A Brewery Passport app for US craft beer enthusiasts. Users discover breweries, check in when they visit, and collect stylized digital "passport stamps." Brewery owners get a web dashboard.

## Architecture
- **Monorepo**: Turborepo + pnpm workspaces
- **Mobile**: React Native (Expo) with Expo Router — `apps/mobile/`
- **Web**: Next.js 14 App Router — `apps/web/`
- **Shared packages**: `packages/shared/` (types, constants, validation), `packages/firebase-config/` (Firebase init)
- **Backend**: Firebase (Auth, Firestore, Cloud Functions, Cloud Storage)
- **Functions**: `firebase/functions/` — Cloud Functions (TypeScript, CommonJS)
- **Data source**: Open Brewery DB (MIT, free API) synced weekly

## Key Conventions
- TypeScript strict mode throughout
- pnpm as package manager
- Package scope: `@ftlob/`
- ESLint + Prettier for formatting
- Firestore collections: `breweries`, `users`, `users/{uid}/stamps`, `trails`

## Commands
- `pnpm dev:mobile` — start Expo dev server
- `pnpm dev:web` — start Next.js dev server
- `pnpm build` — build all workspaces
- `pnpm lint` — lint all workspaces
- `pnpm sync-breweries` — run Open Brewery DB sync script

## Brand
- Colors: Amber/gold primary (#D4A034), warm neutrals, dark text (#2C1810)
- Tone: Warm, fun, unpretentious — like a knowledgeable beer-loving friend
- Rating: 1-5 hop icons (not stars)
- Copy: Celebratory ("You stamped your passport!"), not clinical
