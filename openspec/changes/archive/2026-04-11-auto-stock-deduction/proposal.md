## Why

Currently, when a customer places an order, the product stock levels in the database are never updated. This means inventory is not tracked automatically — the admin must manually adjust stock after each sale, which is error-prone and doesn't scale. Additionally, the checkout flow does not validate whether sufficient stock exists before accepting an order, allowing customers to order items that are out of stock.

## What Changes

- **Stock validation at checkout**: Before creating an order, verify that each ordered item has sufficient `stock` in the database. If any item is out of stock or has insufficient quantity, reject the order with a clear error message listing which items failed.
- **Automatic stock deduction**: After an order is successfully created, deduct the ordered quantity from each product's `stock` field atomically.
- **Stock-aware order creation**: Wrap order creation + stock deduction in a database transaction so that partial failures (e.g., stock deduction fails after order insert) are rolled back completely.
- **Checkout page error handling**: Display user-friendly toast notifications when stock is insufficient (e.g., "Black Sneaker only has 2 left in stock").
- **`inStock` field auto-update**: When `stock` reaches 0, automatically set `inStock` to `false` so products are marked as unavailable on the storefront.

## Capabilities

### New Capabilities
- `stock-management`: Automatic inventory deduction and validation during the checkout/order creation flow, including stock level checks and `inStock` flag updates.

### Modified Capabilities
- `order-creation`: Order creation now requires stock validation as a precondition and performs stock deduction as a post-condition within the same transaction.

## Impact

- **`src/app/api/orders/route.ts`**: Significant changes — add stock validation query before order insert, add stock deduction updates after order insert, wrap in transaction logic.
- **`src/app/(public)/checkout/page.tsx`**: Add error handling for insufficient stock responses, show toast with details of which items are unavailable.
- **`src/types/product.ts`**: No changes needed — `stock` and `inStock` fields already exist.
- **`src/stores/cartStore.ts`**: No changes needed — cart logic is independent of stock deduction.
- **Database**: No schema changes needed — existing `Product.stock` (Int) and `Product.inStock` (Boolean) fields are sufficient.
- **Supabase RLS policies**: No changes needed — the server uses service role key which bypasses RLS.
