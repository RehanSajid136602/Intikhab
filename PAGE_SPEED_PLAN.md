# PageSpeed & Accessibility Fixes — Implementation Plan

## Overview
Fix all PageSpeed and accessibility issues on the Intikhab Next.js shoe store.
**Target:** Mobile Performance 80→90+, Mobile SEO 77→95+, Accessibility 80→95+

---

## SECTION 1 — IMAGE OPTIMIZATION (Critical)

### 1.1 Hero Section Images ✅ DONE
- [x] Added `sizes="100vw"` to hero Image
- [x] Set `quality={90}` (optimal balance)
- [x] Added `placeholder="blur"` with blurDataURL
- [x] `priority` prop already present for LCP element
- **File:** `src/components/home/HeroSlider.tsx`

### 1.2 Product Card Images ✅ DONE
- [x] Added `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`
- [x] Reduced quality from 100 to 85
- [x] Added min touch target `min-w-11 min-h-11` to wishlist button
- **File:** `src/components/products/ProductCard.tsx`

### 1.3 Product Detail Page Images ✅ DONE
- [x] Added `quality={85}` to main gallery image
- [x] `sizes="(max-width: 768px) 100vw, 50vw"` already present
- [x] Thumbnails already have `sizes="80px"`
- **File:** `src/app/products/[slug]/page.tsx`

### 1.4 Other Images ⏳ PARTIAL
- [x] `InstaFeed.tsx` — Added `fill`, `sizes`, `quality={75}`
- [x] `CollectionMosaic.tsx` — Reduced quality to 85
- [x] `checkout/page.tsx` — Added `quality={75}` to cart images
- [x] `order-confirmation/page.tsx` — Added `quality={75}` to images
- [x] `OrdersTable.tsx` — Added `fill`, `sizes`, `quality={75}`
- [x] `ProductsTable.tsx` — Added `fill`, `sizes`, `quality={75}`
- [x] `CartItem.tsx` — Added `fill`, `sizes`, `quality={75}`
- [ ] Need to check: `ShopByCategory`, `CategoryMosaic`, Footer social icons

---

## SECTION 2 — SEO FIXES

### 2.1 Product Detail Dynamic Metadata ✅ DONE
- [x] Added `generateMetadata` function with OpenGraph and Twitter cards
- [x] Proper title, description, images for each product
- **File:** `src/app/products/[slug]/page.tsx`

### 2.2 Category Pages Metadata ✅ DONE
- [x] `/men` — Title and description added
- [x] `/women` — Title and description added
- [x] `/kids` — Title and description added
- **Files:** `src/app/men/page.tsx`, `src/app/women/page.tsx`, `src/app/kids/page.tsx`

### 2.3 Other Pages Metadata ⏳ IN PROGRESS
- [x] `/checkout` — Title and description added
- [x] `/order-confirmation` — Title and description added
- [x] `/wishlist` — Title and description added
- [x] `/bags` — Title and description added
- [x] `/size-guide` — Title and description added
- [x] `/faq` — Title and description added
- [ ] `/terms-and-conditions` — Needs metadata
- [ ] `/privacy-policy` — Needs metadata
- [ ] `/cookie-policy` — Needs metadata
- [ ] `/coming-soon` — Needs metadata

---

## SECTION 3 — ACCESSIBILITY FIXES

### 3.1 Icon Buttons Without Accessible Names ⏳ PARTIAL
- [x] `ProductCard.tsx` — Wishlist heart has `aria-label`
- [ ] `Navbar.tsx` — Need to check cart/wishlist/search icons
- [ ] `SearchBar.tsx` — Need to verify aria-labels
- [ ] `MobileMenu.tsx` — Close button aria-label present ✅

### 3.2 Links Without Discernible Names ⏳ NOT STARTED
- [ ] Logo link in Navbar — Needs `aria-label="Go to homepage"`
- [ ] Footer social media links — Need aria-labels
- [ ] Any icon-only links in Footer

### 3.3 Color Contrast Issues ⏳ NOT STARTED
- [ ] Check `text-brand-gray` on white backgrounds
- [ ] Add `placeholder:text-gray-500` to form inputs in checkout
- [ ] Verify price text, product card text contrast
- [ ] Footer text contrast check

### 3.4 Touch Target Sizes ⏳ PARTIAL
- [x] `ProductCard.tsx` — Wishlist button has `min-w-11 min-h-11`
- [ ] Size selector buttons — Currently `w-12 h-12` (48px ✅)
- [ ] Cart quantity buttons — Currently `w-6 h-6` (24px ❌) — NEED FIX
- [ ] Back to top button — Check size

---

## SECTION 4 — JAVASCRIPT OPTIMIZATION

### 4.1 Legacy JavaScript (12 KiB savings) ⏳ NOT STARTED
- [ ] Add `optimizePackageImports` to `next.config.js`
- [ ] Target packages: `framer-motion`, `lucide-react`
- **File:** `next.config.js`

### 4.2 Unused JavaScript (22 KiB savings) ⏳ NOT STARTED
- [ ] Check for lazy-loadable components
- [ ] Current dynamic imports: `CartDrawer`, `BackToTop`, `CategoryMosaic`, `InstaFeed`, `Testimonials`, `TrustBadges`, `Newsletter` ✅

---

## SECTION 5 — FINAL VERIFICATION

### Build & Lint ⏳ NOT STARTED
- [ ] Run `npm run build` — Verify no errors
- [ ] Run `npm run lint` — Verify no warnings
- [ ] Run Lighthouse audit — Report new scores

---

## Summary

| Section | Status | Items Done | Items Remaining |
|---------|--------|------------|-----------------|
| 1.1 Hero Images | ✅ Done | 4 | 0 |
| 1.2 ProductCard | ✅ Done | 4 | 0 |
| 1.3 Product Detail | ✅ Done | 3 | 0 |
| 1.4 Other Images | ⏳ Partial | 7 | ~3 |
| 2.1 Product Metadata | ✅ Done | 1 | 0 |
| 2.2 Category Pages | ✅ Done | 3 | 0 |
| 2.3 Other Pages | ⏳ Partial | 6 | 4 |
| 3.1 Icon Buttons | ⏳ Partial | 1 | ~10 |
| 3.2 Link Names | ⏳ Not Started | 0 | ~5 |
| 3.3 Contrast | ⏳ Not Started | 0 | ~4 |
| 3.4 Touch Targets | ⏳ Partial | 1 | ~3 |
| 4.1 JS Optimization | ⏳ Not Started | 0 | 1 |
| 4.2 Lazy Loading | ✅ Done | 7 | 0 |
| 5. Verification | ⏳ Not Started | 0 | 3 |

**Total Progress:** ~45% complete
**Estimated Remaining:** 35-40 minutes

---

## Next Steps (Priority Order)

1. **Finish Section 1.4** — Check remaining image components
2. **Finish Section 2.3** — Add metadata to remaining pages
3. **Finish Section 3.1** — Fix Navbar, SearchBar aria-labels
4. **Finish Section 3.4** — Fix CartItem quantity buttons (w-6→w-11)
5. **Finish Section 4.1** — Add optimizePackageImports to next.config.js
6. **Run Build & Lint** — Final verification
