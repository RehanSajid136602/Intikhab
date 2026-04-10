import dynamic from 'next/dynamic';
import { HeroSlider } from '@/components/home/HeroSlider';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/types/product';

const ShopByCategory = dynamic(
  () =>
    import('@/components/home/ShopByCategory').then((m) => m.ShopByCategory),
  { loading: () => <SectionSkeleton /> },
);

const CategoryMosaic = dynamic(
  () =>
    import('@/components/home/CategoryMosaic').then((m) => m.CategoryMosaic),
  { loading: () => <SectionSkeleton /> },
);

const InstaFeed = dynamic(
  () => import('@/components/home/InstaFeed').then((m) => m.InstaFeed),
  { loading: () => <SectionSkeleton /> },
);

const Testimonials = dynamic(
  () => import('@/components/home/Testimonials').then((m) => m.Testimonials),
  { loading: () => <SectionSkeleton /> },
);

const TrustBadges = dynamic(
  () => import('@/components/home/TrustBadges').then((m) => m.TrustBadges),
  { loading: () => <SectionSkeleton /> },
);

const Newsletter = dynamic(
  () => import('@/components/home/Newsletter').then((m) => m.Newsletter),
  { ssr: false },
);

function SectionSkeleton() {
  return (
    <div className="py-12 md:py-16 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-gray border-t-brand-dark rounded-full animate-spin" />
    </div>
  );
}

/**
 * Homepage rendering all sections in exact order.
 * Fetches products from Supabase for the ShopByCategory section.
 */
export default async function HomePage() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('createdAt', { ascending: false });

  const products: Product[] = (data || []).map(transformProduct);

  return (
    <>
      <HeroSlider />

      {/* Hero Divider */}
      <div className="py-6 flex items-center justify-center gap-4">
        <div className="h-px w-24 bg-brand-border" />
        <p className="text-brand-gray text-sm font-medium">
          Your Favorites from Sale Up to 50% OFF
        </p>
        <div className="h-px w-24 bg-brand-border" />
      </div>

      <ShopByCategory products={products} />
      <CategoryMosaic />
      <InstaFeed />
      <Testimonials />
      <TrustBadges />
      <Newsletter />
    </>
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
