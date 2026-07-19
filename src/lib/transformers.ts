/**
 * Shared transform functions to convert Supabase snake_case DB rows
 * into the camelCase TypeScript interfaces used by the frontend.
 */

import type { Product } from "@/types/product";

export function transformProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    brand: row.brand as string,
    productType: (row.productType as Product["productType"]) || "shoes",
    category: (row.category as Product["category"]) || "men",
    subcategory: row.subcategory as string | undefined,
    price: row.price == null ? null : (row.price as number),
    originalPrice: row.originalPrice as number | undefined,
    images: row.images as string[],
    badge: (row.badge as Product["badge"]) || null,
    inStock: row["inStock"] as boolean,
    stock: row.stock as number,
    installment: row.installment as number,
    description: row.description as string,
    sku: row.sku as string,
    status: (row.status as Product["status"]) || "active",
    sizeStock: (row["sizeStock"] as Product["sizeStock"]) || [],
    sizeSystem: (row["sizeSystem"] as Product["sizeSystem"]) || "eu",
    createdAt: row["createdAt"] as string,
  };
}

export function transformProducts(rows: Record<string, unknown>[]): Product[] {
  return rows.map(transformProduct);
}
