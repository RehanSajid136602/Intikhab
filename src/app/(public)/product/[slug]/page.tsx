import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProductDetailPage } from '@/components/products/ProductDetailPage';
import type { Product } from '@/types/product';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const supabase = createClient();

  const { data } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single();

  if (!data) {
    return { title: 'Product Not Found | Intikhab' };
  }

  return {
    title: `${data.name} | Intikhab`,
    description: data.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient();

  // Fetch product by slug
  const { data: productRow } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single();

  if (!productRow) {
    notFound();
  }

  // Fetch related products (same category)
  const { data: relatedRows } = await supabase
    .from('products')
    .select('*')
    .eq('category', productRow.category)
    .eq('status', 'active')
    .neq('id', productRow.id)
    .limit(4);

  const product: Product = transformProduct(productRow);
  const relatedProducts: Product[] = (relatedRows || []).map(transformProduct);

  return <ProductDetailPage product={product} relatedProducts={relatedProducts} />;
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
