## ADDED Requirements

### Requirement: Supabase client utilities
The system SHALL provide two Supabase client modules:
- `src/lib/supabase/server.ts`: Server-side client using service role key, for server components and API routes
- `src/lib/supabase/client.ts`: Browser-side client using anon key, for client components and Auth

Both SHALL export typed query functions matching the Prisma-generated types.

#### Scenario: Server component fetches all active products
- **WHEN** a server component imports `getServerSupabase` and queries products
- **THEN** it receives a typed array of Product objects

#### Scenario: Client component uses anon key only
- **WHEN** a client component imports `getBrowserSupabase`
- **THEN** it can perform anon-authenticated queries but cannot access service_role operations

### Requirement: Products API — public GET
`GET /api/products` SHALL return all active products with optional query params: `?category=men|women|kids`, `?slug=some-slug`, `?limit=N`, `?offset=N`. Response shape SHALL match the existing `Product[]` array to avoid breaking UI components.

#### Scenario: Homepage fetches all active products
- **WHEN** `GET /api/products` is called with no params
- **THEN** all products with status=active are returned

#### Scenario: Category page filters by category
- **WHEN** `GET /api/products?category=women` is called
- **THEN** only products with category=women and status=active are returned

### Requirement: Products API — admin POST/PUT/DELETE
`POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` SHALL require admin authentication. POST creates a product, PUT updates by ID, DELETE soft-sets status=draft. Request/response bodies SHALL use the existing `Product` interface.

#### Scenario: Admin creates a new product
- **WHEN** an authenticated admin POSTs a valid Product object to `/api/products`
- **THEN** the product is inserted and returned with generated id and slug

### Requirement: Orders API — create order
`POST /api/orders` SHALL accept an order payload (customer info, items, payment method, total), insert into Order and OrderItem tables, create/update Customer record, and return the order ID. No authentication required (guest checkout).

#### Scenario: Checkout creates order and customer records
- **WHEN** a POST to `/api/orders` includes customer email, shipping address, and 2 items
- **THEN** one Order, two OrderItems, and one Customer (or reused existing) are created

### Requirement: Orders API — admin GET
`GET /api/orders` SHALL return all orders with pagination and status filters. Only authenticated admin users can access.

#### Scenario: Admin views all orders
- **WHEN** an authenticated admin GETs `/api/orders`
- **THEN** all orders are returned sorted by created_at descending

### Requirement: Cart sync API
`POST /api/cart` SHALL accept a cart payload (customer_email, items[]) and upsert the Cart table. `GET /api/cart?email=` SHALL return cart items for that email. Used to sync localStorage cart when a user is identified.

#### Scenario: Guest cart syncs on identification
- **WHEN** a user provides their email at checkout and has localStorage cart items
- **THEN** a POST to `/api/cart` persists those items to the Cart table

### Requirement: Response shape compatibility
All API routes SHALL return response bodies that match the existing static data shapes: `Product[]` for products, `{ items, totalPrice }` for cart, `{ id, items, total, status, ... }` for orders. No UI component SHALL need prop changes.

#### Scenario: Product card receives same data shape
- **WHEN** a product card component receives data from Supabase API vs static import
- **THEN** the object shape is identical — no component changes needed
