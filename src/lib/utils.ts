import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx for conditional class names.
 * Resolves conflicts and produces clean output.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Pakistani Rupees (PKR).
 * @param amount - The amount in PKR to format.
 * @returns Formatted string like "PKR 3,500".
 */
export function formatPKR(amount: number | null | undefined): string {
  if (amount == null) return "Pricing coming soon";
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

/**
 * Checks if a product is "new" (added within the last 14 days).
 * Industry standard: Nike, Zappos use 14-30 day windows for NEW badges.
 */
export function isNewProduct(createdAt: string | Date): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
}

/**
 * Safely extracts the first valid image URL from the product's images property.
 * If images is null, undefined, not an array, or does not contain any valid strings, returns null.
 */
export function getFirstProductImage(images?: string[] | null | any): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return null;
  }
  const firstValid = images.find((img) => typeof img === 'string' && img.trim() !== '');
  return firstValid || null;
}
