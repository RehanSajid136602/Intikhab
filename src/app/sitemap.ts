import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // 1. Fetch all active products (exclude coming_soon and draft)
  const { data: productsData } = await supabase
    .from("products")
    .select("slug, status, updatedAt")
    .eq("status", "active");

  const productEntries = (productsData || []).map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // 2. Dynamic product type and gender categories combinations
  const productTypes = ["shoes", "bags", "accessories", "clothing"];
  const categories = ["men", "women", "kids", "unisex"];

  const typeEntries = productTypes.map((productType) => ({
    url: `${SITE_URL}/${productType}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const typeCategoryEntries = productTypes.flatMap((productType) =>
    categories.map((category) => ({
      url: `${SITE_URL}/${productType}/${category}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  // 3. Static shoe style categories (from categories config)
  const styleCategories = ["sneakers", "formal-shoes", "casual-shoes", "loafers", "boots"];
  const styleCategoryEntries = styleCategories.map((style) => ({
    url: `${SITE_URL}/categories/${style}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 4. Static pages
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/categories", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" as const },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/terms-and-conditions", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/cookie-policy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/return-exchange-policy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/shipping-policy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/size-guide", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/track-order", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const staticEntries = staticPages.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  return [
    ...staticEntries,
    ...typeEntries,
    ...typeCategoryEntries,
    ...styleCategoryEntries,
    ...productEntries,
  ];
}
