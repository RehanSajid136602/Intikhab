import type { Metadata } from "next";
import { CategoryPageLayout } from "@/components/category/CategoryPageLayout";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";
import { notFound } from "next/navigation";
import { PRODUCT_TYPE_CONFIG } from "@/lib/sizeSystems";

import { getMetadata } from "@/lib/seo";
import { transformProduct } from "@/lib/transformers";

interface PageProps {
  params: {
    productType: string;
    category: string;
  };
  searchParams: {
    subcategory?: string;
    sort?: string;
  };
}

const VALID_PRODUCT_TYPES = [
  "shoes",
  "bags",
  "accessories",
  "clothing",
] as const;
const VALID_CATEGORIES = ["men", "women", "kids", "unisex"] as const;

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { productType, category } = params;
  const { subcategory } = searchParams;

  const productTypeLabel =
    productType.charAt(0).toUpperCase() + productType.slice(1);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const subcategoryLabel = subcategory
    ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
    : "";

  const title = subcategory
    ? `${categoryLabel}'s ${subcategoryLabel} ${productTypeLabel} | Intikhab`
    : `${categoryLabel}'s ${productTypeLabel} | Intikhab`;

  const description = subcategory
    ? `Discover our exclusive range of ${categoryLabel}'s ${subcategoryLabel} ${productTypeLabel}. Premium quality, nationwide delivery. Cash on delivery available.`
    : `Discover our exclusive range of ${categoryLabel}'s ${productTypeLabel}. Premium quality, nationwide delivery. Cash on delivery available.`;

  const path = subcategory
    ? `/${productType}/${category}?subcategory=${subcategory}`
    : `/${productType}/${category}`;

  return getMetadata({
    title,
    description,
    path,
  });
}

export default async function ProductCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { productType, category } = params;
  const { subcategory } = searchParams;

  // Validate parameters
  if (
    !VALID_PRODUCT_TYPES.includes(productType as any) ||
    !VALID_CATEGORIES.includes(category as any)
  ) {
    notFound();
  }

  // Validate subcategory if provided
  if (subcategory) {
    const validSubcategories = PRODUCT_TYPE_CONFIG[
      productType as keyof typeof PRODUCT_TYPE_CONFIG
    ]?.subcategories as readonly string[];
    if (validSubcategories && !validSubcategories.includes(subcategory)) {
      notFound();
    }
  }

  const supabase = createClient();

  // Build query
  let query = supabase
    .from("products")
    .select("*")
    .eq("productType", productType)
    .eq("category", category)
    .in("status", ["active", "coming_soon"])
    .order("createdAt", { ascending: false });

  // Add subcategory filter if provided
  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  }

  const { data } = await query;

  const products: Product[] = (data || []).map(transformProduct);

  // Generate title and description
  const productTypeLabel =
    productType.charAt(0).toUpperCase() + productType.slice(1);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const subcategoryLabel = subcategory
    ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
    : "";

  const title = subcategory
    ? `${categoryLabel}'s ${subcategoryLabel} ${productTypeLabel}`
    : `${categoryLabel}'s ${productTypeLabel}`;

  const description = subcategory
    ? `Discover our exclusive range of ${categoryLabel}'s ${subcategoryLabel} ${productTypeLabel}. Premium quality, nationwide delivery.`
    : `Discover our exclusive range of ${categoryLabel}'s ${productTypeLabel}. Premium quality, nationwide delivery.`;

  return (
    <CategoryPageLayout
      title={title}
      description={description}
      products={products}
      category={category}
      productType={productType}
      subcategory={subcategory}
      initialSort={searchParams.sort || "featured"}
    />
  );
}


