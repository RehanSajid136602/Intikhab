/**
 * Script to:
 * 1. Delete Noir Leather Heel (INK-BLK-002) entirely — if no orders reference it
 * 2. Set Ivory Crystal Heel (INK-BLU-002) to coming_soon
 *
 * Run: node scripts/manage-womens-products.js
 */
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function main() {
  console.log("=== WOMEN'S PRODUCTS MANAGEMENT ===\n");

  // ─── 1. Find Noir Leather Heel (INK-BLK-002) ───
  const { data: noirProduct, error: noirErr } = await supabase
    .from("products")
    .select("id, sku, name, slug, status")
    .eq("sku", "INK-BLK-002")
    .single();

  if (noirErr || !noirProduct) {
    console.log("Noir Leather Heel (INK-BLK-002) not found in DB.");
    console.log("Error:", noirErr?.message || "No product returned");
  } else {
    console.log("Noir Leather Heel found:");
    console.log(`  ID: ${noirProduct.id}`);
    console.log(`  SKU: ${noirProduct.sku}`);
    console.log(`  Name: ${noirProduct.name}`);
    console.log(`  Slug: ${noirProduct.slug}`);
    console.log(`  Status: ${noirProduct.status}`);

    // ── Check for orders referencing Noir Leather Heel ──
    const { data: orderItems, error: orderItemsErr, count: orderItemsCount } = await supabase
      .from("order_items")
      .select("orderId", { count: "exact", head: false })
      .eq("productId", noirProduct.id)
      .limit(20);

    if (orderItemsErr) {
      console.log(`\nError checking order_items: ${orderItemsErr.message}`);
    } else if (orderItems && orderItems.length > 0) {
      const orderIds = [...new Set(orderItems.map((oi) => oi.orderId))];
      console.log(`\n⚠️  WARNING: ${orderItems.length} order item(s) reference Noir Leather Heel.`);
      console.log(`  Order IDs: ${orderIds.join(", ")}`);
      console.log("  Cannot hard-delete — setting status to 'draft' instead.\n");
      const { error: updateErr } = await supabase
        .from("products")
        .update({ status: "draft" })
        .eq("id", noirProduct.id);
      if (updateErr) {
        console.log(`  Failed to set to draft: ${updateErr.message}`);
      } else {
        console.log("  ✅ Status set to 'draft' (soft-deleted).");
      }
    } else {
      console.log("\n  ✅ No orders reference Noir Leather Heel — safe to delete.");
      const { error: deleteErr } = await supabase
        .from("products")
        .delete()
        .eq("id", noirProduct.id);
      if (deleteErr) {
        console.log(`  ❌ Delete failed: ${deleteErr.message}`);
      } else {
        console.log("  ✅ Product hard-deleted successfully.");
      }
    }
  }

  console.log("");

  // ─── 2. Find Ivory Crystal Heel (INK-BLU-002) ───
  const { data: ivoryProduct, error: ivoryErr } = await supabase
    .from("products")
    .select("id, sku, name, slug, status")
    .eq("sku", "INK-BLU-002")
    .single();

  if (ivoryErr || !ivoryProduct) {
    console.log("Ivory Crystal Heel (INK-BLU-002) not found in DB.");
    console.log("Error:", ivoryErr?.message || "No product returned");
  } else {
    console.log("Ivory Crystal Heel found:");
    console.log(`  ID: ${ivoryProduct.id}`);
    console.log(`  SKU: ${ivoryProduct.sku}`);
    console.log(`  Name: ${ivoryProduct.name}`);
    console.log(`  Slug: ${ivoryProduct.slug}`);
    console.log(`  Status: ${ivoryProduct.status}`);

    if (ivoryProduct.status === "coming_soon") {
      console.log("  Already 'coming_soon' — no change needed.");
    } else {
      const { error: updateErr } = await supabase
        .from("products")
        .update({ status: "coming_soon" })
        .eq("id", ivoryProduct.id);
      if (updateErr) {
        console.log(`  ❌ Update failed: ${updateErr.message}`);
      } else {
        console.log("  ✅ Status updated to 'coming_soon'.");
      }
    }
  }

  // ─── 3. Summary of women's products ───
  console.log("\n--- Women's Products Summary ---");
  const { data: womenProducts } = await supabase
    .from("products")
    .select("sku, name, slug, status, price")
    .eq("category", "women")
    .order("status");

  if (womenProducts) {
    console.log(`${"SKU".padEnd(15)} ${"Name".padEnd(25)} ${"Status".padEnd(15)} Price`);
    console.log("-".repeat(70));
    for (const p of womenProducts) {
      console.log(
        `${p.sku.padEnd(15)} ${p.name.padEnd(25)} ${p.status.padEnd(15)} PKR ${p.price}`,
      );
    }

    const activeCount = womenProducts.filter((p) => p.status === "active").length;
    const comingSoonCount = womenProducts.filter((p) => p.status === "coming_soon").length;

    console.log(`\n📊 Women's category:`);
    console.log(`   Active: ${activeCount}`);
    console.log(`   Coming Soon: ${comingSoonCount}`);
    console.log(`   Draft: ${womenProducts.filter((p) => p.status === "draft").length}`);
    if (activeCount === 0) {
      console.log("   ⚠️  WARNING: Women's category has ZERO active/purchasable products!");
    }
  }
}

main().catch(console.error);
