import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/category/CategoryPageLayout';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: "Kids' Shoes & Sneakers | Intikhab",
  description: "Fun and comfortable shoes for kids. Durable designs that keep up with active little ones.",
};

export default function KidsCategoryPage() {
  const kidsProducts = products.filter((p) => p.category === 'kids');

  return (
    <CategoryPageLayout
      title="Kids' Collection"
      description="Fun and comfortable shoes for kids. Durable designs that keep up with active little ones."
      products={kidsProducts}
      heroImage="/intikhab-man-sitting-bench-white.jpeg"
      category="kids"
    />
  );
}
