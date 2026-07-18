import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types/product";
import { notFound } from "next/navigation";
import { PRODUCT_TYPE_CONFIG } from "@/lib/sizeSystems";
import { transformProduct } from "@/lib/transformers";

interface PageProps {
  params: {
    productType: string;
  };
}

const VALID_PRODUCT_TYPES = [
  "shoes",
  "bags",
  "accessories",
  "clothing",
] as const;
const CATEGORIES = ["men", "women", "kids", "unisex"] as const;

import { getMetadata } from "@/lib/seo";
import { getFirstProductImage } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { productType } = params;
  const productTypeLabel =
    productType.charAt(0).toUpperCase() + productType.slice(1);

  return getMetadata({
    title: `${productTypeLabel} | Intikhab`,
    description: `Shop our collection of ${productTypeLabel}. Premium quality, nationwide delivery. Cash on delivery available.`,
    path: `/${productType}`,
  });
}

export default async function ProductTypePage({ params }: PageProps) {
  const { productType } = params;

  // Validate product type
  if (!VALID_PRODUCT_TYPES.includes(productType as any)) {
    notFound();
  }

  const supabase = createClient();

  // Fetch featured products for this product type (limit 8)
  const { data: featuredData } = await supabase
    .from("products")
    .select("*")
    .eq("productType", productType)
    .in("status", ["active", "coming_soon"])
    .order("createdAt", { ascending: false })
    .limit(8);

  const featuredProducts: Product[] = (featuredData || []).map(
    transformProduct,
  );

  const productTypeLabel =
    productType.charAt(0).toUpperCase() + productType.slice(1);
  const subcategories =
    PRODUCT_TYPE_CONFIG[productType as keyof typeof PRODUCT_TYPE_CONFIG]
      ?.subcategories || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-brand-dark text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {productTypeLabel}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Discover our exclusive collection of{" "}
            {productTypeLabel.toLowerCase()}. Premium quality, designed for
            style and comfort.
          </p>
        </div>
      </section>

      {/* Gender Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-brand-dark mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/${productType}/${category}`}
                className="group"
              >
                <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors">
                  <h3 className="text-lg font-semibold text-brand-dark group-hover:text-brand-red transition-colors capitalize">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="section-title mb-8">
              All {productTypeLabel}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 relative">
                      {(() => {
                        const img = getFirstProductImage(product.images);
                        return img ? (
                          <Image
                            src={img}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-mono text-xs">
                            No Image
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-brand-dark text-sm mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-brand-red font-bold">
                        PKR {product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title mb-8">
              Browse by Style
            </h2>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory}
                  href={`/${productType}/men?subcategory=${subcategory}`}
                  className="px-6 py-3 border border-brand-border rounded-lg hover:border-brand-dark hover:bg-brand-dark hover:text-white transition-all capitalize"
                >
                  {subcategory}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


