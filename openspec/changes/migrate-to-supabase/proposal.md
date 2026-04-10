## Why

Intikhab currently runs on static TypeScript files (`src/data/products.ts`, `src/data/admin.ts`) with Zustand stores using localStorage. This means no real-time inventory management, no persistent cross-device cart, no user accounts, and no ability for admins to add products or manage orders through a real database. To become a production-ready ecommerce platform, we need a proper backend with Supabase (PostgreSQL + Auth + Storage) while keeping the free tier in mind.

## What Changes

- **Database layer**: Replace static JSON data with Supabase Postgres tables (products, orders, customers, carts)
- **Authentication**: Add Supabase Auth for admin access; guest checkout remains for customers
- **Image storage**: Move product images from `public/` to Supabase Storage bucket with public read / admin write
- **Admin dashboard**: Connect existing admin UI to Supabase (create/update products, view orders) instead of in-memory Zustand store
- **Cart & wishlist**: Persist guest cart in localStorage as-is; sync to Supabase `carts` table when user is authenticated
- **Order creation**: Checkout flow inserts orders into Supabase instead of sessionStorage
- **Environment variables**: Add Supabase credentials, service_role key kept server-side only
- **No UI changes**: All existing Tailwind classes, component structure, and page layouts remain untouched

## Capabilities

### New Capabilities
- `supabase-database`: Database schema, RLS policies, and migrations for products, orders, customers, and carts
- `supabase-auth`: Supabase Auth integration for admin access and optional customer accounts
- `supabase-storage`: Product image upload and serving via Supabase Storage bucket
- `supabase-api`: Server-side Supabase client for data fetching in Next.js server components and API routes

### Modified Capabilities
- *(none — no existing specs to modify)*

## Impact

- **Affected files**: `src/data/` (static files become seed scripts), `src/stores/` (cart/wishlist stores gain Supabase sync), `src/components/admin/` (API calls instead of Zustand mutations), `src/app/` (server components fetch from Supabase)
- **New dependencies**: `@supabase/supabase-js`, `@supabase/ssr`, `@prisma/client`, `prisma`
- **New directories**: `prisma/` (schema, migrations, seed scripts), `src/lib/supabase/` (client & server utilities)
- **Environment**: Requires Supabase project (Singapore region), `.env.local` with URL/keys, Vercel env vars for production
- **No breaking changes to UI**: All component props, Tailwind classes, and page structures preserved
