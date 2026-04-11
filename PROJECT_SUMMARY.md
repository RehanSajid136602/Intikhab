<!-- Last updated: 2026-04-11T12:00:00Z -->

# Intikhab — Project Summary

## Identity
- **What:** Next.js 14 ecommerce platform for a Pakistani shoe retailer
- **Why:** Online shopping platform for men's, women's, and kids' footwear with cart, checkout, and admin dashboard
- **Status:** Active development — Enhanced product categories with hierarchical routing (shoes, bags, accessories, clothing)

## Tech Stack
- **Runtime/Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** React 18, Tailwind CSS v3, Framer Motion, lucide-react icons
- **State:** Zustand (client-side persisted stores with middleware)
- **Database:** Supabase PostgreSQL + Prisma ORM
- **Auth:** Supabase Auth (middleware-protected admin routes)
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts (admin dashboard analytics)
- **Tables:** @tanstack/react-table (admin data tables)
- **Notifications:** Sonner (toast notifications)
- **Deployment:** Vercel with Edge Network optimization

## Architecture
- **Pattern:** Next.js App Router with Server Components + Client Components hybrid
- **Entry points:** `src/app/layout.tsx` (root), `src/app/(public)/page.tsx` (home), `src/app/admin/(dashboard)/page.tsx` (admin)
- **Routing:** File-based routing with route groups: `(public)/` for storefront, `admin/` for dashboard
- **API surface:** RESTful API routes in `src/app/api/` — products, orders, cart, upload-image
- **Data flow:** Server Components → Supabase DB → Client Stores → UI; or API Routes → Supabase DB → Client
- **Key boundaries:** 
  - `src/app/(public)/` (storefront) ↔ `src/app/admin/` (dashboard)
  - `src/stores/` (client state) ↔ `src/app/api/` (server endpoints)
  - `prisma/schema.prisma` (data layer) ↔ `src/lib/supabase/` (clients)

## Directory Map

### Application Layer (`src/app/`)
- **`(public)/`**: Storefront route group with navbar/footer layout
  - `page.tsx` — Homepage with dynamic sections (Hero, ShopByCategory, Mosaic, etc.)
  - `[productType]/` — Product type landing pages (shoes, bags, accessories, clothing)
  - `[productType]/[category]/` — Category pages with hierarchical routing (e.g., /shoes/men)
  - `men/`, `women/`, `kids/` — Legacy category pages (redirect to new structure)
  - `product/[slug]/` — Product detail pages
  - `checkout/`, `order-confirmation/`, `wishlist/` — Ecommerce flows
  - `blog/`, `faq/`, `size-guide/`, `privacy-policy/`, `terms-and-conditions/`, `cookie-policy/` — Content pages
  - `[...slug]/` — Catch-all for dynamic content
- **`admin/`**: Admin dashboard route group
  - `(dashboard)/` — Protected layout with sidebar + topbar
    - `page.tsx` — Dashboard with stats, chart, recent orders
    - `products/`, `orders/` — Management pages
  - `login/` — Admin authentication page
- **`api/`**: API route handlers
  - `products/route.ts` — GET (public), POST (admin) product CRUD
  - `orders/route.ts` — POST (guest checkout), GET (admin list)
  - `orders/[id]/route.ts` — GET, PUT individual order operations
  - `products/[id]/route.ts` — GET, PUT, DELETE individual product operations
  - `cart/route.ts` — Cart sync operations
  - `upload-image/route.ts` — Image upload handler

### Component Layer (`src/components/`)
- **`admin/`**: Dashboard components (StatsCard, SalesChart, OrdersTable, ProductsTable, RecentOrders, Sidebar, TopBar, AddProductModal)
- **`cart/`**: Cart drawer and cart item components
- **`category/`**: Category listing components
- **`home/`**: Homepage sections (HeroSlider, ShopByCategory, CategoryMosaic, InstaFeed, Testimonials, TrustBadges, Newsletter, GenderTabs)
- **`layout/`**: Navbar, Footer, AnnouncementBar, SearchOverlay, MobileMenu
- **`legal/`**: Legal content components
- **`products/`**: Product cards, product details, size selector
- **`ui/`**: Reusable UI primitives (buttons, inputs, badges, etc.)

### State Management (`src/stores/`)
- **`cartStore.ts`**: Cart state with Zustand + persist middleware, Supabase sync methods
- **`adminStore.ts`**: Admin data fetching and mutations (products/orders), API helpers
- **`uiStore.ts`**: UI state (mobile menu, search, cart drawer, announcement, tabs)
- **`wishlistStore.ts`**: Wishlist items with persist middleware

### Data Layer
- **`prisma/schema.prisma`**: Database schema — Product, Customer, Order, OrderItem, Cart models
- **`prisma/seed.ts`**: Database seeding script
- **`prisma/rls_policies.sql`**: Supabase Row Level Security policies
- **`src/generated/prisma/`**: Prisma client output (generated)
- **`src/data/products.ts`**: Static product seed data (fallback/initial)
- **`src/data/navigation.ts`**: Navigation links and footer structure
- **`src/data/admin.ts`**: Admin seed data and dashboard constants

### Infrastructure (`src/lib/`)
- **`supabase/client.ts`**: Browser Supabase client
- **`supabase/server.ts`**: Server-side Supabase client (service role key, bypasses RLS)
- **`supabase/auth.ts`**: Admin authentication verification utilities
- **`supabase/database.types.ts`**: Generated Supabase type definitions
- **`utils.ts`**: `cn()` (Tailwind class merging), `formatPKR()` (currency formatting)
- **`constants.ts`**: BRAND, BREAKPOINTS, ROUTES, layout dimensions
- **`transformers.ts`**: Data transformation utilities

### Types (`src/types/`)
- **`product.ts`**: Product, CartItem, Category, ProductStatus, ProductBadge types
- **`order.ts`**: Order, OrderItem, OrderStatus types
- **`admin.ts`**: DashboardStats, StatsCardConfig, ChartDataPoint, AdminSidebarLink types

### Hooks (`src/hooks/`)
- **`useCarousel.ts`**: Generic carousel logic
- **`useHeroSlider.ts`**: Hero section slider with autoplay
- **`useProductImageCarousel.ts`**: Product gallery carousel
- **`useProductTabs.ts`**: Product tab navigation
- **`useScrollReveal.ts`**: Intersection Observer scroll animations

## Conventions
- **Imports:** `@/*` path alias to `src/`, prefer absolute imports
- **Naming:** PascalCase for components, camelCase for utilities, kebab-case for route folders
- **Styling:** Tailwind CSS with `cn()` utility for conditional classes
- **State:** Zustand stores with `persist` middleware for localStorage sync
- **Forms:** React Hook Form + Zod validation schemas
- **Animations:** Framer Motion with `initial/animate/exit` props
- **Server Components:** Default for pages, mark interactive parts with `'use client'`
- **API Routes:** RESTful methods, consistent error handling with `{ error: string }` responses
- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)

## Key Files (read these first for context)
1. `src/app/layout.tsx` — Root layout with Poppins font, metadata, Sonner toaster, GA script
2. `src/app/(public)/page.tsx` — Homepage (Server Component) with Supabase data fetching
3. `src/app/admin/(dashboard)/page.tsx` — Admin dashboard with real-time stats
4. `src/stores/cartStore.ts` — Cart state with localStorage persistence + Supabase sync
5. `src/stores/adminStore.ts` — Admin CRUD operations via API routes
6. `src/middleware.ts` — Supabase session refresh + admin route protection
7. `prisma/schema.prisma` — Database schema (5 models: Product, Customer, Order, OrderItem, Cart)
8. `src/lib/supabase/server.ts` — Server client with service role key
9. `src/app/api/orders/route.ts` — Order creation (guest checkout) and listing (admin)
10. `src/app/api/products/route.ts` — Product listing (public) and creation (admin)

## Risk Areas
- **Prisma migration pending:** Database schema changes (productType, subcategory, sizeSystem, sizeStock string sizes) require manual migration due to database configuration issues
- **Admin authentication:** Supabase Auth with middleware protection — verify session handling in production
- **Cart store coupling:** `cartStore.ts` is central to ecommerce flow; changes affect checkout, drawer, and product pages
- **Supabase RLS policies:** Database security depends on proper Row Level Security configuration
- **Image uploads:** `upload-image` API route — verify storage bucket permissions and size limits
- **Environment variables:** Requires `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Performance:** Homepage uses `dynamic()` imports; ensure loading states prevent layout shift
- **Security headers:** CSP in `next.config.js` allows `'unsafe-eval'` and `'unsafe-inline'` — review for production

## Domain Glossary
- **Intikhab:** Brand name (Urdu for "Selection") — Pakistan's online shoe store
- **Product Type:** Top-level categorization: `shoes`, `bags`, `accessories`, `clothing`
- **Category:** Gender/audience categorization: `men`, `women`, `kids`, `unisex`
- **Subcategory:** Style categorization per product type (e.g., `sneakers`, `formal`, `handbags`)
- **Size System:** Size format: `eu`, `uk`, `us`, `bag`, `general`, `numeric`
- **ProductBadge:** Visual tags on products: `SALE`, `NEW`, or null
- **OrderStatus:** `Pending` → `Processing` → `Shipped` → `Delivered`
- **PKR:** Pakistani Rupees — currency formatting used throughout
- **INK-XXX:** Order ID format (e.g., `INK-ABC123`)

## Testing
- **Command to run tests:** No test suite configured yet
- **Command to run lint:** `npm run lint`
- **Command to build:** `npm run build`
- **Database seed:** `npm run db:seed` or `npx prisma seed`
- **Test patterns:** None established — recommend adding Vitest + Testing Library + Playwright

## When to Re-Analyze
Re-run this analysis when: major dependencies updated (Next.js 15, Prisma 8), new feature modules added (payments, inventory), architectural patterns shift (server actions adoption), or database schema changes significantly.
