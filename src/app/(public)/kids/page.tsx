import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/category/CategoryPageLayout';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types/product';

export const metadata: Metadata = {
  title: "Kids' Shoes & Sneakers | Intikhab",
  description: "Fun and comfortable shoes for kids. Durable designs that keep up with active little ones.",
};

export default async function KidsCategoryPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'kids')
    .eq('status', 'active')
    .order('createdAt', { ascending: false });

  const products: Product[] = (data || []).map(transformProduct);

  return (
    <CategoryPageLayout
      title="Kids' Collection"
      description="Fun and comfortable shoes for kids. Durable designs that keep up with active little ones."
      products={products}
      heroImage="/intikhab-man-sitting-bench-white.jpeg"
      category="kids"
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
