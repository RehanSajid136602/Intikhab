-- Add stock deduction function for atomic order creation
-- This function validates stock, creates orders, deducts stock, and updates inStock flag

CREATE OR REPLACE FUNCTION create_order_with_stock_deduction(
  p_order_id TEXT,
  p_customer_email TEXT,
  p_customer_name TEXT,
  p_phone TEXT,
  p_shipping_address TEXT,
  p_province TEXT,
  p_city TEXT,
  p_payment_method TEXT,
  p_order_notes TEXT,
  p_total INT,
  p_items JSONB
) RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_item JSONB;
  v_product_id UUID;
  v_quantity INT;
  v_available_stock INT;
  v_insufficient_stock JSONB := '[]';
  v_new_stock INT;
  v_order_item_id UUID;
  v_customer_id UUID;
BEGIN
  -- Step 1: Upsert customer
  INSERT INTO customers (id, email, phone, "fullName", "lastOrderAt")
  VALUES (
    gen_random_uuid(),
    p_customer_email,
    COALESCE(p_phone, ''),
    COALESCE(p_customer_name, ''),
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    phone = COALESCE(EXCLUDED.phone, customers.phone),
    "fullName" = COALESCE(EXCLUDED."fullName", customers."fullName"),
    "lastOrderAt" = NOW()
  RETURNING id INTO v_customer_id;

  -- Step 2: Validate stock with row-level locking (SELECT FOR UPDATE)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'productId')::UUID;
    v_quantity := (v_item->>'quantity')::INT;

    SELECT stock INTO v_available_stock
    FROM products
    WHERE id = v_product_id
    FOR UPDATE;

    IF v_available_stock IS NULL THEN
      v_insufficient_stock := v_insufficient_stock || jsonb_build_object(
        'productId', v_product_id::TEXT,
        'name', v_item->>'name',
        'requestedQuantity', v_quantity,
        'availableStock', 0,
        'error', 'Product not found'
      );
    ELSIF v_available_stock < v_quantity THEN
      v_insufficient_stock := v_insufficient_stock || jsonb_build_object(
        'productId', v_product_id::TEXT,
        'name', v_item->>'name',
        'requestedQuantity', v_quantity,
        'availableStock', v_available_stock
      );
    END IF;
  END LOOP;

  -- Rollback if any item has insufficient stock
  IF jsonb_array_length(v_insufficient_stock) > 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient stock',
      'insufficientStockItems', v_insufficient_stock
    );
  END IF;

  -- Step 3: Create the order
  INSERT INTO orders (
    id,
    "customerEmail",
    "customerName",
    "shippingAddress",
    province,
    city,
    phone,
    "paymentMethod",
    "orderNotes",
    total,
    status
  ) VALUES (
    p_order_id,
    p_customer_email,
    COALESCE(p_customer_name, ''),
    p_shipping_address,
    COALESCE(p_province, ''),
    COALESCE(p_city, ''),
    COALESCE(p_phone, ''),
    COALESCE(p_payment_method, 'cod'),
    CASE WHEN p_order_notes = '' THEN NULL ELSE p_order_notes END,
    p_total,
    'Pending'
  );

  -- Step 4 & 5: Create order items and deduct stock
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'productId')::UUID;
    v_quantity := (v_item->>'quantity')::INT;

    v_order_item_id := gen_random_uuid();
    INSERT INTO order_items (
      id,
      "orderId",
      "productId",
      name,
      image,
      quantity,
      price
    ) VALUES (
      v_order_item_id,
      p_order_id,
      v_product_id::TEXT,
      v_item->>'name',
      v_item->>'image',
      v_quantity,
      (v_item->>'price')::INT
    );

    -- Deduct stock
    UPDATE products
    SET stock = stock - v_quantity
    WHERE id = v_product_id
    RETURNING stock INTO v_new_stock;

    -- Auto-set inStock = false when stock reaches 0
    IF v_new_stock <= 0 THEN
      UPDATE products
      SET "inStock" = false
      WHERE id = v_product_id;
    END IF;
  END LOOP;

  -- Step 6: Return success
  RETURN jsonb_build_object(
    'success', true,
    'orderId', p_order_id
  );

END;
$$;
