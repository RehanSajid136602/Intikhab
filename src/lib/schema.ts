import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { BRAND, SHIPPING } from "@/lib/constants";
import type { Product } from "@/types/product";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description: "Premium shoes, sneakers, loafers, boots, and everyday footwear online in Pakistan.",
    email: BRAND.email,
    telephone: BRAND.phone,
    sameAs: [BRAND.facebook, BRAND.instagram, BRAND.whatsappChannel],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: BRAND.email,
      telephone: BRAND.phone,
      availableLanguage: ["English", "Urdu"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "21:30",
      },
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: "Premium shoes, sneakers, loafers, boots, and everyday footwear online at Intikhab.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function resolveImageUrl(image: string | undefined | null): string {
  if (!image || typeof image !== "string" || image.trim() === "") {
    return `${SITE_URL}/images/intikhab/intikhab-hero-premium-sneakers.webp`;
  }
  return image.startsWith("http") ? image : `${SITE_URL}${image}`;
}

function resolveAvailability(product: Product): string {
  if (product.status === "coming_soon") {
    return "https://schema.org/PreOrder";
  }
  return product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
}

function buildPaymentMethods() {
  return [
    "https://schema.org/CashOnDelivery",
    "https://schema.org/ManualPayment",
  ];
}

function buildShippingDestinations() {
  return [
    {
      "@type": "Country",
      name: "Pakistan",
      addressCountry: "PK",
    },
  ];
}

export function productJsonLd(product: Product) {
  const images = product.images.map(resolveImageUrl);

  const offer = {
    "@type": "Offer",
    url: `${SITE_URL}/product/${product.slug}`,
    priceCurrency: "PKR",
    price: product.price ?? 0,
    availability: resolveAvailability(product),
    itemCondition: "https://schema.org/NewCondition",
    acceptedPaymentMethod: buildPaymentMethods(),
    areaServed: buildShippingDestinations(),
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: SHIPPING.KARACHI_RATE,
        currency: "PKR",
      },
      shippingDestination: {
        "@type": "Country",
        name: "Pakistan",
        addressCountry: "PK",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 2,
          unitCode: "d",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 2,
          maxValue: 5,
          unitCode: "d",
        },
      },
    },
  };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description,
    sku: product.sku || product.id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: product.brand || SITE_NAME,
    },
    offers: offer,
  };
}

export function breadcrumbListJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href && item.href.startsWith("http")
        ? item.href
        : item.href
          ? `${SITE_URL}${item.href}`
          : undefined,
    })),
  };
}
