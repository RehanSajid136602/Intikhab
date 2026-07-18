import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { CategoryPageLayout } from "@/components/category/CategoryPageLayout";
import { transformProducts } from "@/lib/transformers";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const CATEGORY_CONFIGS: Record<
  string,
  {
    name: string;
    h1: string;
    intro: string;
    metaTitle: string;
    metaDesc: string;
    subcategories: string[];
    keywords: string[];
  }
> = {
  sneakers: {
    name: "Sneakers",
    h1: "Premium Sneakers Online at Intikhab",
    intro: "Explore Intikhab’s sneaker collection built for everyday comfort, clean streetwear styling, and modern casual outfits.",
    metaTitle: "Sneakers — Premium Footwear Collection | Intikhab",
    metaDesc: "Browse Intikhab's range of premium sneakers, designed for daily comfort and clean streetwear styles.",
    subcategories: ["sneakers", "sneaker", "sports"],
    keywords: ["sneakers", "sports shoes", "streetwear sneakers", "comfortable sneakers"],
  },
  "formal-shoes": {
    name: "Formal Shoes",
    h1: "Elegant Formal Shoes at Intikhab",
    intro: "Browse our premium formal shoes, handcrafted dress shoes, oxfords, and derbies for meetings and special occasions.",
    metaTitle: "Formal Shoes — Elegant Dress Footwear Collection | Intikhab",
    metaDesc: "Shop premium leather formal shoes from Intikhab. Handcrafted dress shoes, oxfords, and derbies for ultimate elegance.",
    subcategories: ["formal", "dress", "oxfords", "derbies"],
    keywords: ["formal shoes", "oxfords", "derbies", "leather shoes", "dress shoes"],
  },
  "casual-shoes": {
    name: "Casual Shoes",
    h1: "Everyday Casual Shoes at Intikhab",
    intro: "Discover comfortable, versatile casual shoes perfect for daily wear, weekend outings, and smart-casual styling.",
    metaTitle: "Casual Shoes — Everyday Comfort Collection | Intikhab",
    metaDesc: "Browse casual shoes at Intikhab. Find comfortable, breathable everyday shoes for casual and smart-casual outfits.",
    subcategories: ["casual", "loafers", "boots"], // casual fallbacks
    keywords: ["casual shoes", "everyday footwear", "breathable shoes", "men casual shoes"],
  },
  loafers: {
    name: "Loafers",
    h1: "Premium Slip-On Loafers at Intikhab",
    intro: "Explore Intikhab's sleek slip-on loafers, blending premium materials with effortless style for smart-casual events.",
    metaTitle: "Loafers — Premium Slip-On Footwear Collection | Intikhab",
    metaDesc: "Shop premium loafers online at Intikhab. Elegant, comfortable slip-on shoes for smart-casual and formal wear.",
    subcategories: ["loafers", "loafer"],
    keywords: ["loafers", "slip-on shoes", "leather loafers", "casual loafers"],
  },
  boots: {
    name: "Boots",
    h1: "Durable Leather Boots at Intikhab",
    intro: "Discover rugged, high-quality boots crafted with durable leather, robust traction, and weather-resistant designs.",
    metaTitle: "Boots — Durable Outdoor & Casual Footwear | Intikhab",
    metaDesc: "Browse durable boots at Intikhab. Handcrafted leather boots designed for rugged adventures and stylish winter looks.",
    subcategories: ["boots", "boot"],
    keywords: ["boots", "leather boots", "winter boots", "outdoor boots"],
  },
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const config = CATEGORY_CONFIGS[params.category];
  if (!config) {
    return { title: "Category Not Found | Intikhab" };
  }

  return getMetadata({
    title: config.metaTitle,
    description: config.metaDesc,
    path: `/categories/${params.category}`,
  });
}

export const dynamic = "force-dynamic";

export default async function ShoeCategoryPage({ params }: CategoryPageProps) {
  const config = CATEGORY_CONFIGS[params.category];
  if (!config) {
    notFound();
  }

  const supabase = createClient();

  // Fetch all active products
  const { data } = await supabase
    .from("products")
    .select("*")
    .in("status", ["active", "coming_soon"])
    .order("createdAt", { ascending: false });

  const allProducts = transformProducts(data || []);

  // Filter products matching category configuration
  const filteredProducts = allProducts.filter((product) => {
    // 1. Match subcategory string (case insensitive)
    if (product.subcategory) {
      const sub = product.subcategory.toLowerCase();
      if (config.subcategories.some((val) => sub.includes(val))) {
        return true;
      }
    }

    // 2. Fallback: match by product name or slug keywords
    const name = product.name.toLowerCase();
    const slug = product.slug.toLowerCase();
    const isSneaker = name.includes("sneaker") || slug.includes("sneaker");
    const isFormal = name.includes("formal") || slug.includes("formal") || name.includes("dress") || slug.includes("dress");
    const isLoafer = name.includes("loafer") || slug.includes("loafer");
    const isBoot = name.includes("boot") || slug.includes("boot");
    
    if (params.category === "sneakers" && isSneaker) return true;
    if (params.category === "formal-shoes" && isFormal) return true;
    if (params.category === "loafers" && isLoafer) return true;
    if (params.category === "boots" && isBoot) return true;
    if (params.category === "casual-shoes") {
      // Casual includes anything not explicitly formal, or items that are casual sneaker/loafers
      return !isFormal;
    }

    return false;
  });

  return (
    <CategoryPageLayout
      title={config.h1}
      description={config.intro}
      products={filteredProducts}
      category={params.category}
      productType="shoes"
      subcategory={config.name}
    />
  );
}
