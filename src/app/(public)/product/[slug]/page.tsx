import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailPage } from "@/components/products/ProductDetailPage";
import type { Product } from "@/types/product";
import { getMetadata, SITE_URL } from "@/lib/seo";
import { transformProduct } from "@/lib/transformers";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const supabase = createClient();

  const { data } = await supabase
    .from("products")
    .select("name, description, category, images")
    .eq("slug", params.slug)
    .in("status", ["active", "coming_soon"])
    .single();

  if (!data) {
    return { title: "Product Not Found | Intikhab" };
  }

  const categoryLabel = data.category
    ? (data.category as string).charAt(0).toUpperCase() + (data.category as string).slice(1)
    : "Footwear";

  const title = `${data.name} — ${categoryLabel} | Intikhab`;
  const description = `Buy ${data.name} from Intikhab. Premium ${data.category || "footwear"} designed for comfort, style, and everyday wear.`;
  const ogImage = data.images && (data.images as string[])[0] ? (data.images as string[])[0] : undefined;

  return getMetadata({
    title,
    description,
    path: `/product/${params.slug}`,
    ogImage,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient();

  // Fetch product by slug
  const { data: productRow } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .in("status", ["active", "coming_soon"])
    .single();

  if (!productRow) {
    notFound();
  }

  // Fetch related products (same category)
  const { data: relatedRows } = await supabase
    .from("products")
    .select("*")
    .eq("category", productRow.category)
    .in("status", ["active", "coming_soon"])
    .neq("id", productRow.id)
    .limit(4);

  const product: Product = transformProduct(productRow);
  const relatedProducts: Product[] = (relatedRows || []).map(transformProduct);

  // Generate dynamic JSON-LD Product Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map((img) =>
      img.startsWith("http") ? img : `${SITE_URL}${img}`
    ),
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Intikhab",
    },
    "category": product.category,
    "sku": product.sku || product.id,
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/product/${product.slug}`,
      "priceCurrency": "PKR",
      "price": product.price,
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailPage product={product} relatedProducts={relatedProducts} />
    </>
  );
}


