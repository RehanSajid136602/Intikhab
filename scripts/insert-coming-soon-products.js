/**
 * Inserts 3 "coming soon" products into Supabase.
 * Run: node scripts/insert-coming-soon-products.js
 */
const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const products = [
  {
    id: crypto.randomUUID(),
    name: "Kids' Rainbow Sneaker",
    slug: "kids-rainbow-sneaker",
    brand: "Intikhab",
    productType: "shoes",
    category: "kids",
    price: 2800,
    images: [
      "/Products/image.webp",
      "/Products/image_2.webp",
      "/Products/image_3.webp",
    ],
    badge: "NEW",
    inStock: false,
    stock: 0,
    installment: 0,
    description:
      "A colorful and comfortable sneaker for kids, designed for all-day play with a lightweight sole and vibrant rainbow detailing.",
    sku: "INK-KID-001",
    status: "coming_soon",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sizeSystem: "eu",
    sizeStock: [
      { size: "26", stock: 0, label: "EU 26" },
      { size: "27", stock: 0, label: "EU 27" },
      { size: "28", stock: 0, label: "EU 28" },
      { size: "29", stock: 0, label: "EU 29" },
      { size: "30", stock: 0, label: "EU 30" },
      { size: "31", stock: 0, label: "EU 31" },
      { size: "32", stock: 0, label: "EU 32" },
      { size: "33", stock: 0, label: "EU 33" },
      { size: "34", stock: 0, label: "EU 34" },
      { size: "35", stock: 0, label: "EU 35" },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Ivory Stiletto Heel",
    slug: "ivory-stiletto-heel",
    brand: "Intikhab",
    productType: "shoes",
    category: "women",
    price: 4500,
    images: [
      "/Products/image_4.webp",
      "/Products/image_5.webp",
      "/Products/image_6.webp",
    ],
    badge: "NEW",
    inStock: false,
    stock: 0,
    installment: 0,
    description:
      "An elegant ivory stiletto heel with a sleek silhouette, perfect for formal events and evening wear.",
    sku: "INK-WHL-001",
    status: "coming_soon",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sizeSystem: "eu",
    sizeStock: [
      { size: "36", stock: 0, label: "EU 36" },
      { size: "37", stock: 0, label: "EU 37" },
      { size: "38", stock: 0, label: "EU 38" },
      { size: "39", stock: 0, label: "EU 39" },
      { size: "40", stock: 0, label: "EU 40" },
      { size: "41", stock: 0, label: "EU 41" },
      { size: "42", stock: 0, label: "EU 42" },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Tan Premium Sneaker",
    slug: "tan-premium-sneaker",
    brand: "Intikhab",
    productType: "shoes",
    category: "men",
    price: 3800,
    images: [
      "/Products/tan_sneaker_flat_lay.webp",
      "/Products/sneaker_side_profile.webp",
      "/Products/sneaker_toe_macro.webp",
    ],
    badge: "NEW",
    inStock: false,
    stock: 0,
    installment: 0,
    description:
      "A sophisticated tan sneaker crafted from premium materials, featuring a minimalist design that pairs effortlessly with any casual or smart-casual look.",
    sku: "INK-TAN-001",
    status: "coming_soon",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sizeSystem: "eu",
    sizeStock: [
      { size: "39", stock: 0, label: "EU 39" },
      { size: "40", stock: 0, label: "EU 40" },
      { size: "41", stock: 0, label: "EU 41" },
      { size: "42", stock: 0, label: "EU 42" },
      { size: "43", stock: 0, label: "EU 43" },
      { size: "44", stock: 0, label: "EU 44" },
      { size: "45", stock: 0, label: "EU 45" },
      { size: "46", stock: 0, label: "EU 46" },
    ],
  },
];

async function main() {
  console.log("Inserting coming soon products...\n");

  for (const product of products) {
    const { data, error } = await supabase
      .from("products")
      .upsert(product, { onConflict: "slug" })
      .select("id, name, slug, status");

    if (error) {
      console.error(`✗ ${product.name}:`, error.message);
    } else {
      console.log(`✓ ${product.name} (${data[0].id}) — ${data[0].status}`);
    }
  }

  console.log("\nDone!");
}

main();
