import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/category/CategoryPageLayout';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types/product';

export const metadata: Metadata = {
  title: "Women's Shoes & Sneakers | Intikhab",
  description: "Explore women's footwear - sneakers, heels, and casual shoes. Free nationwide delivery on prepaid orders.",
};

export default async function WomenCategoryPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', 'women')
    .eq('status', 'active')
    .order('createdAt', { ascending: false });

  const products: Product[] = (data || []).map(transformProduct);

  return (
    <CategoryPageLayout
      title="Women's Collection"
      description="Explore our stylish women's footwear collection. From casual sneakers to elegant shoes, find your perfect pair."
      products={products}
      heroImage="/intikhab-man-relaxed-chair-blue.jpeg"
      category="women"
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
