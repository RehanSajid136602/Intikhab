## ADDED Requirements

### Requirement: Product table schema
The system SHALL provide a `Product` table in Supabase Postgres with the following columns: `id` (uuid, primary key), `slug` (text, unique, indexed), `name` (text), `brand` (text), `category` (text: men|women|kids), `price` (integer), `original_price` (integer, nullable), `images` (text array), `badge` (text, nullable: SALE|NEW), `in_stock` (boolean), `stock` (integer), `installment` (integer), `description` (text), `sku` (text, unique), `status` (text: active|draft), `sizes` (integer array), `created_at` (timestamp), `updated_at` (timestamp).

#### Scenario: Schema matches existing Product interface
- **WHEN** Prisma generates client from schema.prisma
- **THEN** all fields from the existing `Product` TypeScript interface are represented with correct types

### Requirement: Order and OrderItem table schema
The system SHALL provide `Order` and `OrderItem` tables. Order MUST have: `id` (text, primary key), `customer_name`, `customer_email`, `shipping_address`, `province`, `city`, `phone`, `payment_method` (cod|jazzcash|easypaisa), `order_notes` (text, nullable), `total` (integer), `status` (Pending|Processing|Shipped|Delivered), `created_at` (timestamp). OrderItem MUST have: `id` (uuid), `order_id` (FK to Order), `product_id` (text), `name` (text), `image` (text), `quantity` (integer), `price` (integer).

#### Scenario: Order with multiple items can be inserted
- **WHEN** a checkout completes with 3 different products
- **THEN** one Order row and three OrderItem rows are created with correct foreign key references

### Requirement: Customer table schema
The system SHALL provide a `Customer` table with: `id` (uuid), `email` (text, unique), `phone` (text), `full_name` (text), `created_at` (timestamp), `last_order_at` (timestamp).

#### Scenario: Customer record created on first order
- **WHEN** a guest places their first order with a new email
- **THEN** a Customer row is created and the Order references it

### Requirement: Cart table schema
The system SHALL provide a `Cart` table with: `id` (uuid), `customer_email` (text), `product_id` (text), `quantity` (integer), `created_at` (timestamp), with a unique constraint on (customer_email, product_id).

#### Scenario: Cart items are unique per email
- **WHEN** the same product is added twice for the same email
- **THEN** the existing row's quantity is updated, not a new row inserted

### Requirement: Seed data from existing products
The system SHALL include a seed script that imports all products from `src/data/products.ts` into the Product table. Running the seed script must be idempotent (upsert by SKU).

#### Scenario: Initial seed creates 4 products
- **WHEN** the seed script runs on an empty database
- **THEN** exactly 4 product rows exist matching the static data

### Requirement: Row Level Security on all tables
RLS MUST be enabled on Product, Order, OrderItem, Customer, and Cart tables. Policies SHALL be:
- Product: SELECT for anon; INSERT/UPDATE/DELETE for authenticated (admin role) only
- Order: SELECT for authenticated admin; INSERT for anon; admin can UPDATE status
- OrderItem: SELECT for authenticated admin; INSERT for anon (via order creation)
- Customer: Users can SELECT their own row by email; admin can view all
- Cart: SELECT/INSERT/UPDATE/DELETE for rows matching own customer_email; admin can view all

#### Scenario: Anonymous user cannot insert product
- **WHEN** an unauthenticated client sends an INSERT to the Product table
- **THEN** the request is denied by RLS policy

#### Scenario: Admin can update order status
- **WHEN** an authenticated admin client sends UPDATE to Order table
- **THEN** the request succeeds and status changes
