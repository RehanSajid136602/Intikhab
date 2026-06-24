# Database Recovery Report: Intikhab Commerce Launch

This document details the database snapshot, migration analysis, recovery strategy, and deployment verification for the Intikhab production/staging Supabase PostgreSQL database.

---

## Phase 1 — Database Safety Snapshot

### 1. Environment Identification
* **Database Host:** `aws-1-ap-northeast-1.pooler.supabase.com`
* **Supabase Project Ref:** `czpljoofhuslpewbjoit`
* **Deployment Environment:** Live staging/production environment connected to the Vercel staging deployment and local development setup.

### 2. Backup Plan Before Changes
1. **Supabase Schema & Data Export:** 
   Execute standard Supabase backups or run manual schema and table data exports using `pg_dump`:
   ```bash
   pg_dump -h aws-1-ap-northeast-1.pooler.supabase.com -U postgres -d postgres --clean --no-owner > supabase_backup_pre_recovery.sql
   ```
2. **Migration History Isolation:**
   Take a snapshot of the `_prisma_migrations` table before resolving any failures:
   ```sql
   SELECT * FROM _prisma_migrations;
   ```
3. **Safety Constraints Check:**
   Ensure no tables are dropped or reset. Do not run `prisma migrate reset` or `prisma db push` on Supabase production.

### 3. Documented Database State (Pre-Recovery)

#### Existing Tables (Pre-Recovery)
* `_prisma_migrations`
* `appearance_settings`
* `carts`
* `customers`
* `feedback`
* `messages`
* `order_items`
* `orders`
* `products`
* `profiles`
* `store_settings`

*(Note: `coupons`, `addresses`, `reviews`, `categories`, and `wishlist_items` did not exist pre-recovery).*

#### Failed Migration Details
* **Migration Name:** `20260411121859_enhanced_product_categories`
* **Error Code:** `42804` (Datatype mismatch)
* **Error Message:** `ERROR: column "size" is of type integer but expression is of type text`
* **Failed Statement:**
  ```sql
  UPDATE carts SET size = size::TEXT WHERE size IS NOT NULL;
  ```

---

## Phase 2 — Inspection of Failed Migration

### Why the Migration Failed
In Postgres, you cannot assign a `text` expression (result of `size::TEXT`) directly to an existing column (`carts.size`) that is still defined as type `integer`. The column's data type must first be changed using `ALTER COLUMN ... TYPE TEXT`. 

During the migration execution:
1. `order_items.size` type alteration succeeded.
2. The statement `UPDATE carts SET size = size::TEXT` was run *before* `carts.size` was altered to `TEXT` in the SQL script. This caused the transaction to abort and roll back.
3. The SQL migration file was subsequently committed/synced as empty, leaving the database migration log in a permanently failed state.
4. Later, manual alterations or standard procedures successfully converted both `order_items.size` and `carts.size` columns to `TEXT` in the database, but the `_prisma_migrations` table was never corrected.

---

## Phase 3 — Chosen Recovery Strategy

### Option A / B Mix (Mark Applied + Deploy)
Since the database column types for `carts.size` and `order_items.size` were already manually altered to `TEXT`, the end state of `20260411121859_enhanced_product_categories` was already achieved in the live database schema. However, because `finished_at` was `NULL` in `_prisma_migrations`, Prisma blocked all subsequent migrations.

**Steps Executed:**
1. Marked `20260411121859_enhanced_product_categories` as applied using Prisma's official resolution CLI.
2. Ran `prisma migrate deploy` to deploy the pending launch migrations.

---

## Phase 4 — Commands Executed

```bash
# 1. Check status of migrations (revealed the block)
npx prisma migrate status

# 2. Resolve the blocked migration history
npx prisma migrate resolve --applied "20260411121859_enhanced_product_categories"

# 3. Deploy all pending migrations (customer fields, cart variant unique index, launch commerce systems)
npx prisma migrate deploy

# 4. Re-generate Prisma client types
npx prisma generate

# 5. Confirm database schema is in sync
npx prisma migrate status
```

---

## Phase 5 — Verification of Applied Schema

We verified that the remaining database migrations were successfully deployed:
* **Coupons Table:** Verified exists, includes index on `code` and `active`.
* **Addresses Table:** Verified exists, includes default address indexes.
* **Reviews Table:** Verified exists, includes indexes on `product_id`, `customer_email`, and `status`.
* **Categories Table:** Verified exists, includes index on `slug` and `active`. Seed data for default categories (Men, Women, Kids, Unisex) is populated.
* **Wishlist Items Table:** Verified exists, includes unique index on `(customer_email, product_id)`.
* **Cart Unique Index:** Verified dropped old `carts_customerEmail_productId_key` and created `carts_customerEmail_productId_size_key` on `("customerEmail", "productId", "size")`. This ensures separate sizes stay separate.
* **Order Fields:** Verified `subtotal`, `shippingFee`, `couponCode`, `couponDiscount`, and `access_token_hash` columns exist in `orders`.

All migrations are fully applied and the database is now 100% clean and ready for deployment.
