import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailPage } from "@/components/products/ProductDetailPage";
import type { Product } from "@/types/product";
import { getMetadata, buildProductTitle, buildProductMetaDescription } from "@/lib/seo";
import { transformProduct } from "@/lib/transformers";
import { productJsonLd } from "@/lib/schema";

export const revalidate = 60;

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const supabase = createClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .in("status", ["active", "coming_soon"])
    .single();

  if (!data) {
    return { title: "Product Not Found | Intikhab" };
  }

  const product = transformProduct(data);

  const title = buildProductTitle(product.name);
  const description = buildProductMetaDescription(product.name, {
    productType: product.productType,
    category: product.category,
    description: product.description,
    price: product.price,
    inStock: product.inStock,
  });
  const ogImage = product.images && product.images[0] ? product.images[0] : undefined;
  const isComingSoon = product.status === "coming_soon";

  return getMetadata({
    title,
    description,
    path: `/product/${params.slug}`,
    ogImage,
    noindex: isComingSoon,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient();

  // Fetch product + all active products in parallel
  const [productResult, allActiveResult] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .in("status", ["active", "coming_soon"])
      .single(),
    supabase
      .from("products")
      .select("*")
      .in("status", ["active", "coming_soon"])
      .limit(20),
  ]);

  const productRow = productResult.data;

  if (!productRow) {
    notFound();
  }

  // Filter related products from the pre-fetched set
  const relatedRows = (allActiveResult.data || [])
    .filter((p: Record<string, unknown>) => p.category === productRow.category && p.id !== productRow.id)
    .slice(0, 4);

  const product: Product = transformProduct(productRow);
  const relatedProducts: Product[] = relatedRows.map(transformProduct);

  const jsonLd = productJsonLd(product);

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


