/**
 * Global SEO Configuration for Intikhab
 */

export const SITE_NAME = "Intikhab";
export const SITE_URL = "https://intikhab.vercel.app";

export const DEFAULT_TITLE = "Intikhab — Premium Shoes, Sneakers & Footwear Online";
export const DEFAULT_DESCRIPTION = "Shop premium shoes, sneakers, loafers, boots, and everyday footwear at Intikhab. Discover stylish, comfortable, and modern shoes for every occasion.";

export const DEFAULT_KEYWORDS = [
  "shoes",
  "sneakers",
  "footwear",
  "loafers",
  "boots",
  "formal shoes",
  "casual shoes",
  "Pakistan",
  "online shoe store",
  "premium shoes",
  "Intikhab",
  "buy shoes online"
];

export const DEFAULT_OG_IMAGE = "/shoe_collection.jpeg";
export const SOCIAL_IMAGE = "/shoe_collection.jpeg";
export const BRAND_DESCRIPTION = "Shop premium shoes, sneakers, loafers, boots, and everyday footwear at Intikhab. Discover stylish, comfortable, and modern shoes for every occasion.";

/**
 * On-page SEO content helpers.
 *
 * All product copy is derived from the `Product` shape produced by
 * `transformProduct` (the single source of truth) so we never duplicate
 * product-shaping logic. Copy is written to read naturally — no keyword
 * stuffing. Titles target <= 60 chars to avoid Google truncation.
 */

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function humanCategory(productType: string, category: string): string {
  const pt = titleCase(productType);
  const cat = titleCase(category);
  // e.g. "Shoes" + "Men" -> "Men's Shoes"
  if (pt === "Shoes") return `${cat}'s Shoes`;
  return `${cat} ${pt}`;
}

/** "Buy [Product Name] Online in Pakistan | Intikhab" */
export function buildProductTitle(name: string): string {
  return `Buy ${name} Online in Pakistan | Intikhab`;
}

/**
 * Unique, keyword-rich meta description sourced from product data.
 * Mentions the product, a key selling point, and Pakistan/shipping context.
 */
export function buildProductMetaDescription(
  name: string,
  opts: {
    productType?: string;
    category?: string;
    description?: string;
    price?: number | null;
    inStock?: boolean;
  },
): string {
  const label = humanCategory(opts.productType || "shoes", opts.category || "men");
  const sellingPoint = opts.description
    ? opts.description.split(".")[0].trim()
    : `Premium ${label.toLowerCase()} designed for everyday comfort and style`;

  const availability = opts.inStock
    ? "in stock with free nationwide delivery"
    : "available to order with cash on delivery";

  const desc = `Buy ${name} — ${sellingPoint}. Shop authentic ${label.toLowerCase()} in Pakistan, ${availability}. Best price at Intikhab.`;

  // Google typically displays ~155 chars; trim cleanly if longer.
  return desc.length > 155 ? `${desc.slice(0, 152).trimEnd()}...` : desc;
}

/** Descriptive alt text for a product image. */
export function buildProductAlt(
  name: string,
  opts: { productType?: string; category?: string; index?: number },
): string {
  const label = humanCategory(opts.productType || "shoes", opts.category || "men");
  const base = `${name} - ${label} available in Pakistan`;
  return opts.index && opts.index > 0 ? `${base} (view ${opts.index + 1})` : base;
}

/** Keyword-driven H1 for a product page. */
export function buildProductH1(name: string, opts: { productType?: string; category?: string }): string {
  const label = humanCategory(opts.productType || "shoes", opts.category || "men");
  return `Buy ${name} — ${label} Online in Pakistan`;
}

/**
 * Category page helpers. `term` is the human category label
 * (e.g. "Men's Shoes", "Women's Loafers").
 */
export function buildCategoryTitle(term: string): string {
  return `${term} — Buy Online in Pakistan | Intikhab`;
}

export function buildCategoryMetaDescription(term: string): string {
  const desc = `Shop ${term.toLowerCase()} online in Pakistan at Intikhab. Explore the latest styles with the best ${term.toLowerCase()} price in Pakistan, free nationwide delivery and cash on delivery.`;
  return desc.length > 155 ? `${desc.slice(0, 152).trimEnd()}...` : desc;
}

export function buildCategoryH1(term: string): string {
  return `Buy ${term} Online in Pakistan`;
}

export function buildCategoryIntro(term: string): string {
  return `Explore Intikhab's collection of ${term.toLowerCase()} in Pakistan. Find the best ${term.toLowerCase()} price in Pakistan with premium quality, free nationwide delivery, and cash on delivery on every order.`;
}


interface MetadataProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
}

export function getMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false
}: MetadataProps) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: "en-PK",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`],
    },
    ...(noindex ? {
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      }
    } : {
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      }
    })
  };
}
