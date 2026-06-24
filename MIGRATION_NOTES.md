# Migration Notes

Apply these migrations to the Supabase Postgres database before launch:

```bash
npx prisma migrate deploy
```

If deploying manually through Supabase SQL editor, apply these migration files in order:

1. `prisma/migrations/20260624120000_cart_variant_unique/migration.sql`
2. `prisma/migrations/20260624130000_launch_commerce_systems/migration.sql`

Important checks after migration:

- `carts` must have a unique index on `customerEmail + productId + size`.
- `orders` must include `access_token_hash`, `subtotal`, `shippingFee`, `couponCode`, and `couponDiscount`.
- `coupons`, `addresses`, `reviews`, `categories`, and `wishlist_items` tables must exist.
- `ADMIN_EMAILS` must be configured in the runtime environment. Admin access fails closed when it is missing.

Supabase deployment notes:

- Run migrations against the production database before deploying code that depends on these tables.
- If RLS is enabled, add policies matching the app access model: public read for active categories and approved reviews; authenticated users only for their own addresses and wishlist; admin-only access for coupons, moderation, and management tables.
