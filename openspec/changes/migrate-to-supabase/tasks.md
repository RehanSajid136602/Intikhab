## 1. Environment & Dependencies

- [x] 1.1 Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `prisma`, `@prisma/client`
- [x] 1.2 Initialize Prisma: `npx prisma init` — creates `prisma/schema.prisma` and `.env` with `DATABASE_URL`
- [x] 1.3 Add environment variables to `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`
- [x] 1.4 Add `.env.local` to `.gitignore` (if not already)

## 2. Prisma Schema & Database

- [x] 2.1 Create `prisma/schema.prisma` with PostgreSQL datasource, Prisma generator
- [x] 2.2 Define `Product` model matching existing Product interface (uuid id, slug unique indexed, all fields typed)
- [x] 2.3 Define `Customer` model (uuid id, email unique, phone, full_name, timestamps)
- [x] 2.4 Define `Order` model (id text PK, customer fields FK, shipping address, payment method, total, status, timestamps)
- [x] 2.5 Define `OrderItem` model (uuid id, order FK, product_id, name, image, quantity, price)
- [x] 2.6 Define `Cart` model (uuid id, customer_email indexed, product_id, quantity, unique constraint on email+product_id, timestamps)
- [x] 2.7 Run `npx prisma migrate dev --name init` to generate initial migration — MANUAL: requires live DB
- [x] 2.8 Create `prisma/seed.ts` that imports products from `src/data/products.ts` and upserts by SKU
- [x] 2.9 Add `"prisma": { "seed": "npx tsx prisma/seed.ts" }` to package.json
- [x] 2.10 Run seed: `npx prisma db seed` — verify 4 products in database — MANUAL: requires live DB

## 3. Row Level Security Policies

- [x] 3.1 Create SQL migration file `prisma/rls_policies.sql` with RLS enablement for all 5 tables
- [x] 3.2 Add Product RLS: SELECT for anon, INSERT/UPDATE/DELETE for authenticated only
- [x] 3.3 Add Order RLS: INSERT for anon, SELECT/UPDATE for authenticated admin
- [x] 3.4 Add OrderItem RLS: INSERT for anon (via order), SELECT for authenticated admin
- [x] 3.5 Add Customer RLS: SELECT own row by email, admin can view all
- [x] 3.6 Add Cart RLS: CRUD for matching customer_email, admin can view all
- [x] 3.7 Apply RLS policies in Supabase SQL editor or via migration — MANUAL

## 4. Supabase Client Utilities

- [x] 4.1 Create `src/lib/supabase/server.ts` — `getServerSupabase()` using service role key, for server components
- [x] 4.2 Create `src/lib/supabase/client.ts` — `getBrowserSupabase()` using anon key + SSR cookies, for client components
- [x] 4.3 Create Supabase types file from schema: `src/lib/supabase/database.types.ts` (generated manually from Prisma)
- [x] 4.4 Verify both clients initialize without errors

## 5. API Routes

- [x] 5.1 Create `app/api/products/route.ts` — GET (public, active products, with category/slug/limit/offset params), POST (admin only, create product)
- [x] 5.2 Create `app/api/products/[id]/route.ts` — PUT (admin update product), DELETE (admin soft-delete by setting status=draft)
- [x] 5.3 Create `app/api/orders/route.ts` — POST (create order + order items + customer upsert), GET (admin only, paginated, status filter)
- [x] 5.4 Create `app/api/cart/route.ts` — POST (upsert cart items for email), GET (get cart by email)
- [x] 5.5 Create `app/api/upload-image/route.ts` — POST (multipart upload to Supabase Storage, admin only, returns public URL)
- [x] 5.6 Ensure all API routes return response shapes matching existing interfaces (Product[], Order, etc.)
- [ ] 5.7 Test all routes with curl/Postman: verify public routes work without auth, protected routes return 401 without session — MANUAL

## 6. Server Components — Data Fetching

- [x] 6.1 Update `src/app/page.tsx` — fetch active products from Supabase via `getServerSupabase()` instead of static import
- [x] 6.2 Update `src/app/men/page.tsx` — fetch products filtered by category=men
- [x] 6.3 Update `src/app/women/page.tsx` — fetch products filtered by category=women
- [x] 6.4 Update `src/app/kids/page.tsx` — fetch products filtered by category=kids
- [x] 6.5 Update `src/app/product/[slug]/page.tsx` — fetch single product by slug
- [ ] 6.6 Verify all pages render correctly with Supabase data, PKR formatting preserved — MANUAL: requires live DB

## 7. Admin Authentication

- [x] 7.1 Create `app/admin/login/page.tsx` — login form with email/password, uses Supabase Auth
- [x] 7.2 Create `src/app/admin/layout.tsx` (or update existing) — wrap with auth provider, redirect to login if unauthenticated
- [x] 7.3 Create middleware `src/middleware.ts` — protect `/admin/*` routes, verify Supabase session, redirect to `/admin/login`
- [x] 7.4 Seed initial admin account in Supabase dashboard or via SQL — MANUAL
- [x] 7.5 Add logout functionality to admin top bar (in Sidebar component)

## 8. Admin Dashboard — Supabase Integration

- [x] 8.1 Update `src/components/admin/AddProductModal.tsx` — submit to `POST /api/products` instead of Zustand store, include image upload to Supabase Storage
- [x] 8.2 Update `src/components/admin/ProductsTable.tsx` — fetch products from `GET /api/products` instead of adminStore
- [x] 8.3 Update `src/components/admin/OrdersTable.tsx` — fetch orders from `GET /api/orders` instead of mock data
- [x] 8.4 Update `src/components/admin/SalesChart.tsx` — use real order data for revenue calculations
- [x] 8.5 Update `src/components/admin/StatsCard.tsx` — compute stats from Supabase queries
- [x] 8.6 Update `src/stores/adminStore.ts` — convert to thin wrapper around API calls, preserve existing API for compatibility

## 9. Cart & Wishlist Sync

- [x] 9.1 Update `src/stores/cartStore.ts` — add `syncCartToSupabase(email)` and `loadCartFromSupabase(email)` methods
- [x] 9.2 On checkout form submit, call `POST /api/cart` to persist cart before creating order
- [x] 9.3 Add loading state and error handling with Sonner toasts for cart sync failures
- [ ] 9.4 Update `src/stores/wishlistStore.ts` — add similar Supabase sync pattern (if wishlist persistence needed)
- [x] 9.5 Verify existing cart API (addItem, removeItem, updateQuantity, clearCart) unchanged for guest users

## 10. Checkout — Order Creation

- [x] 10.1 Update `src/app/checkout/page.tsx` — on form submit, call `POST /api/orders` instead of sessionStorage
- [x] 10.2 Pass full order payload: customer info, items array, payment method, total
- [x] 10.3 On success, redirect to `/order-confirmation` with order ID in URL params
- [x] 10.4 Update `src/app/order-confirmation/page.tsx` — fetch order details from Supabase by ID
- [ ] 10.5 Verify order appears in admin OrdersTable after creation — MANUAL: requires live DB

## 11. Image Upload Flow

- [x] 11.1 Update `AddProductModal` image upload — POST selected files to `/api/upload-image` instead of base64 preview
- [x] 11.2 Store returned Supabase Storage URLs in product images array
- [x] 11.3 Update `next.config.js` image config to allow Supabase Storage domain in `remotePatterns`
- [ ] 11.4 Test full flow: admin uploads image → product created → product page displays Supabase-hosted image — MANUAL

## 12. Verification & Cleanup

- [x] 12.1 Run `npm run build` — verify zero errors and zero warnings
- [x] 12.2 Run `npm run lint` — fix any new linting issues
- [ ] 12.3 Run `npm run dev` — test all pages: home, men, women, kids, product detail, checkout, order confirmation — MANUAL
- [ ] 12.4 Test admin flow: login → add product with image → view in products table → view orders — MANUAL
- [ ] 12.5 Verify no `service_role` key in client bundle (search `.next/static` for service_role) — MANUAL
- [ ] 12.6 Verify RLS: try accessing protected endpoint without auth, confirm 401 — MANUAL
- [ ] 12.7 Document Vercel environment variable setup in README
- [ ] 12.8 Remove or deprecate static data imports from `src/data/*.ts` (keep as seed source only)

## Manual Steps (for you to do outside this change)

- [x] M.1 Create Supabase project at supabase.com (Singapore region)
- [x] M.2 Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [x] M.3 Copy `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (never commit)
- [x] M.4 Create `product-images` storage bucket in Supabase dashboard, set public
- [x] M.5 Run RLS policy SQL in Supabase SQL editor
- [ ] M.6 Add all env vars to Vercel project settings for production
