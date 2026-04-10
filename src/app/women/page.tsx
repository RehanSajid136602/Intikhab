import type { Metadata } from 'next';
import { CategoryPageLayout } from '@/components/category/CategoryPageLayout';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: "Women's Shoes & Sneakers | Intikhab",
  description: "Explore women's footwear - sneakers, heels, and casual shoes. Free nationwide delivery on prepaid orders.",
};

export default function WomenCategoryPage() {
  const womenProducts = products.filter((p) => p.category === 'women');

  return (
    <CategoryPageLayout
      title="Women's Collection"
      description="Explore our stylish women's footwear collection. From casual sneakers to elegant shoes, find your perfect pair."
      products={womenProducts}
      heroImage="/intikhab-man-relaxed-chair-blue.jpeg"
      category="women"
    />
  );
}
