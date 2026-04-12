## 1. Database Schema Migration

- [x] 1.1 Create Prisma migration to replace `sizes Int[]` with `sizeStock Json` on Product model
- [x] 1.2 Add `size Int` column to `order_items` table in the same migration
- [x] 1.3 Write data migration SQL: distribute existing `stock` equally across `sizes`, then build `sizeStock` JSON array, then drop the old `sizes` column
- [x] 1.4 Run the migration against Supabase and verify data was migrated correctly

## 2. Update Prisma Schema and Types

- [x] 2.1 Update `prisma/schema.prisma` — change `sizes Int[]` to `sizeStock Json`, add `size Int` to OrderItem model
- [x] 2.2 Run `npx prisma generate` to regenerate the Prisma client
- [x] 2.3 Update `src/types/product.ts` — replace `sizes: number[]` with `sizeStock: { size: number; stock: number }[]`, add a computed `sizes` getter for backward compatibility
- [x] 2.4 Update `src/types/order.ts` — add `size: number` to OrderItem interface

## 3. Update Database Function

- [x] 3.1 Update `create_order_with_stock_deduction` function to accept `size` field in each item of `p_items`
- [x] 3.2 Add per-size validation: verify size exists in `sizeStock`, check individual size stock >= requested quantity
- [x] 3.3 Update stock deduction to modify the specific size's stock within the `sizeStock` JSON using `jsonb_set`
- [x] 3.4 Update total `stock` recalculation as sum of all `sizeStock` quantities
- [x] 3.5 Update `order_items` insert to include the `size` column
- [x] 3.6 Return `size` in `insufficientStockItems` error response

## 4. Update Product Detail Page

- [x] 4.1 Add interactive size selector component with clickable size buttons
- [x] 4.2 Disable and visually strike through sizes with `stock === 0`
- [x] 4.3 Disable "Add to Cart" and "Buy Now" until a valid size is selected
- [x] 4.4 Show toast warning if user attempts to add without selecting a size
- [x] 4.5 Pass the selected size to `cartStore.addItem(product, size)`
- [x] 4.6 Update stock display to show per-size stock (e.g., "Only 3 left in size 38")

## 5. Update Cart Store and Cart Item Types

- [x] 5.1 Update `CartItem` in cartStore to include required `size: number` field
- [x] 5.2 Update `addItem` method to accept a `size` parameter
- [x] 5.3 Update `removeItem` and `updateQuantity` to work with size-aware items
- [x] 5.4 Add migration for existing localStorage cart items: assign first available size or prompt user
- [x] 5.5 Update cart display to show size info (e.g., "Blue Sneaker — Size: 38")

## 6. Update Checkout Page

- [x] 6.1 Update stock validation to check per-size stock instead of total product stock
- [x] 6.2 Update error messages to include size info (e.g., "Blue Sneaker size 38: out of stock")
- [x] 6.3 Ensure order items sent to API include the `size` field

## 7. Update Admin Product Management

- [x] 7.1 Update `AddProductModal` to replace flat stock input with per-size stock grid
- [x] 7.2 Each size gets its own stock quantity input field
- [x] 7.3 Calculate and display total stock as sum of per-size quantities
- [x] 7.4 Update `ProductsTable` to show per-size stock or total stock clearly

## 8. API Route Updates

- [x] 8.1 Update `POST /api/products` to accept `sizeStock` array instead of `sizes` + flat `stock`
- [x] 8.2 Update `PUT /api/products/[id]` to handle `sizeStock` updates
- [x] 8.3 Update product listing responses to include `sizeStock` data

## 9. Verification & Testing

- [x] 9.1 Run `npm run build` to ensure no TypeScript errors
- [x] 9.2 Verify product page shows interactive size selector with correct stock per size
- [x] 9.3 Test adding to cart with a specific size — verify cart shows size
- [x] 9.4 Place an order and verify stock is deducted from the specific size in the database
- [x] 9.5 Verify order items in admin dashboard show the ordered size
- [x] 9.6 Test ordering a size with insufficient stock — verify rejection with size-specific error
