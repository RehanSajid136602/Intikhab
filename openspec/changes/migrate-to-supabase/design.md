## Context

Intikhab is a Next.js 14 App Router ecommerce site with all product/admin data hardcoded in `src/data/*.ts` files. State management uses Zustand with localStorage persistence. The UI is production-ready with Tailwind CSS, Framer Motion, and proper responsive design. We need to add Supabase as a backend without touching any UI components, Tailwind classes, or page structures.

**Current architecture:**
- Static data: `src/data/products.ts` (4 products), `src/data/admin.ts` (mock orders, stats, revenue)
- State: Zustand stores (`cartStore`, `wishlistStore`, `adminStore`, `uiStore`) with localStorage
- Admin: In-memory Zustand mutations for product CRUD
- Checkout: Form-only flow, stores order in sessionStorage, no backend persistence

**Constraints:**
- Supabase free tier (500MB database, 1GB storage)
- Singapore region for lowest latency to Pakistan
- Zero UI changes — existing Tailwind classes, component props, and page layouts must be preserved
- Service role key must never reach client bundle

## Goals / Non-Goals

**Goals:**
- Replace all static data sources with Supabase Postgres queries
- Enable admin authentication via Supabase Auth (email/password)
- Persist product images in Supabase Storage with public read / admin write
- Keep existing cart/wishlist stores API-compatible while adding Supabase sync for authenticated users
- Maintain PKR currency formatting and Pakistani checkout flow (COD, JazzCash, Easypaisa)

**Non-Goals:**
- Customer user accounts/auth (guest checkout only for v1)
- Payment gateway integration (COD/manual payment flow stays)
- Real-time features (no Supabase Realtime subscriptions)
- Email notifications, SMS, or webhooks
- Search/elastic indexing

## Decisions

### 1. Prisma as ORM (not Supabase JS client directly)
**Decision:** Use Prisma with `provider = "postgresql"` as the data modeling layer, plus `@supabase/supabase-js` for Auth and Storage.

**Why:** Prisma provides type-safe migrations, schema visualization, and a clean API surface. Supabase JS client handles Auth/Storage where Prisma can't.

**Alternatives considered:**
- Supabase JS client only: Loses schema-as-code benefits, harder to reason about types
- Drizzle ORM: Lighter but Prisma has better ecosystem and migration tooling

### 2. Database schema: 5 tables
**Tables:** `Product`, `Customer`, `Order`, `OrderItem`, `Cart`

**Why:** This covers the full ecommerce flow. Cart table enables cross-device sync for authenticated users. Customer table stores shipping profiles without requiring login.

### 3. RLS: Public read for products, authenticated-only for writes
**Decision:** Products table — `SELECT` for anon, all mutations for authenticated admin only. Orders — users can create/select own orders via customerEmail match, admin can see all.

**Why:** Simple and secure. No customer accounts needed for v1; orders are accessible via email + order ID combination.

### 4. Image handling: Supabase Storage bucket
**Decision:** Create `product-images` bucket with public access. Admin uploads via service role in server route. Existing `public/` images stay as-is and new uploads go to Storage.

**Why:** Gradual migration path — old images from `public/` keep working, new admin-uploaded images go to Storage.

### 5. Admin auth: Supabase Auth email/password only
**Decision:** Single admin account seeded on first migration. No signup UI, no social auth.

**Why:** Simplest approach for a single-admin store. Can add multi-role admin panel later.

### 6. Cart sync: localStorage stays for guests, Supabase for authenticated
**Decision:** Existing `cartStore` API (`addItem`, `removeItem`, etc.) unchanged. Add `syncCartToSupabase()` and `loadCartFromSupabase()` helpers. On login, merge localStorage cart with DB cart.

**Why:** Zero breaking changes to existing cart UI components.

### 7. Server components for data fetching
**Decision:** `app/page.tsx`, `app/men/page.tsx`, `app/women/page.tsx`, `app/kids/page.tsx` all become server components using `lib/supabase/server.ts` with service role key.

**Why:** Best performance (SSR), no client-side loading spinners for initial render, SEO-friendly.

### 8. API routes for client-side mutations
**Decision:** `app/api/products/route.ts` (POST for admin), `app/api/orders/route.ts` (POST for checkout), `app/api/cart/route.ts` (sync). All use `@supabase/ssr` createServerClient.

**Why:** Keeps Supabase service role on server only. Client components call Next.js API routes.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Supabase free tier limits (500MB DB) | Images stored separately (1GB Storage tier). Product catalog is small — 500 products ≈ <10MB |
| Service role key exposure | Only used in server components and API routes. Never in `'use client'` files |
| Migration breaks existing UI | Static `src/data/` files remain as seed data. Rollback = `git revert` |
| Admin Store still uses in-memory | `adminStore` becomes thin wrapper around API route calls. Old API preserved for compatibility |
| Checkout still no real payment | Out of scope — can add Stripe/JazzCash API in future phase |
| Image upload via base64 (current) | Migrate to multipart upload through Supabase Storage API route |

## Migration Plan

1. **Setup**: Create Supabase project, install deps, create Prisma schema
2. **Migrate**: Run `prisma migrate dev`, seed data from existing `src/data/products.ts`
3. **RLS**: Apply security policies via Supabase SQL editor
4. **Fetch**: Update server components to query Supabase instead of importing static data
5. **Mutate**: Wire admin forms and checkout to API routes that write to Supabase
6. **Sync**: Add cart/wishlist sync helpers to Zustand stores
7. **Verify**: `npm run build` passes, all pages load, admin can add product with image

**Rollback:** Static data files are never deleted — they become seed scripts only. Revert git commit to restore JSON-based data flow.
