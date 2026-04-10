import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/category/CategoryPageLayout';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types/product';

export const metadata: Metadata = {
  title: "Men's Shoes & Sneakers | Intikhab",
  description: "Shop men's sneakers and casual shoes. Premium quality, nationwide delivery. Cash on delivery available.",
};

export default async function MenCategoryPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'men')
    .eq('status', 'active')
    .order('createdAt', { ascending: false });

  const products: Product[] = (data || []).map(transformProduct);

  return (
    <CategoryPageLayout
      title="Men's Collection"
      description="Discover our exclusive range of men's sneakers and casual shoes. Designed for comfort, style, and everyday wear."
      products={products}
      heroImage="/intikhab-man-bench-indoor-white.jpeg"
      category="men"
    />
  );
}

function transformProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    category: row.category as 'men' | 'women' | 'kids',
    price: row.price as number,
    originalPrice: row.originalPrice as number | undefined,
    images: row.images as string[],
    badge: (row.badge as 'SALE' | 'NEW') || null,
    inStock: row["inStock"] as boolean,
    stock: row.stock as number,
    installment: row.installment as number,
    description: row.description as string,
    sku: row.sku as string,
    status: row.status as 'active' | 'draft',
    sizes: row.sizes as number[],
  };
}
