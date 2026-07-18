import type { Metadata } from "next";
import { getMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { CategoryPageLayout } from "@/components/category/CategoryPageLayout";
import { transformProducts } from "@/lib/transformers";

export const metadata: Metadata = getMetadata({
  title: "Shop Shoes Online — Premium Footwear Collection | Intikhab",
  description: "Shop Intikhab’s latest footwear collection with premium sneakers, formal shoes, casual shoes, boots, and loafers.",
  path: "/products",
});

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { search?: string; sort?: string };
}) {
  const supabase = createClient();
  
  const { data } = await supabase
    .from("products")
    .select("*")
    .in("status", ["active", "coming_soon"])
    .order("createdAt", { ascending: false });

  const products = transformProducts(data || []);

  return (
    <CategoryPageLayout
      title="Shop Shoes & Footwear"
      description="Shop Intikhab's latest footwear collection with premium sneakers, formal shoes, casual shoes, boots, and loafers."
      products={products}
      category="all"
      productType="shoes"
      initialSearch={searchParams?.search || ""}
      initialSort={searchParams?.sort || "featured"}
    />
  );
}
