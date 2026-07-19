/**
 * Product, cart, and category type definitions.
 */

export type ProductType = "shoes" | "bags" | "accessories" | "clothing";

export type Category = "men" | "women" | "kids" | "unisex";

export type SizeSystem = "eu" | "uk" | "us" | "bag" | "general" | "numeric";

export type ProductStatus = "active" | "draft" | "coming_soon";

export type ProductBadge = "SALE" | "NEW" | null;

export interface SizeStock {
  size: string;
  stock: number;
  label?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  productType: ProductType;
  category: Category;
  subcategory?: string;
  price: number | null;
  originalPrice?: number;
  images: string[];
  badge: ProductBadge;
  inStock: boolean;
  stock: number;
  installment: number;
  description: string;
  sku: string;
  status: ProductStatus;
  sizeStock: SizeStock[];
  sizeSystem: SizeSystem;
  createdAt: string;
}

export interface CartItem {
  lineId: string;
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  availableStock?: number;
  productType: ProductType;
}
