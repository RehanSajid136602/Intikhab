## Context

The current Intikhab website is a single static HTML file (`index.html`) using Tailwind CDN, Google Fonts (Poppins), and vanilla JavaScript for interactions (hero slider, tab switching, mobile menu). The `public/` directory contains 30 images (shoe product photos, lifestyle shots, a video). There is no backend, no routing, no state management, and no admin interface.

The target is a production-grade Next.js 14 ecommerce frontend with a fully functional client-side cart system, an admin panel with mock CRUD operations, and pixel-perfect visual fidelity to the approved HTML.

## Goals / Non-Goals

**Goals:**
- Pixel-perfect match of the approved `index.html` — every color, font size, spacing value, hover state, and animation timing
- Full responsive behavior at 375px (mobile), 768px (tablet), and 1440px (desktop) breakpoints
- Zustand cart store with reactive navbar badge, cart drawer, and quantity controls
- Admin panel at `/admin` with separate layout, dashboard stats, charts (Recharts), and full TanStack Table v8 implementations for orders and products
- Zod-validated product add/edit modal with React Hook Form
- Framer Motion entrance animations on every major section
- Zero TypeScript errors, zero `any` types, zero inline styles
- Vercel deployment ready

**Non-Goals:**
- No backend API or database — all data is mock/static (Zustand stores)
- No authentication — admin panel is unauthenticated for client preview
- No payment integration — checkout button is visual only
- No real image upload — product form image upload UI shows previews only
- No real Instagram integration — InstaFeed uses static images from `/public/`
- No SEO/meta tag optimization beyond basic Next.js defaults

## Decisions

### 1. Next.js 14 App Router (not Pages Router)
**Decision**: Use App Router with `layout.tsx` and `page.tsx` pattern.
**Rationale**: App Router provides React Server Components by default, better data fetching patterns, and is the recommended Next.js approach. The admin panel uses a separate `app/admin/layout.tsx` to isolate its layout from the main site.
**Alternatives considered**: Pages Router — rejected because it's legacy and lacks RSC benefits.

### 2. Zustand over Redux Toolkit / Context API
**Decision**: Zustand for all client-side state (cart, admin data, UI state).
**Rationale**: Zustand requires minimal boilerplate (no providers, no action types), has excellent TypeScript support, and re-renders only the components that subscribe to the specific slice they need. Perfect for a project of this scale.
**Alternatives considered**: Context API — rejected due to unnecessary re-renders. Redux Toolkit — overkill for this scope.

### 3. Framer Motion for all animations
**Decision**: Every section gets Framer Motion entrance animations using `useInView` + `motion.div` with `once: true`.
**Rationale**: Framer Motion provides declarative animation APIs that work seamlessly with React's render cycle. `useInView` replaces manual IntersectionObserver. `AnimatePresence` handles mount/unmount transitions (cart drawer, mobile menu).
**Alternatives considered**: CSS-only animations — insufficient for mount/unmount transitions. GSAP — heavier bundle, imperative API.

### 4. TanStack Table v8 for admin tables
**Decision**: Full TanStack Table v8 (headless) with custom UI rendering for sorting, pagination, filtering, and row selection.
**Rationale**: TanStack Table is the industry standard for React tables. It's headless (no built-in UI), giving us full control over styling while providing sorting, filtering, pagination, and row selection utilities.
**Alternatives considered**: Custom table implementation — rejected due to reinventing sorting/pagination logic.

### 5. React Hook Form + Zod for product form
**Decision**: React Hook Form for form state management with Zod schema validation via `@hookform/resolvers`.
**Rationale**: React Hook Form minimizes re-renders by using uncontrolled inputs. Zod provides runtime type validation that doubles as TypeScript type inference. Together they give us type-safe forms with minimal boilerplate.
**Alternatives considered**: Formik — heavier, more re-renders. Plain controlled inputs — no validation framework.

### 6. Tailwind config extracted from HTML
**Decision**: All colors, fonts, spacing values, and animations from `index.html` are extracted into `tailwind.config.ts` as named design tokens.
**Rationale**: The HTML file is the single source of truth. Extracting its tokens ensures the React app matches pixel-for-pixel. Custom tokens are namespaced under `brand.*` to avoid conflicts.
**Key tokens identified from HTML**:
- Colors: `accent-red: #E53935`, `accent-dark: #1A1A1A`, `text-gray: #6B7280`, `border-light: #E8E8E8`, green: `#2ECC71`, bg-light: `#F7F7F7`
- Font: Poppins (weights 300, 400, 500, 600, 700)
- Animations: `marquee` (20s linear infinite), `blink` (1s infinite)
- Spacing: `py-10`, `py-12`, `py-16` section paddings; `gap-2`, `gap-3`, `gap-4` grid gaps

### 7. Lucide React for icons only
**Decision**: Lucide React exclusively — no other icon libraries, no emojis as icons.
**Rationale**: Consistent stroke-based icons with a unified visual language. The HTML uses inline SVGs; we replace them with Lucide equivalents for maintainability.

### 8. Sonner for notifications
**Decision**: Sonner toast notifications for all admin CRUD actions (add, edit, delete success/error).
**Rationale**: Sonner is lightweight, has beautiful default styling, stacks toasts elegantly, and integrates cleanly with any React app.

### 9. Image strategy: next/image with explicit sizes
**Decision**: All product and lifestyle images use `next/image` with explicit `sizes` props. Hero slider's first image has `priority={true}`. All others lazy-load by default.
**Rationale**: Prevents layout shift (CLS), enables automatic WebP/AVIF optimization, and ensures proper LCP scoring.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pixel drift between HTML and React components | High | Side-by-side comparison during development; extract every hardcoded value from HTML into Tailwind config |
| Framer Motion bundle size (~10KB gzipped) | Medium | Tree-shaking enabled; only import used animations. Acceptable for the animation density required |
| Zustand state not persisted across page reloads | Medium | Out of scope for this phase — cart persistence via localStorage can be added in a follow-up |
| TanStack Table v8 learning curve | Medium | Well-documented API; headless approach means we control all rendering |
| Admin panel without auth exposes mock data | Low | Explicitly documented as non-goal — auth can be added later |
| Large number of components (~80 files) | Medium | Strict 9-phase implementation order prevents circular dependency chaos |
| Mobile responsive matching HTML | High | HTML already has mobile classes; replicate them exactly with Tailwind's responsive prefixes |
