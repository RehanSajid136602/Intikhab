## 1. Database Function

- [x] 1.1 Create PostgreSQL function `create_order_with_stock_deduction` in `prisma/stock-deduction-function.sql` that handles order creation, customer upsert, order item insertion, stock validation, and stock deduction in a single atomic transaction
- [x] 1.2 Add `SELECT ... FOR UPDATE` row-level locking on product rows within the function to prevent race conditions
- [x] 1.3 Include auto-update logic in the function to set `inStock = false` when stock reaches 0
- [x] 1.4 Have the function return structured error for insufficient stock (JSON with item details) and success with the created order ID
- [x] 1.5 Execute the SQL function in Supabase via Prisma migration or SQL Editor

## 2. API Route Update

- [x] 2.1 Refactor `POST /api/orders` to call `supabase.rpc('create_order_with_stock_deduction', payload)` instead of direct inserts
- [x] 2.2 Handle the RPC response: on success, return 201 with order details; on insufficient stock error, return 400 with the `insufficientStockItems` array
- [x] 2.3 Keep existing `GET /api/orders` admin endpoint unchanged
- [x] 2.4 Verify existing error handling (missing fields, customer errors) still works alongside the new RPC flow

## 3. Checkout Page Error Handling

- [x] 3.1 Update the `handleSubmit` catch block in `checkout/page.tsx` to parse the `insufficientStockItems` array from 400 error responses
- [x] 3.2 Display a user-friendly toast listing which items are out of stock (e.g., "Black Sneaker: only 2 left, you ordered 3")
- [x] 3.3 Ensure the cart is NOT cleared and the user is NOT redirected when stock validation fails
- [x] 3.4 Verify the WhatsApp flow only triggers on successful order creation (it already happens after the API call, so no change needed)

## 4. Verification & Testing

- [x] 4.1 Seed the database with products that have known stock levels (e.g., stock = 1, stock = 5)
- [x] 4.2 Place an order for a product with sufficient stock and verify stock is deducted correctly in the database
- [x] 4.3 Place an order for a product with insufficient stock and verify the 400 error response and toast message
- [x] 4.4 Verify that when stock reaches 0, `inStock` is set to `false` and the product is marked unavailable on the storefront
- [x] 4.5 Run `npm run build` to ensure no TypeScript errors
- [ ] 4.6 Run `npm run lint` to ensure no linting issues
