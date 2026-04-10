import dynamic from 'next/dynamic';
import { HeroSlider } from '@/components/home/HeroSlider';
import { ShopByCategory } from '@/components/home/ShopByCategory';
import { CollectionMosaic } from '@/components/home/CollectionMosaic';

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
 */
export default function HomePage() {
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

      <ShopByCategory />
      <CategoryMosaic />
      <CollectionMosaic />
      <InstaFeed />
      <Testimonials />
      <TrustBadges />
      <Newsletter />
    </>
  );
}
