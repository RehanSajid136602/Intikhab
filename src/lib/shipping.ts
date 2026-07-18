/**
 * Location-based shipping cost logic.
 * Source of truth for shipping fee calculation (used by both client and server).
 */
import { SHIPPING } from "@/lib/constants";

function normalizeCity(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, "");
}

function isKarachi(city: string): boolean {
  const normalized = normalizeCity(city);
  return SHIPPING.KARACHI_ALIASES.some((alias) => normalized === alias);
}

function getShippingFee(city: string): number {
  if (!city || !city.trim()) {
    return SHIPPING.DEFAULT_RATE;
  }
  return isKarachi(city) ? SHIPPING.KARACHI_RATE : SHIPPING.DEFAULT_RATE;
}

export { getShippingFee, isKarachi, normalizeCity };
