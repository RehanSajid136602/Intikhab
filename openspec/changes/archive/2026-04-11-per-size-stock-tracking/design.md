## Context

The current `Product` model has:
- `sizes Int[]` — a plain array of available sizes (e.g., `[35, 36, 37, 38, 39, 40]`), no quantities
- `stock Int` — total inventory across all sizes combined
- `inStock Boolean` — whether the product is available at all

The `CartItem` type has an optional `size?: string` field that is never populated. The product detail page (`ProductDetailPage.tsx`) displays sizes as static labels — users can see available sizes but cannot interactively select one. The newer `ProductDetailClient.tsx` (at `/products/[slug]/`) does have a size selector, but it doesn't validate per-size stock.

**Constraints:**
- Must maintain backward compatibility: `stock` (total) must remain as sum of all size stocks
- The PostgreSQL function `create_order_with_stock_deduction` already exists and handles stock deduction — it needs to be updated for per-size logic
- Supabase stores JSON columns as `jsonb` — Prisma maps them to `Json` type
- The cart store uses localStorage persistence — `size` must be included in the persisted state

## Goals / Non-Goals

**Goals:**
- Per-size stock tracking in the database
- Customers must select a size with available stock before adding to cart
- Stock deduction on order deducts from the specific size
- Admin can manage stock per size in the product management UI
- Cart items carry the selected size through to the order

**Non-Goals:**
- Size conversion charts (already exists on separate `/size-guide` page)
- Notifications when a specific size is out of stock
- Size-based product recommendations
- Backorder / waitlist for out-of-stock sizes

## Decisions

### 1. Use JSON column `sizeStock` instead of a separate table

**Decision:** Replace `sizes Int[]` with `sizeStock Json` (stored as `jsonb`) containing `[{size: number, stock: number}]`.

**Why:** A separate table would require joins, new relations, and more complex queries. JSON keeps everything self-contained on the Product model. Postgres `jsonb` supports indexing if needed later. This is the simplest migration path.

**Alternative considered:** A `ProductSize` model with foreign key to Product. More normalized but adds complexity for a single-vendor catalog where sizes are known and limited.

### 2. `stock` field becomes a computed total, not an independent field

**Decision:** Keep `stock Int` on the Product model as the sum of all `sizeStock` quantities. The database function updates both individual size stock AND the total `stock` field for consistency.

**Why:** Existing queries, admin tables, and storefront components rely on `stock` for display. Making it a computed value ensures consistency without rewriting every query.

### 3. Add `size` column to `order_items`

**Decision:** Add a new `size Int` column to the `OrderItem` model. This captures which size the customer ordered at the time of purchase.

**Why:** Order history must accurately reflect what was sold. Without the size, admin cannot tell which sizes are selling.

### 4. Size selection is required before "Add to Cart"

**Decision:** The product page shows a clickable size selector. Sizes with `stock = 0` are visually disabled. The "Add to Cart" button is disabled until a size with available stock is selected.

**Why:** Prevents customers from adding items without specifying which size they want. Matches standard ecommerce UX patterns.

### 5. Update the database function to validate and deduct per-size stock

**Decision:** The `create_order_with_stock_deduction` function will:
- Accept a `size` field in each item of the `p_items` JSON array
- Look up the product, validate the size exists in `sizeStock`, and check that size's individual stock
- Deduct from that specific size's stock within the `sizeStock` JSON
- Update the total `stock` field accordingly
- If a size reaches 0, update that size's stock to 0 (but don't remove it from the array)

**Why:** Maintains atomicity. One function handles validation, deduction, and consistency.

### 6. Migration approach for existing data

**Decision:** In the migration, distribute existing `stock` equally across all `sizes` as a starting point. Example: if stock=50 and sizes=[35,36,37,38,39,40], each size gets ~8 units. Admins can adjust afterwards.

**Why:** Provides a reasonable baseline. Equal distribution is fair and easy to explain. Admins will need to review anyway.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **JSON manipulation in PostgreSQL**: Updating individual entries in a `jsonb` array is more complex than integer subtraction | The function uses `jsonb_set` to update the specific size entry. Well-tested pattern in Postgres. |
| **Existing products without sizeStock data**: Products added before migration only have `sizes Int[]` | The migration creates `sizeStock` from existing data. The function handles missing sizeStock gracefully (falls back to total stock). |
| **Cart items without size**: Existing carts in localStorage won't have a `size` field | The cart store migration adds a default size (first available) for legacy items. On next page load, users will be prompted to confirm size. |
| **Admin UI complexity**: Per-size stock grid could be overwhelming for products with many sizes | Shoe sizes are limited (typically 6-10 sizes). A simple grid with one input per size is clean and manageable. |
| **Race conditions on same size**: Two users ordering the same size simultaneously | Row-level locking (`SELECT FOR UPDATE`) on the product row still prevents this — the function locks the entire row before checking any size. |

## Migration Plan

1. **Create migration** to alter `sizes` column from `Int[]` to `sizeStock Json`, add `size` to `order_items`
2. **Migrate existing data** — distribute current `stock` equally across existing sizes
3. **Update the database function** to handle per-size validation and deduction
4. **Update Prisma schema** — change `sizes` to `sizeStock`, add `size` to OrderItem
5. **Regenerate Prisma client**
6. **Update frontend** — product page, cart store, admin modal, types
7. **Deploy and test** — place order, verify per-size deduction

## Open Questions

None at this time.
