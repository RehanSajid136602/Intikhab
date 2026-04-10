## Why

The Intikhab shoe brand currently exists only as a static HTML prototype (`index.html`) with Tailwind CDN — no routing, no state management, no cart system, no admin panel, and no production-grade architecture. This blocks the brand from operating as a real ecommerce platform. We need a complete Next.js 14 application that pixel-matches the approved HTML design while adding a fully functional cart system (Zustand), an admin panel with CRUD operations, and production-ready performance optimizations.

## What Changes

- **Scaffold Next.js 14 App Router project** with TypeScript strict mode, Tailwind CSS v3, and all specified dependencies (Framer Motion, Zustand, Lucide React, Sonner, TanStack Table, Recharts, React Hook Form + Zod)
- **Migrate static HTML → React components** — every section from the approved `index.html` becomes a typed, reusable React component with Framer Motion entrance animations
- **Implement cart system** — Zustand-backed cart drawer with add/remove/update quantity, live navbar badge count, and empty state
- **Build admin panel** at `/admin` route with separate layout (sidebar + topbar), dashboard stats, revenue charts (Recharts), orders table (TanStack Table), and product management with add/edit modal (React Hook Form + Zod validation)
- **Extract design tokens** from the approved HTML into `tailwind.config.ts` (colors, fonts, animations, spacing)
- **Implement full responsive behavior** matching the HTML's mobile/tablet/desktop breakpoints
- **Add all interactions** — hero slider auto-advance, tab switching, mobile menu drawer, search overlay, announcement bar close, newsletter form validation

## Capabilities

### New Capabilities

- `homepage-rendering`: Pixel-perfect rendering of all 12 homepage sections from the approved HTML design, including hero slider, product tabs, category mosaics, trust badges, newsletter, and footer
- `cart-management`: Zustand-backed cart system with add-to-cart from product cards, cart drawer slide-in, quantity controls, item removal, subtotal calculation, and live navbar badge
- `admin-dashboard`: Admin panel at `/admin` with dashboard stats cards, revenue area chart (Recharts), and recent orders table with sorting, search, and pagination (TanStack Table)
- `admin-product-management`: Product CRUD via admin panel — products table with image thumbnails, category filtering, status toggles, and add/edit product modal with Zod-validated form (React Hook Form)
- `admin-order-management`: Orders management with full table view, status filter tabs, order detail modal with line items, and status update workflow
- `navigation-and-routing`: Sticky navbar with mega dropdown menus, mobile slide-in menu, search overlay, client-side routing via Next.js App Router, and 404 page

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- **New codebase**: Entire `src/` directory created from scratch (~80+ component files, stores, types, data, lib utilities)
- **Existing assets**: `public/` folder images referenced as-is with `/` prefix paths; `index.html` serves as the single source of truth for design fidelity
- **Tech stack shift**: Static HTML/CSS/JS → Next.js 14 App Router + TypeScript + Tailwind + Zustand + Framer Motion
- **Deployment**: Vercel-ready with `vercel.json` configuration
- **No breaking changes**: This is a greenfield project — the static HTML file remains as a reference artifact only
