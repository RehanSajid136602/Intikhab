## Context

The Intikhab ecommerce platform uses Supabase PostgreSQL with Prisma ORM. The checkout flow currently:
1. Validates the form (name, phone, email, address, payment method)
2. Syncs the cart to Supabase via `POST /api/cart`
3. Creates an order via `POST /api/orders`
4. Builds and opens a WhatsApp message to the store owner
5. Clears the cart and redirects to order confirmation

The `Product` model already has `stock` (Int) and `inStock` (Boolean) fields, but they are never automatically updated. Orders are created regardless of stock levels.

**Constraints:**
- The orders API route currently uses the Supabase JS client directly (service role key), not Prisma
- Supabase JS client does not support multi-statement transactions natively
- We need atomicity: order creation and stock deduction must succeed or fail together
- No schema changes needed — existing fields are sufficient

## Goals / Non-Goals

**Goals:**
- Validate sufficient stock before creating any order
- Deduct stock atomically when an order is created
- Auto-set `inStock = false` when stock reaches zero
- Return clear error messages for insufficient stock items
- Maintain the existing WhatsApp notification flow

**Non-Goals:**
- Real-time stock sync to the product detail page during checkout (future enhancement)
- Stock reservation/hold mechanism (items are deducted immediately, not held temporarily)
- Bulk inventory import/export
- Low-stock notifications to admin
- Per-size stock tracking (sizes are an array, not individual stock counters)

## Decisions

### 1. Use raw SQL transaction for atomicity instead of Prisma

**Decision:** Write a raw SQL transaction block in the `POST /api/orders` route using Supabase's `rpc()` method or sequential queries with manual rollback logic.

**Why:** The route currently uses the Supabase JS client. Switching to Prisma would require setting up a Prisma client in the API route (which is non-trivial in a serverless/Edge context due to connection pooling). A simpler approach is to use Supabase's ability to execute raw SQL via the `supabase.rpc()` function or to use sequential queries with error handling that mimics transactional behavior.

**Alternative considered:** Create a PostgreSQL stored procedure (function) that handles order creation + stock deduction in a single `rpc()` call. This is the most robust approach for atomicity in Supabase. We'll create a SQL function `create_order_with_stock_deduction()` that the API route calls via `supabase.rpc()`.

**Final decision:** Create a PostgreSQL database function for true atomicity. The API route will call it via `supabase.rpc('create_order_with_stock_deduction', {...})`. This runs entirely server-side in Postgres, eliminating race conditions.

### 2. Stock validation before order creation

**Decision:** Validate stock for all items before any inserts. If any item has insufficient stock, return a 400 error with a list of problematic items and their available stock levels.

**Why:** Failing fast is cheaper than inserting an order and then rolling back. It also gives better error messages to the user.

### 3. Checkout page error handling

**Decision:** In `checkout/page.tsx`, after the `POST /api/orders` call, check if the response is not OK. If so, parse the error JSON and display a toast with the specific items that are out of stock. Do NOT clear the cart or redirect — let the user fix their cart and retry.

### 4. `inStock` auto-update

**Decision:** Within the same database function, set `inStock = false` when `stock` reaches 0 after deduction. This keeps the storefront accurate without requiring manual admin intervention.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Race condition**: Two users order the last item simultaneously | The PostgreSQL function runs in a single transaction with row-level locking (`SELECT FOR UPDATE` on the product rows). One will succeed, the other will fail with insufficient stock. |
| **Database function complexity**: Debugging SQL functions is harder than JS | The function will be well-documented with comments. Errors will be caught and returned as structured JSON so the frontend can display them clearly. |
| **Existing products with stock=0**: Some seed products may already be at zero | Before deploying, run a migration query to verify and correct stock levels for all existing products. |
| **Supabase `rpc()` limitations**: Large payloads or complex types may not serialize well | The function will accept simple JSONB parameters for the order items array, which Postgres handles natively. |
| **WhatsApp flow disruption**: If stock check fails after WhatsApp is opened | WhatsApp is opened client-side AFTER the order API succeeds. If the API fails, WhatsApp is never triggered — no disruption. |

## Migration Plan

1. **Create the PostgreSQL function** in Supabase SQL Editor (or via a Prisma migration file):
   ```sql
   CREATE OR REPLACE FUNCTION create_order_with_stock_deduction(...)
   ```
2. **Deploy the function** before deploying the updated API route code
3. **Update `POST /api/orders`** to call the function instead of direct inserts
4. **Update checkout page** to handle new error response format
5. **Test** with a product that has stock=1, order it, verify stock=0 and `inStock=false`
6. **Rollback strategy**: If issues arise, revert the API route to its previous implementation (remove the `rpc()` call, restore direct inserts). The database function can remain — it's harmless if unused.

## Open Questions

None at this time. The approach is well-defined.
