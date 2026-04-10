/**
 * Product, cart, and category type definitions.
 */

export type Category = 'men' | 'women' | 'kids';

export type ProductStatus = 'active' | 'draft';

export type ProductBadge = 'SALE' | 'NEW' | null;

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  images: string[];
  badge: ProductBadge;
  inStock: boolean;
  stock: number;
  installment: number;
  description: string;
  sku: string;
  status: ProductStatus;
  sizes?: number[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}
