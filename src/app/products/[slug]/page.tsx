import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { products } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';
import { ProductCardSkeleton } from '@/components/ui/SkeletonLoader';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

/**
 * Generates dynamic metadata for product pages for SEO optimization.
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Intikhab',
      description: 'The product you are looking for could not be found.',
    };
  }

  return {
    title: `${product.name} | Intikhab`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Intikhab`,
      description: product.description,
      images: [{ url: product.images[0], alt: product.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Intikhab`,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white py-8 md:py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="h-8 bg-brand-light-gray rounded animate-pulse mb-6 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <div className="aspect-square bg-brand-light-gray rounded-lg animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 bg-brand-light-gray rounded animate-pulse w-1/2" />
                <div className="h-12 bg-brand-light-gray rounded animate-pulse w-3/4" />
                <div className="h-6 bg-brand-light-gray rounded animate-pulse w-1/3" />
                <div className="h-24 bg-brand-light-gray rounded animate-pulse" />
                <div className="h-12 bg-brand-light-gray rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </Suspense>
  );
}
