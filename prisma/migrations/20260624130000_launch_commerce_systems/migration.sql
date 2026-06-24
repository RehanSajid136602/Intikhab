ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "subtotal" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "shippingFee" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "couponCode" TEXT,
  ADD COLUMN IF NOT EXISTS "couponDiscount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "access_token_hash" TEXT;

CREATE INDEX IF NOT EXISTS "orders_access_token_hash_idx" ON "orders"("access_token_hash");

CREATE TABLE IF NOT EXISTS "coupons" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" TEXT NOT NULL UNIQUE,
  "discount_type" TEXT NOT NULL CHECK ("discount_type" IN ('percentage', 'fixed')),
  "discount_value" INTEGER NOT NULL CHECK ("discount_value" > 0),
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "minimum_order_amount" INTEGER,
  "usage_limit" INTEGER,
  "used_count" INTEGER NOT NULL DEFAULT 0,
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "coupons_code_idx" ON "coupons"("code");
CREATE INDEX IF NOT EXISTS "coupons_active_idx" ON "coupons"("active");

CREATE TABLE IF NOT EXISTS "addresses" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "customer_email" TEXT NOT NULL REFERENCES "customers"("email") ON DELETE CASCADE,
  "full_name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "province" TEXT NOT NULL DEFAULT '',
  "postal_code" TEXT NOT NULL,
  "address_line" TEXT NOT NULL,
  "is_default" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "addresses_customer_email_idx" ON "addresses"("customer_email");
CREATE UNIQUE INDEX IF NOT EXISTS "addresses_one_default_per_customer_idx"
  ON "addresses"("customer_email")
  WHERE "is_default" = TRUE;

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "customer_email" TEXT REFERENCES "customers"("email") ON DELETE SET NULL,
  "guest_name" TEXT,
  "guest_email" TEXT,
  "rating" INTEGER NOT NULL CHECK ("rating" >= 1 AND "rating" <= 5),
  "title" TEXT,
  "body" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'approved', 'rejected')),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "reviews_product_id_idx" ON "reviews"("product_id");
CREATE INDEX IF NOT EXISTS "reviews_customer_email_idx" ON "reviews"("customer_email");
CREATE INDEX IF NOT EXISTS "reviews_status_idx" ON "reviews"("status");

CREATE TABLE IF NOT EXISTS "categories" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "image" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories"("slug");
CREATE INDEX IF NOT EXISTS "categories_active_idx" ON "categories"("active");

INSERT INTO "categories" ("name", "slug", "description", "sort_order")
VALUES
  ('Men', 'men', 'Footwear selected for men.', 10),
  ('Women', 'women', 'Footwear selected for women.', 20),
  ('Kids', 'kids', 'Comfortable footwear for kids.', 30),
  ('Unisex', 'unisex', 'Shared styles and accessories.', 40)
ON CONFLICT ("slug") DO NOTHING;

CREATE TABLE IF NOT EXISTS "wishlist_items" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "customer_email" TEXT NOT NULL REFERENCES "customers"("email") ON DELETE CASCADE,
  "product_id" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE ("customer_email", "product_id")
);

CREATE INDEX IF NOT EXISTS "wishlist_items_customer_email_idx" ON "wishlist_items"("customer_email");
CREATE INDEX IF NOT EXISTS "wishlist_items_product_id_idx" ON "wishlist_items"("product_id");
