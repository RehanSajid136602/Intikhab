## 1. Project Setup & Foundation

- [x] 1.1 Initialize Next.js 14 project with `npx create-next-app@latest` using TypeScript, Tailwind CSS, App Router, and `src/` directory
- [x] 1.2 Install all dependencies: `framer-motion`, `zustand`, `lucide-react`, `sonner`, `@tanstack/react-table`, `recharts`, `react-hook-form`, `@hookform/resolvers`, `zod`
- [x] 1.3 Configure `tsconfig.json` with `strict: true` and path aliases (`@/*` → `src/*`)
- [x] 1.4 Create `tailwind.config.ts` with all design tokens extracted from `index.html` (colors: brand-red #E53935, brand-dark #1A1A1A, brand-gray #6B7280, border-light #E8E8E8, brand-green #2ECC71, brand-light-gray #F7F7F7; font: Poppins; animations: marquee, blink)
- [x] 1.5 Create `src/app/globals.css` with Tailwind imports, base resets, and custom CSS rules from the HTML (marquee keyframes, blink keyframes, slide transitions, dropdown transitions, category hover states, insta hover states)
- [x] 1.6 Create all TypeScript types in `src/types/product.ts` (Product, CartItem, Category), `src/types/order.ts` (Order, OrderItem, OrderStatus), `src/types/admin.ts` (DashboardStats, ChartDataPoint)
- [x] 1.7 Create mock data files: `src/data/products.ts` (10 products from HTML), `src/data/navigation.ts` (nav links + mega menu structure), `src/data/admin.ts` (15 mock orders, dashboard stats, weekly revenue)
- [x] 1.8 Create utility functions in `src/lib/utils.ts` (cn() class merger, formatPKR() currency formatter) and `src/lib/constants.ts` (brand colors, breakpoints, slider timing)

## 2. Zustand Stores

- [x] 2.1 Create `src/stores/cartStore.ts` with Zustand store: items array, isOpen boolean, addItem, removeItem, updateQuantity, clearCart, toggleCart, computed totalItems and totalPrice
- [x] 2.2 Create `src/stores/adminStore.ts` with Zustand store: products array, orders array, addProduct, updateProduct, deleteProduct, updateOrderStatus, computed filteredProducts and filteredOrders
- [x] 2.3 Create `src/stores/uiStore.ts` with Zustand store: mobileMenuOpen, searchOpen, cartDrawerOpen, activeHeroSlide, activeTab states with toggle/set methods

## 3. UI Primitives (src/components/ui/)

- [x] 3.1 Create `Button.tsx` with variants: primary, secondary, ghost, danger. Support size prop (sm, md, lg). Include disabled state
- [x] 3.2 Create `Input.tsx` with optional label, error message display, and focus:border-brand-dark styling
- [x] 3.3 Create `Badge.tsx` with color variants (red, green, blue, yellow, purple) for status badges
- [x] 3.4 Create `Modal.tsx` as a generic modal wrapper with AnimatePresence, dark overlay, close on overlay click, escape key handler
- [x] 3.5 Create `Tabs.tsx` as a compound component (Tabs.List, Tabs.Trigger, Tabs.Content) with active tab underline animation
- [x] 3.6 Create `SectionTitle.tsx` with centered title text, em-dash prefix/suffix, and optional subtitle
- [x] 3.7 Create `Skeleton.tsx` with variants: rect (for images), circle (for avatars), text (for lines) using animate-pulse

## 4. Custom Hooks

- [x] 4.1 Create `useHeroSlider()` — manages current slide index, auto-advance interval (5s), next/prev navigation, dot click handler, pause on hover
- [x] 4.2 Create `useProductTabs()` — manages active tab state, tab click handler, with initial tab default
- [x] 4.3 Create `useScrollReveal()` — wraps IntersectionObserver with useInView from Framer Motion, returns ref and isInView boolean
- [x] 4.4 Create `useCarousel()` — manages scroll position, next/prev navigation, arrow visibility based on scroll boundaries

## 5. Layout Components (src/components/layout/)

- [x] 5.1 Create `AnnouncementBar.tsx` — red marquee bar with infinite scrolling text (CSS animation), close button that removes the bar from DOM
- [x] 5.2 Create `UtilityBar.tsx` — top contact bar with phone, email, track order, store locator, free delivery text. Hidden on mobile except phone
- [x] 5.3 Create `Navbar.tsx` — sticky top nav with logo (centered on desktop), all nav links with mega dropdowns, search/account/wishlist/cart icons with live cart badge, responsive mobile hamburger button
- [x] 5.4 Create `MobileMenu.tsx` — full-screen slide-in drawer from left with all nav links, close button, overlay. Framer Motion x: "-100%" → "0%"
- [x] 5.5 Create `SearchBar.tsx` — slide-down search input below nav links, toggles on search icon click, auto-focus on open
- [x] 5.6 Create `Footer.tsx` — 5-column grid (2 on mobile) with Get In Touch, Quick Links, Help, Collections, Legal sections. Social media SVG icons, payment methods row, copyright

## 6. Product Components (src/components/products/)

- [x] 6.1 Create `ProductBadge.tsx` — absolute positioned badge component (SALE in red, NEW in green) with uppercase tracking-wider text
- [x] 6.2 Create `ProductCard.tsx` — product card with wishlist heart, image, brand, title, price, installment, ADD TO CART on hover
- [x] 6.3 Create `ProductCarousel.tsx` — scrollable horizontal carousel wrapper with prev/next arrow buttons

## 7. Cart Components (src/components/cart/)

- [x] 7.1 Create `CartItem.tsx` — single cart line item with 40×40px image, product name, price, quantity controls, remove button
- [x] 7.2 Create `CartSummary.tsx` — subtotal line with PKR formatting, PROCEED TO CHECKOUT button, CONTINUE SHOPPING link
- [x] 7.3 Create `CartDrawer.tsx` — fixed right sidebar, Framer Motion x: "100%" → "0%", dark overlay, items list, empty state

## 8. Homepage Sections (src/components/home/)

- [x] 8.1 Create `HeroSlider.tsx` — full-bleed 3-slide carousel with auto-advance, arrows, dots, Framer Motion fade
- [x] 8.2 Create `GenderTabs.tsx` — MEN/WOMEN/KIDS tabs with product grid, AnimatePresence transition
- [x] 8.3 Create `CategoryMosaic.tsx` — 5-cell CSS grid with hover effects (image scale, overlay, shop now text)
- [x] 8.4 Create `NewCollection.tsx` — bg-[#F7F7F7] section with MEN/WOMEN/KIDS tabs and product grid
- [x] 8.5 Create `CollectionMosaic.tsx` — 5-cell mosaic with different layout, TOP SELLER badge
- [x] 8.6 Create `InstaFeed.tsx` — 4-column grid with Instagram icon overlay on hover
- [x] 8.7 Create `TrustBadges.tsx` — 4-column grid with Lucide icons, titles, subtitles
- [x] 8.8 Create `Newsletter.tsx` — brand-dark bg, email form with validation, success state

## 9. Page Assembly & Root Layout

- [x] 9.1 Create `src/app/layout.tsx` — root layout with Poppins font, Toaster, AnnouncementBar, UtilityBar, Navbar, Footer
- [x] 9.2 Create `src/app/page.tsx` — homepage with HeroSlider + all section components in exact order
- [x] 9.3 Create `src/app/not-found.tsx` — custom 404 page with "Page Not Found" heading, "Back to Home" link

## 10. Admin Layout & Shared Components (src/components/admin/)

- [x] 10.1 Create `Sidebar.tsx` — 260px dark sidebar with Lucide icons, active state with brand-red border, user avatar + logout
- [x] 10.2 Create `TopBar.tsx` — 64px sticky top bar with hamburger (mobile), page title, notification bell with badge, search, avatar
- [x] 10.3 Create `StatsCard.tsx` — metric card with title, value, change %, Lucide icon with colored bg
- [x] 10.4 Create `SalesChart.tsx` — Recharts AreaChart with gradient fill, custom tooltip, 7D/30D/90D tabs
- [x] 10.5 Create `RecentOrders.tsx` — TanStack Table v8 with sorting, search, pagination, status color badges

## 11. Admin Page Components

- [x] 11.1 Create `ProductsTable.tsx` — TanStack Table with image thumbnails, category filter, status toggle, row selection, bulk delete
- [x] 11.2 Create `AddProductModal.tsx` — React Hook Form + Zod modal with all product fields, image preview, Sonner toast
- [x] 11.3 Create admin orders table component with status filter tabs, date range filter, export button, order detail modal

## 12. Admin Pages & Routing

- [x] 12.1 Create `src/app/admin/layout.tsx` — admin layout with Sidebar (left), TopBar (sticky), content area with bg-[#F7F7F7]
- [x] 12.2 Create `src/app/admin/page.tsx` — dashboard with 4 StatsCards, SalesChart, RecentOrders table
- [x] 12.3 Create `src/app/admin/products/page.tsx` — products page with header, ProductsTable, AddProductModal
- [x] 12.4 Create `src/app/admin/orders/page.tsx` — orders page with status filters, date range, orders table, export, order detail modal

## 13. Performance & Quality

- [x] 13.1 Add `priority={true}` to hero slider's first image, `sizes` prop to all next/image components
- [x] 13.2 Add Framer Motion `useInView` animations to all homepage sections with `once: true`
- [x] 13.3 Add `prefers-reduced-motion` media query support in globals.css
- [x] 13.4 Run `npx tsc --noEmit` and fix all TypeScript errors — zero errors, zero `any` types
- [x] 13.5 Verify responsive behavior at 375px, 768px, and 1440px — all sections use Tailwind responsive prefixes
- [x] 13.6 Add `vercel.json` for Vercel deployment. Build succeeds with `npm run build` ✓
