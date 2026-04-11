/**
 * Size system configuration for different product types.
 * SHOES: Numeric EU sizes only (35-46) with per-size quantity
 * OTHERS: Various size systems (S/M/L, one-size, numeric)
 */

import type { ProductType, SizeSystem } from "@/types/product";

/**
 * SHOE_SIZES: EU sizes 35-46 (numeric, required for shoes)
 * Each size has individual quantity input
 */
export const SHOE_SIZES = {
  name: "EU (European)",
  sizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],
  type: "shoe" as const,
} as const;

/**
 * SIZE_SYSTEMS: Various size systems for non-shoe products
 */
export const SIZE_SYSTEMS = {
  bag: {
    name: "Bag Size",
    sizes: ["small", "medium", "large", "xl"],
    type: "labeled" as const,
    labels: {
      small: "Small",
      medium: "Medium",
      large: "Large",
      xl: "Extra Large",
    },
  },
  general: {
    name: "General",
    sizes: ["one-size", "s", "m", "l", "xl"],
    type: "labeled" as const,
    labels: {
      "one-size": "One Size",
      s: "Small",
      m: "Medium",
      l: "Large",
      xl: "Extra Large",
    },
  },
  numeric: {
    name: "Numeric",
    sizes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    type: "numeric" as const,
  },
} as const;

/**
 * Product Type Configuration
 * SHOES: Fixed EU numeric sizes (35-46) with per-size quantity
 * OTHERS: Configurable size systems, no required size grid
 */
export const PRODUCT_TYPE_CONFIG = {
  shoes: {
    sizeSystem: "eu" as SizeSystem,
    sizeType: "shoe" as const,
    subcategories: ["sneakers", "formal", "casual", "sandals", "sports", "boots"],
    requiresSizeQuantities: true,
  },
  bags: {
    sizeSystem: "bag" as SizeSystem,
    sizeType: "labeled" as const,
    subcategories: ["handbags", "backpacks", "clutches", "tote-bags", "crossbody"],
    requiresSizeQuantities: false,
  },
  accessories: {
    sizeSystem: "general" as SizeSystem,
    sizeType: "labeled" as const,
    subcategories: ["belts", "wallets", "socks", "laces", "insoles"],
    requiresSizeQuantities: false,
  },
  clothing: {
    sizeSystem: "general" as SizeSystem,
    sizeType: "labeled" as const,
    subcategories: ["t-shirts", "shirts", "pants", "jackets"],
    requiresSizeQuantities: false,
  },
} as const;

/**
 * Returns EU shoe sizes array [35, 36, 37, ..., 46]
 */
export function getShoeSizes(): readonly string[] {
  return SHOE_SIZES.sizes;
}

/**
 * Returns configuration for a specific product type
 */
export function getProductTypeConfig(productType: ProductType) {
  return PRODUCT_TYPE_CONFIG[productType];
}

/**
 * Returns available subcategories for a product type
 */
export function getSubcategories(productType: ProductType): readonly string[] {
  return PRODUCT_TYPE_CONFIG[productType].subcategories;
}

/**
 * Returns whether a product type requires per-size quantity inputs
 * (true for shoes, false for others)
 */
export function requiresSizeQuantities(productType: ProductType): boolean {
  return PRODUCT_TYPE_CONFIG[productType].requiresSizeQuantities;
}

/**
 * Returns the default size system for a product type
 */
export function getDefaultSizeSystem(productType: ProductType): SizeSystem {
  return PRODUCT_TYPE_CONFIG[productType].sizeSystem;
}
