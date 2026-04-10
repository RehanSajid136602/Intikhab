-- =====================================================
-- Row Level Security Policies for Intikhab Supabase
-- Run this SQL in Supabase SQL Editor after migration
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PRODUCTS: SELECT for anon (public catalog)
--           INSERT/UPDATE/DELETE for authenticated only
-- =====================================================

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are insertable by authenticated users only"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Products are updatable by authenticated users only"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Products are deletable by authenticated users only"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- =====================================================
-- ORDERS: INSERT for anon (guest checkout)
--         SELECT/UPDATE for authenticated admin
-- =====================================================

CREATE POLICY "Orders are insertable by anyone (guest checkout)"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders are viewable by authenticated users only"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Orders are updatable by authenticated users only"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- ORDER ITEMS: INSERT for anon (via order creation)
--              SELECT for authenticated admin
-- =====================================================

CREATE POLICY "Order items are insertable by anyone"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Order items are viewable by authenticated users only"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- CUSTOMERS: Users can view own row by email match
--            Admin (authenticated) can view all
-- =====================================================

CREATE POLICY "Customers can view their own row"
  ON customers FOR SELECT
  USING (auth.email() = email);

CREATE POLICY "Customers are insertable by anyone (auto-created on order)"
  ON customers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Customers are viewable by authenticated users (admin)"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers are updatable by authenticated users (admin)"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- CARTS: Users can CRUD their own cart by email match
--        Admin can view all
-- =====================================================

CREATE POLICY "Carts are viewable by owner"
  ON carts FOR SELECT
  USING (auth.email() = customer_email);

CREATE POLICY "Carts are insertable by owner"
  ON carts FOR INSERT
  WITH CHECK (auth.email() = customer_email);

CREATE POLICY "Carts are updatable by owner"
  ON carts FOR UPDATE
  USING (auth.email() = customer_email)
  WITH CHECK (auth.email() = customer_email);

CREATE POLICY "Carts are deletable by owner"
  ON carts FOR DELETE
  USING (auth.email() = customer_email);

CREATE POLICY "Carts are viewable by authenticated users (admin)"
  ON carts FOR SELECT
  TO authenticated
  USING (true);
