/**
 * Sets Kids' and Men's sneakers to active with correct names/descriptions.
 * Run: node scripts/activate-products.js
 */
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function main() {
  // Kids sneaker
  const { error: e1 } = await supabase
    .from("products")
    .update({
      name: "Tan Play Sneaker",
      status: "active",
      inStock: true,
      stock: 30,
      sizeStock: [
        { size: "26", stock: 3, label: "EU 26" },
        { size: "27", stock: 4, label: "EU 27" },
        { size: "28", stock: 5, label: "EU 28" },
        { size: "29", stock: 4, label: "EU 29" },
        { size: "30", stock: 5, label: "EU 30" },
        { size: "31", stock: 3, label: "EU 31" },
        { size: "32", stock: 4, label: "EU 32" },
        { size: "33", stock: 3, label: "EU 33" },
        { size: "34", stock: 2, label: "EU 34" },
        { size: "35", stock: 2, label: "EU 35" },
      ],
      description:
        "A soft tan and white casual sneaker for kids with a cushioned sole and easy elastic laces. Designed for all-day comfort at school, the park, or weekend outings with a lightweight build and durable grip outsole.",
      updatedAt: new Date().toISOString(),
    })
    .eq("slug", "play-tan-casual-sneaker");

  if (e1) console.error("✗ Kids:", e1.message);
  else console.log("✓ Tan Play Sneaker (kids) — active, 30 stock");

  // Men's sneaker
  const { error: e2 } = await supabase
    .from("products")
    .update({
      name: "White Court Sneaker",
      status: "active",
      inStock: true,
      stock: 25,
      sizeStock: [
        { size: "39", stock: 3, label: "EU 39" },
        { size: "40", stock: 4, label: "EU 40" },
        { size: "41", stock: 5, label: "EU 41" },
        { size: "42", stock: 5, label: "EU 42" },
        { size: "43", stock: 4, label: "EU 43" },
        { size: "44", stock: 3, label: "EU 44" },
        { size: "45", stock: 2, label: "EU 45" },
        { size: "46", stock: 2, label: "EU 46" },
      ],
      description:
        "A clean white leather court sneaker with a contrasting tan heel tab and perforated side detailing. The minimalist silhouette pairs effortlessly with denim, chinos, or joggers for a sharp everyday look.",
      updatedAt: new Date().toISOString(),
    })
    .eq("slug", "court-white-leather-sneaker");

  if (e2) console.error("✗ Men:", e2.message);
  else console.log("✓ White Court Sneaker (men) — active, 25 stock");

  // Summary
  const { data: all } = await supabase
    .from("products")
    .select("name, slug, category, status")
    .eq("status", "active")
    .order("category");

  console.log("\n--- Active products ---");
  for (const p of all || []) {
    console.log(`  ${p.name} → /${p.productType || "shoes"}/${p.category}`);
  }
  console.log("\nDone!");
}

main();
