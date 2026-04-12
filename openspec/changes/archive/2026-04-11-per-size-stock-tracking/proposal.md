## Why

Currently, the `Product` model stores sizes as a simple array (`sizes Int[]`) with no stock quantity per size. The total `stock` field tracks inventory at the product level, not per size. This means:

1. A product with stock=50 could have all 50 units in size 38 and zero in size 40 — but the UI shows all sizes as equally available.
2. Customers cannot select a size when adding to cart — the size is never captured in the cart or order.
3. When stock is deducted on order, it deducts from the total, not from the specific size sold.
4. Admins cannot manage inventory per size, making it impossible to know which sizes are actually available.

## What Changes

- **Per-size stock tracking**: Replace `sizes Int[]` with a `sizeStock` JSON field mapping each size to its stock quantity (e.g., `[{size: 38, stock: 10}, {size: 40, stock: 5}]`).
- **Total stock auto-calculation**: The `stock` field becomes a computed total (sum of all sizeStock quantities) to maintain backward compatibility with existing queries and admin tables.
- **Mandatory size selection on product page**: Customers must select a size before adding to cart or buying now. The "Add to Cart" button is disabled until a size is chosen.
- **Cart items include size**: The `CartItem` type gains a required `size: number` field. Cart display and order items capture the selected size.
- **Stock deduction per size**: The database function deducts stock from the specific size, not just the product total. If that size's stock reaches 0, the size is marked as unavailable.
- **Admin product management updates**: The admin Add/Edit product UI allows setting stock quantity per size instead of a flat number.

## Capabilities

### New Capabilities
- `per-size-stock`: Track inventory quantity per individual shoe size. Each size has its own stock level. Total product stock is the sum of all size stocks. Size-specific stock deduction occurs on order creation.
- `size-selection-flow`: Require customers to select a size before adding to cart. Validate the selected size has available stock. Display per-size availability on the product page.

### Modified Capabilities
- `order-creation`: Order items now must include the selected size. Stock deduction deducts from both the product total and the specific size's stock within the database function.

## Impact

- **Database schema**: Change `sizes` from `Int[]` to a JSON column `sizeStock` with `{size, stock}` objects. Add a `size` column to `order_items` to capture which size was ordered. No new tables needed.
- **`prisma/schema.prisma`**: Update Product model — replace `sizes Int[]` with `sizeStock Json`. Update OrderItem model — add `size Int`.
- **`prisma/migrations/`**: New migration to alter columns.
- **`prisma/stock-deduction-function.sql`**: Update to deduct from per-size stock and validate size exists with available stock.
- **`src/types/product.ts`**: Replace `sizes: number[]` with `sizeStock: {size: number, stock: number}[]`. Add `size` to `CartItem`.
- **`src/components/products/ProductDetailPage.tsx`**: Add interactive size selector with stock-aware disable states. Require size selection before cart add.
- **`src/stores/cartStore.ts`**: Update `addItem` to accept a size parameter. Cart items now require a size.
- **`src/app/api/orders/route.ts`**: Pass size data to the database function.
- **`src/components/admin/AddProductModal.tsx`**: Replace flat stock input with per-size stock grid.
- **`src/app/(public)/checkout/page.tsx`**: Cart items already carry size — no structural change needed, just display.
