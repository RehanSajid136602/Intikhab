import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://intikhab.vercel.app";
  const lastModified = new Date();

  // Fetch product slugs from database
  let productSlugs: string[] = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase
        .from("products")
        .select("slug")
        .in("status", ["active", "coming_soon"]);
      if (data) {
        productSlugs = data.map((p) => `/product/${p.slug}`);
      }
    }
  } catch (error) {
    console.error("Error fetching sitemap slugs:", error);
  }

  // Fallback to static product slugs if DB fetch fails or has no entries
  if (productSlugs.length === 0) {
    productSlugs = [
      "/product/blue-sneaker",
      "/product/black-sneaker",
      "/product/blue-sneaker-women",
      "/product/black-sneaker-women",
    ];
  }

  const staticRoutes = [
    "",
    "/products",
    "/categories",
    "/about",
    "/contact",
    "/faq",
    "/size-guide",
    "/shipping-policy",
    "/return-exchange-policy",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  const categoryRoutes = [
    "/categories/sneakers",
    "/categories/formal-shoes",
    "/categories/casual-shoes",
    "/categories/loafers",
    "/categories/boots",
    "/shoes/men",
    "/shoes/women",
    "/shoes/kids",
    "/bags/women",
    "/accessories/unisex",
  ];

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...productSlugs];

  return allRoutes.map((route) => {
    let priority = 0.5;
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/products" || route === "/categories") {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (route.startsWith("/categories/")) {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route.startsWith("/shoes/") || route.startsWith("/bags/") || route.startsWith("/accessories/")) {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route.startsWith("/product/")) {
      priority = 0.7;
      changeFrequency = "weekly";
    } else if (route === "/contact") {
      priority = 0.6;
      changeFrequency = "monthly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });
}
