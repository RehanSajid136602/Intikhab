import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/category/CategoryPageLayout';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: "Men's Shoes & Sneakers | Intikhab",
  description: "Shop men's sneakers and casual shoes. Premium quality, nationwide delivery. Cash on delivery available.",
};

export default function MenCategoryPage() {
  const menProducts = products.filter((p) => p.category === 'men');

  return (
    <CategoryPageLayout
      title="Men's Collection"
      description="Discover our exclusive range of men's sneakers and casual shoes. Designed for comfort, style, and everyday wear."
      products={menProducts}
      heroImage="/intikhab-man-bench-indoor-white.jpeg"
      category="men"
    />
  );
}
