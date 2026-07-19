/**
 * Phone number helpers for order lookup and WhatsApp links.
 */

/**
 * Strips non-digits and returns a canonical last-10-digit form for matching.
 * Handles formats like +92 332 3130689, 03323130689, 923323130689.
 */
export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  // Pakistan: strip leading country code 92 or leading 0
  let normalized = digits;
  if (normalized.startsWith("92") && normalized.length >= 12) {
    normalized = normalized.slice(2);
  }
  if (normalized.startsWith("0") && normalized.length >= 11) {
    normalized = normalized.slice(1);
  }

  // Prefer last 10 digits for local mobile numbers
  if (normalized.length > 10) {
    normalized = normalized.slice(-10);
  }

  return normalized;
}

/**
 * Returns true when two phone strings refer to the same number.
 */
export function phonesMatch(a: string, b: string): boolean {
  const left = normalizePhoneDigits(a);
  const right = normalizePhoneDigits(b);
  if (!left || !right) return false;
  return left === right;
}

/**
 * Builds a wa.me number from brand phone (digits only, with country code).
 */
export function toWhatsAppNumber(phone: string, defaultCountry = "92"): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return defaultCountry;

  if (digits.startsWith(defaultCountry)) {
    return digits;
  }
  if (digits.startsWith("0")) {
    return defaultCountry + digits.slice(1);
  }
  // Local 10-digit mobile without leading 0
  if (digits.length === 10) {
    return defaultCountry + digits;
  }
  return digits;
}
