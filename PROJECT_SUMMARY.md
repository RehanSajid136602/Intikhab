<!-- Last updated: 2026-04-10T00:00:00Z -->

# Intikhab — Project Summary

## Identity
- **What:** Next.js 14 ecommerce platform for a Pakistani shoe retailer
- **Why:** Online shopping platform for men's, women's, and kids' footwear with cart, checkout, and admin dashboard
- **Status:** Active development

## Tech Stack
- **Runtime/Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** React 18, Tailwind CSS v3, Framer Motion
- **State:** Zustand (client-side persisted stores)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts (admin dashboard)
- **Tables:** @tanstack/react-table (admin)
- **Notifications:** Sonner (toast notifications)
- **Icons:** lucide-react
- **Deployment:** Vercel

## Architecture
- **Pattern:** Next.js App Router with client/server components
- **Entry points:** `src/app/layout.tsx`, `src/app/page.tsx`
- **Routing:** File-based routing (`src/app/`) with catch-all `[...slug]`
- **API surface:** Static data-driven (`src/data/products.ts`, etc.) — no backend API yet
- **Data flow:** Components → Zustand Stores → Static Data → UI
- **Key boundaries:** `src/app/` (routes) ↔ `src/components/` (UI) ↔ `src/stores/` (state)

## Directory Map
- **`src/app/`**: Next.js App Router — all pages and route handlers
- **`src/components/`**: UI components organized by domain (`admin/`, `cart/`, `home/`, `products/`, `layout/`, `ui/`)
- **`src/stores/`**: Zustand stores (`cartStore.ts`, `adminStore.ts`, `uiStore.ts`, `wishlistStore.ts`)
- **`src/data/`**: Static JSON/TS data files (products, navigation, admin seed data)
- **`src/hooks/`**: Custom React hooks (carousels, scroll reveals)
- **`src/lib/`**: Shared utilities (`cn`, `formatPKR`) and constants
- **`src/types/`**: TypeScript type definitions (`product.ts`, `admin.ts`, `order.ts`)
- **`public/`**: Static assets (images, favicon)
- **`openspec/`**: Project specifications and task tracking

## Conventions
- **Imports:** `@/*` path alias to `src/`
- **Naming:** PascalCase for components, camelCase for utilities
- **Styling:** Tailwind CSS with `cn()` utility from `@/lib/utils`
- **State:** Zustand stores in `src/stores/`, each store is a single file with persist middleware
- **Forms:** React Hook Form + Zod schema validation
- **Animations:** Framer Motion for transitions and motion effects
- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)

## Key Files (read these first for context)
1. `src/app/layout.tsx` — Root layout with font, metadata, and persistent components
2. `src/app/page.tsx` — Homepage with all sections
3. `src/stores/cartStore.ts` — Cart state management (Zustand + persist)
4. `src/lib/utils.ts` — Utility functions (`cn`, `formatPKR`)
5. `src/types/product.ts` — Core product and cart type definitions
6. `src/data/products.ts` — Static product data source
7. `tailwind.config.ts` — Tailwind theme configuration
8. `next.config.js` — Next.js configuration (images, security headers)

## Risk Areas
- **Static data dependency:** All products/data are in `src/data/` — migrating to a real backend will require significant refactoring
- **Cart store coupling:** `cartStore.ts` is central to the ecommerce flow; changes here affect checkout, cart drawer, and product pages
- **Client-side state:** All state management is client-side (Zustand) — no server-side rendering of cart/order state
- **Performance:** Homepage uses many `dynamic()` imports with loading states; ensure these don't cause layout shift
- **Security headers:** CSP in `next.config.js` allows `'unsafe-eval'` and `'unsafe-inline'` — review for production hardening

## Domain Glossary
- **Intikhab:** Brand name (Urdu for "Selection") — Pakistan's online shoe store
- **Category:** Product categorization: `men`, `women`, `kids`
- **ProductBadge:** Visual tags on products: `SALE`, `NEW`, or null
- **PKR:** Pakistani Rupees — currency formatting used throughout

## Testing
- **Command to run tests:** No test suite configured yet
- **Command to run lint:** `npm run lint`
- **Command to build:** `npm run build`
- **Test patterns:** None established — recommend adding Vitest + Testing Library

## When to Re-Analyze
Re-run this analysis when: a backend/database is integrated, test suite is added, directory structure changes significantly, or architectural patterns shift (e.g., server components, API routes).
