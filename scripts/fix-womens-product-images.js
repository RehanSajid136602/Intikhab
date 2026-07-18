/**
 * Fixes Pastel Luxe Sneaker + Noir Leather Heel:
 *   - Sets correct images (the 5 ivory heel shots)
 *   - Renames + rewrites descriptions to match the actual shoe
 *   - Drafts the duplicate (Noir Leather Heel) to avoid redundancy
 *
 * Run: node scripts/fix-womens-product-images.js
 */
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const HEEL_IMAGES = [
  "/Products/image.webp",
  "/Products/image_1-1.webp",
  "/Products/image_2.webp",
  "/Products/image_3.webp",
  "/Products/image_4-1.webp",
];

async function main() {
  // 1. Update Pastel Luxe Sneaker → Ivory Crystal Heel
  const { error: err1 } = await supabase
    .from("products")
    .update({
      name: "Ivory Crystal Heel",
      images: HEEL_IMAGES,
      description:
        "An ivory satin stiletto heel adorned with crystal and pearl embellishments. The pointed-toe silhouette and delicate ankle strap create an elegant look for formal occasions, evening events, and bridal wear.",
      updatedAt: new Date().toISOString(),
    })
    .eq("sku", "INK-BLU-002");

  if (err1) {
    console.error("✗ Failed to update Pastel Luxe Sneaker:", err1.message);
  } else {
    console.log("✓ Ivory Crystal Heel (INK-BLU-002) — 5 images, updated description");
  }

  // 2. Draft Noir Leather Heel (no longer needed — same shoe, different SKU)
  const { error: err2 } = await supabase
    .from("products")
    .update({
      status: "draft",
      images: HEEL_IMAGES,
      description:
        "An ivory satin stiletto heel featuring crystal and pearl detailing with a pointed toe and sleek stiletto silhouette.",
      updatedAt: new Date().toISOString(),
    })
    .eq("sku", "INK-BLK-002");

  if (err2) {
    console.error("✗ Failed to draft Noir Leather Heel:", err2.message);
  } else {
    console.log("✓ Noir Leather Heel (INK-BLK-002) — drafted (duplicate of Ivory Crystal Heel)");
  }

  // 3. Summary of women's catalog
  const { data: women } = await supabase
    .from("products")
    .select("name, slug, status, price, images")
    .eq("category", "women")
    .order("status");

  console.log("\n--- Women's catalog after changes ---");
  for (const p of women || []) {
    const imgCount = p.images?.length || 0;
    const statusIcon = p.status === "active" ? "✓" : p.status === "coming_soon" ? "🔜" : "⊡";
    console.log(`  ${statusIcon} ${p.name} (PKR ${p.price}) — ${imgCount} images — ${p.status}`);
  }
  console.log("\nDone!");
}

main();
