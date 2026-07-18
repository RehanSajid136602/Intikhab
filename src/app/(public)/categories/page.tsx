import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = getMetadata({
  title: "Shoe Categories — Sneakers, Loafers, Boots & Formal Shoes | Intikhab",
  description: "Browse Intikhab shoe categories including sneakers, formal shoes, loafers, boots, casual shoes, and everyday footwear.",
  path: "/categories",
});

const CATEGORIES_DATA = [
  {
    slug: "sneakers",
    name: "Sneakers",
    title: "Premium Sneakers",
    description: "Built for everyday comfort, clean streetwear styling, and modern casual outfits.",
    image: "/intikhab-sneakers-balcony-sunset-blue.jpeg",
    count: "Sneaker Collection"
  },
  {
    slug: "formal-shoes",
    name: "Formal Shoes",
    title: "Elegant Formal Shoes",
    description: "Handcrafted leather dress shoes, oxfords, and derbies for meetings and special occasions.",
    image: "/shoe_black_01.jpeg",
    count: "Dress Shoes Collection"
  },
  {
    slug: "casual-shoes",
    name: "Casual Shoes",
    title: "Everyday Casual Shoes",
    description: "Versatile casual shoes combining breathable materials with relaxed designs.",
    image: "/intikhab-sneakers-woven-mat-black.jpeg",
    count: "Casual Footwear"
  },
  {
    slug: "loafers",
    name: "Loafers",
    title: "Slip-On Loafers",
    description: "Sleek and comfortable slip-on loafers, perfect for smart-casual wear.",
    image: "/shoe_black_02.jpeg",
    count: "Loafer Collection"
  },
  {
    slug: "boots",
    name: "Boots",
    title: "Durable Boots",
    description: "Rugged boots built with weather-resistant materials and robust traction.",
    image: "/shoe_collection.jpeg",
    count: "Boots Collection"
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            Shoe Categories
          </h1>
          <p className="text-lg text-brand-gray max-w-2xl mx-auto">
            Discover our carefully curated ranges, designed to offer unmatched style, comfort, and durability for any event.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-brand-border transition-all duration-300 flex flex-col h-full"
            >
              {/* Category Image */}
              <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
                <Image
                  src={cat.image}
                  alt={`${cat.name} Collection by Intikhab`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-semibold px-3 py-1 rounded-full border border-brand-border">
                  {cat.count}
                </div>
              </div>

              {/* Category Details */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-red transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-brand-gray text-sm line-clamp-3 mb-6">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center text-sm font-semibold text-brand-dark group-hover:text-brand-red gap-2 transition-colors mt-auto">
                  Browse Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
