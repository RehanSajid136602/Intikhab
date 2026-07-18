/**
 * Deletes the old 3 coming_soon products and inserts 2 correct ones.
 * Run: node scripts/replace-coming-soon-products.js
 */
const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const OLD_SLUGS = [
  "kids-rainbow-sneaker",
  "ivory-stiletto-heel",
  "tan-premium-sneaker",
];

const NEW_PRODUCTS = [
  {
    id: crypto.randomUUID(),
    name: "Court White Leather Sneaker",
    slug: "court-white-leather-sneaker",
    brand: "Intikhab",
    productType: "shoes",
    category: "men",
    price: 3400,
    images: [
      "/Products/image_5.webp",
      "/Products/image_6.webp",
      "/Products/image_7.webp",
      "/Products/image_8.webp",
    ],
    badge: "NEW",
    inStock: false,
    stock: 0,
    installment: 0,
    description:
      "A clean white leather court sneaker with a contrasting tan heel tab and perforated detailing. Built for everyday wear with a minimalist silhouette that pairs effortlessly with denim, chinos, or joggers.",
    sku: "INK-WHT-001",
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
  {
    id: crypto.randomUUID(),
    name: "Play Tan Casual Sneaker",
    slug: "play-tan-casual-sneaker",
    brand: "Intikhab",
    productType: "shoes",
    category: "kids",
    price: 2500,
    images: [
      "/Products/image_4.webp",
      "/Products/sneaker_side_profile.webp",
      "/Products/sneaker_toe_macro.webp",
      "/Products/tan_sneaker_flat_lay.webp",
    ],
    badge: "NEW",
    inStock: false,
    stock: 0,
    installment: 0,
    description:
      "A soft tan and white casual sneaker for kids with a cushioned sole and easy slip-on style. Designed for active days at school, the park, or weekend outings with a lightweight build that keeps little feet comfortable all day.",
    sku: "INK-KID-002",
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
];

async function main() {
  // Delete old products
  console.log("Deleting old coming_soon products...");
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .in("slug", OLD_SLUGS);

  if (deleteError) {
    console.error("Delete error:", deleteError.message);
    process.exit(1);
  }
  console.log(`Deleted ${OLD_SLUGS.length} old products\n`);

  // Insert new products
  console.log("Inserting new coming soon products...\n");
  for (const product of NEW_PRODUCTS) {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select("id, name, slug, status, category, images");

    if (error) {
      console.error(`✗ ${product.name}:`, error.message);
    } else {
      const p = data[0];
      console.log(`✓ ${p.name}`);
      console.log(`  Category: ${p.category}`);
      console.log(`  Slug: ${p.slug}`);
      console.log(`  Images: ${p.images.length} files`);
      console.log(`  Status: ${p.status}\n`);
    }
  }

  // Summary of all active + coming_soon products
  const { data: allProducts } = await supabase
    .from("products")
    .select("name, category, status")
    .in("status", ["active", "coming_soon"])
    .order("category");

  console.log("--- Current product catalog ---");
  const grouped = {};
  for (const p of allProducts || []) {
    const key = p.category;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }
  for (const [cat, items] of Object.entries(grouped)) {
    console.log(`\n${cat.charAt(0).toUpperCase() + cat.slice(1)}:`);
    for (const item of items) {
      console.log(`  ${item.status === "coming_soon" ? "🔜" : "✓"} ${item.name} (${item.status})`);
    }
  }

  console.log("\nDone!");
}

main();
