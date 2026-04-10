/**
 * Shared transform functions to convert Supabase snake_case DB rows
 * into the camelCase TypeScript interfaces used by the frontend.
 */

import type { Product } from '@/types/product';

export function transformProduct(row: Record<string, unknown>): Product {
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

export function transformProducts(rows: Record<string, unknown>[]): Product[] {
  return rows.map(transformProduct);
}
