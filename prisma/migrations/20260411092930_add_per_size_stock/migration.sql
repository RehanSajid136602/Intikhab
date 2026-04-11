-- Add per-size stock tracking
-- 1. Add new columns
-- 2. Migrate data from sizes[] + stock to sizeStock JSON
-- 3. Drop old columns

-- Step 1: Add new columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS "sizeStock" JSONB DEFAULT '[]';
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS "size" INT;

-- Step 2: Migrate existing data
-- For each product, distribute stock equally across sizes, then build sizeStock JSON
DO $$
DECLARE
  prod RECORD;
  size_arr INT[];
  total_stock INT;
  num_sizes INT;
  base_stock INT;
  remainder INT;
  size_stock_arr JSONB;
  i INT;
BEGIN
  FOR prod IN SELECT id, sizes, stock FROM products WHERE sizes IS NOT NULL AND array_length(sizes, 1) > 0
  LOOP
    size_arr := prod.sizes;
    total_stock := prod.stock;
    num_sizes := array_length(size_arr, 1);
    base_stock := total_stock / num_sizes;
    remainder := total_stock % num_sizes;

    -- Build JSON array: distribute remainder to first sizes
    size_stock_arr := '[]'::JSONB;
    FOR i IN 1..num_sizes LOOP
      size_stock_arr := size_stock_arr || jsonb_build_object(
        'size', size_arr[i],
        'stock', CASE WHEN i <= remainder THEN base_stock + 1 ELSE base_stock END
      );
    END LOOP;

    UPDATE products SET "sizeStock" = size_stock_arr WHERE id = prod.id;
  END LOOP;

  -- For products with no sizes, set empty sizeStock
  UPDATE products SET "sizeStock" = '[]' WHERE "sizeStock" IS NULL OR "sizeStock" = 'null';
END $$;

-- Step 3: Drop old columns
ALTER TABLE products DROP COLUMN IF EXISTS sizes;
