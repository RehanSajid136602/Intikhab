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
