import { redirect } from 'next/navigation';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

/**
 * Redirects from old /products/[slug] route to new /product/[slug] route.
 * Preserves old links from bookmarks/search.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  redirect(`/product/${params.slug}`);
}
