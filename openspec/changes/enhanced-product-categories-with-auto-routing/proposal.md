# Enhanced Product Categories with Auto-Routing

## Problem

The current admin product form has a simple category dropdown (men/women/kids) which is insufficient for a growing ecommerce platform. The owner needs:

1. **Hierarchical product categorization** — Products need a product type (shoes, bags, accessories, etc.) in addition to gender category
2. **Size requirements** — Currently sizes are hardcoded (35–40), but different product types need different size systems (EU numeric for shoes, S/M/L for bags, one-size for accessories)
3. **Automatic page routing** — When adding a men's shoe, it should automatically be routed to the men's shoes page; when adding a women's bag, it should go to the women's bags section
4. **Per-product-type size management** — The cart and order system must support string-based sizes (e.g., "38", "M", "One Size") instead of only integers, and allow the same product in different sizes to coexist in a cart

## Solution

Implement a three-level category system with automatic page routing and full size-system support:

```
Product Type → Gender Category → Subcategory
   (Shoes)   →    (Men)        →  (Sneakers)
   (Bags)    →    (Women)      →  (Handbags)
```

### Key Features

#### 1. Enhanced Product Schema
- `productType`: shoes, bags, accessories, clothing, fragrances, etc.
- `category`: men, women, kids, unisex
- `subcategory`: sneakers, formal, casual, sandals, handbags, wallets, etc. (depends on product type)
- `sizeSystem`: eu, uk, us, inches, cm, general (depends on product type)
- `sizeStock` converted from `[{size: number, stock: number}]` to `[{size: string, stock: number}]` to support non-numeric sizes like "S", "M", "L", "One Size"

#### 2. Cart and Order Schema Updates (BREAKING)
- `Cart.size`: change from `Int?` to `String?` to support string sizes
- `Cart` unique constraint: change from `unique(customerEmail, productId)` to `unique(customerEmail, productId, size)` so users can add the same product in different sizes (e.g., Size 36 and Size 38 of the same shoe)
- `OrderItem.size`: change from `Int` to `String` to store the ordered size as a string
- **Data migration**: existing cart and order records must have their `size` values converted from integers to strings (e.g., `37` → `"37"`)

#### 3. Shoe-Specific Admin Form
- When admin selects "Add Shoe", required fields: name, price, SKU, category (men/women/kids), and **shoe sizes with quantities**
- Shoe sizes are **numeric only** (EU 35–46) — no S/M/L or one-size options
- Each size has its own quantity field (Size 35: 5 units, Size 36: 3 units, etc.)
- Other product types (bags, accessories) can use different size systems (S/M/L, one-size)
- **Edit flow**: existing products (shoes with sizes 35–40) must be editable with the new form, pre-populating cascading selects, converting existing numeric sizes to strings, and showing the full 35–46 size grid
- Modal width increased from `max-w-2xl` to `max-w-4xl` or converted to a multi-step form to accommodate cascading selects, 12-field size grid, and routing preview without cramping

#### 4. Automatic Page Routing
- New dynamic route `[productType]/[category]/page.tsx` replaces existing `/men`, `/women`, `/kids` pages
- Old routes redirect with 301 to preserve SEO and bookmarks
- URL structure: `/shoes/men`, `/bags/women`, `/accessories/kids`, `/shoes/men/sneakers`
- Subcategory is optional — products without a subcategory appear on the category landing page (`/shoes/men`) in a "General" section
- Validation functions `isValidProductType()` and `isValidCategory()` for explicit 404 handling on invalid URLs (e.g., `/fragrances/men` returns 404)

#### 5. Slug Uniqueness Strategy
- Slug generation: `{productType}-{name-slug}` (e.g., `shoes-black-sneaker`, `bags-classic-tote`)
- On creation, check for existing slugs and append a numeric suffix if collision detected (e.g., `shoes-black-sneaker-2`)

#### 6. API Route Updates
- `transformProduct` functions in all API routes updated to cast `sizeStock` as `{ size: string; stock: number }[]` instead of `number[]`
- `POST /api/products` and `PUT /api/products/[id]` accept and return `sizeStock` with string sizes
- `POST /api/orders` and `GET /api/orders/[id]` handle `size` as a string field
- `POST /api/cart` and `GET /api/cart` handle `size` as a string field

#### 7. Product Detail Page Updates
- PDP (`product/[slug]/page.tsx`) updated to display `productType`, `subcategory`, and the correct size selector based on `sizeSystem`
- Size selector renders EU numeric sizes for shoes, labeled sizes (S/M/L) for bags, or "One Size" for accessories
- Size selector passes string sizes to `cartStore.addItem(product, size)`

#### 8. Admin Form Enhancements
- Cascading dropdowns: Product Type → Category → Subcategory
- Size input changes dynamically based on product type selection
- Visual preview of where the product will appear (e.g., "This product will appear at `/shoes/men/sneakers`")
- Routing preview updates live as the admin changes dropdowns

#### 9. SEO Metadata for Dynamic Routes
- `generateMetadata` functions on `[productType]/[category]/page.tsx` produce unique titles and descriptions per combination (e.g., "Men's Sneakers | Intikhab" for `/shoes/men/sneakers`)
- Open Graph tags generated dynamically for category pages

## Why This Matters

- **Scalability**: Supports future product expansion beyond just shoes
- **User Experience**: Customers can browse by product type then filter by gender
- **Admin Efficiency**: Owner can see exactly where products will appear and manage sizes per product type
- **SEO**: Better URL structure with descriptive paths and unique metadata per category
- **Cart Flexibility**: Users can add the same product in different sizes, and sizes support non-numeric values

## What Changes

### Database
- Add `productType` (String), `subcategory` (String?), `sizeSystem` (String) columns to Product model
- Convert `sizeStock` from `Int[]` sizes to `Json` with `{size: string, stock: number}` entries
- Add composite indexes on `(productType, category, subcategory)`
- **Cart model**: change `size` from `Int?` to `String?`, update unique constraint to `unique(customerEmail, productId, size)`
- **OrderItem model**: change `size` from `Int` to `String`
- Migration: set all existing products to `productType = 'shoes'`, convert size numbers to strings, set `sizeSystem = 'eu'`, migrate existing cart/order sizes to strings

### TypeScript Types
- New `ProductType` enum: `'shoes' | 'bags' | 'accessories' | 'clothing' | 'fragrances'`
- Expand `Category` to include `'unisex'`
- `SizeStock.size` changes from `number` to `string`
- New `SizeSystem` type: `'eu' | 'uk' | 'us' | 'inches' | 'cm' | 'general'`
- `CartItem.size` changes from `number` to `string`
- `OrderItem.size` changes from `number` to `string`

### Configuration
- New `src/lib/sizeSystems.ts` with `PRODUCT_TYPE_CONFIG` and `SIZE_SYSTEMS` mapping product types to their size systems, subcategories, and validation rules
- Validation functions `isValidProductType()`, `isValidCategory()`, `getSubcategories(productType)`

### Routes
- New `src/app/(public)/[productType]/[category]/page.tsx` (dynamic category pages)
- Old `/men`, `/women`, `/kids` pages become 301 redirects to `/shoes/men`, `/shoes/women`, `/shoes/kids`
- `[...slug]` catch-all route preserved for 404/coming-soon pages — Next.js routing precedence ensures specific routes match first

### Admin Components
- `AddProductModal.tsx`: cascading selects, dynamic size inputs (shoe grid vs. general input), routing preview, wider modal (`max-w-4xl`)
- `ProductsTable.tsx`: display product type and subcategory columns
- Edit flow: pre-populate cascading selects, convert existing numeric sizes to strings, show full size grid

### Storefront Components
- `ProductDetailPage.tsx`: display product type, subcategory, and correct size selector based on `sizeSystem`
- `SizeSelector.tsx`: render numeric or labeled sizes based on product type
- `CategoryPageLayout.tsx`: filter by product type, category, subcategory
- `ProductCard.tsx`: display subcategory badge

### API Routes
- `POST /api/products`: accept `productType`, `subcategory`, `sizeSystem`, `sizeStock` with string sizes
- `PUT /api/products/[id]`: handle updates to new fields
- `GET /api/products`: return `productType`, `subcategory`, `sizeSystem`, string-based `sizeStock`
- `POST /api/orders`, `GET /api/orders/[id]`: handle `size` as string in order items
- `POST /api/cart`, `GET /api/cart`: handle `size` as string in cart items
- All `transformProduct` functions updated for string sizes

## Non-Goals

- Full inventory management system
- Multi-level nesting beyond 3 levels
- Category drag-and-drop reordering
- Automatic category creation (categories must be predefined)
- Product type switching after creation (a shoe cannot become a bag — would require data migration)
- Real-time stock sync to the product detail page during checkout (handled by separate auto-stock-deduction change)

## Implementation Phases (Estimated)

1. **Database Schema** (2 hours): Prisma migration for Product, Cart, OrderItem changes + data migration
2. **TypeScript Types + Config** (1.5 hours): New types, `sizeSystems.ts`, validation functions
3. **API Routes** (2 hours): Update all product, order, cart routes for new fields and string sizes
4. **Admin Form** (4 hours): Cascading selects, dynamic size inputs, routing preview, edit flow, wider modal
5. **Product Detail Page** (1.5 hours): Display new fields, dynamic size selector
6. **Dynamic Routing** (2 hours): `[productType]/[category]` pages, redirects, 404 handling, SEO metadata
7. **Category Pages + Navigation** (2 hours): Updated category layouts, navigation links, breadcrumbs
8. **Testing** (2 hours): End-to-end testing of add/edit product, cart with multiple sizes, ordering, routing

**Total estimated effort**: ~17 hours
