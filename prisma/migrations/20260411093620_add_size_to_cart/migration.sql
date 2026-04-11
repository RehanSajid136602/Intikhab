-- Add size column to carts table
ALTER TABLE carts ADD COLUMN IF NOT EXISTS "size" INT;
