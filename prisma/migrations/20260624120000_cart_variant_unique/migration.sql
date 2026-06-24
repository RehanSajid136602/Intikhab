DROP INDEX IF EXISTS "carts_customerEmail_productId_key";

CREATE UNIQUE INDEX "carts_customerEmail_productId_size_key"
ON "carts"("customerEmail", "productId", "size");
