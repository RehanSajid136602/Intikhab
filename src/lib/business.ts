/**
 * Single source of truth for Intikhab business identity and local-SEO copy.
 *
 * All on-site business name, contact details, and service-area text must be
 * sourced from here so they stay consistent across the footer, about page,
 * contact page, and shipping policy. Do not hardcode these values elsewhere.
 */

export const BUSINESS = {
  name: "Intikhab",
  tagline: "Selection That Matters",
  /** Human-readable, crawlable one-liner used in footer/about. */
  serviceAreaText: "Serving customers across Pakistan with nationwide delivery.",
  email: "intikhab.pakistan@gmail.com",
  /** E.164-style phone used for tel:/wa.me links. */
  phone: "+92 332 3130689",
  /** Display phone for crawlers / screen readers. */
  phoneDisplay: "+92 332 3130689",
  whatsapp: "https://wa.me/923323130689",
  supportHours: "Monday–Saturday, 10:00 am to 9:30 pm",
  /** Base city where the business operates from. */
  baseCity: "Karachi, Pakistan",
} as const;

/**
 * Canonical list of major cities Intikhab ships to.
 * This is the ONLY city list in the codebase — shipping UI copy, the
 * shipping policy, and footer all consume it so the names never diverge.
 */
export const SERVICE_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
] as const;

export type ServiceCity = (typeof SERVICE_CITIES)[number];

/**
 * Builds a natural, crawlable sentence listing the cities we deliver to.
 * Example: "Shipping available to Karachi, Lahore, Islamabad, Rawalpindi and
 * across Pakistan."
 */
export function buildShippingCitiesLine(cities: readonly string[] = SERVICE_CITIES): string {
  if (cities.length === 0) return "Shipping available across Pakistan.";
  if (cities.length === 1) return `Shipping available to ${cities[0]} and across Pakistan.`;

  const head = cities.slice(0, -1).join(", ");
  const last = cities[cities.length - 1];
  return `Shipping available to ${head} and ${last} across Pakistan.`;
}
