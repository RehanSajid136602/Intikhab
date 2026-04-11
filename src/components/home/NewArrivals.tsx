"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

interface NewArrivalsProps {
  products: Product[];
}

/**
 * "New Arrivals" section displaying the latest products on the homepage.
 * Follows industry standards from Nike, Zappos, and major retailers:
 * - Shows latest 8-12 products across all categories
 * - Ordered by newest first (createdAt descending)
 * - Clean grid layout with product cards
 * - Positioned prominently below hero slider
 */
function NewArrivals({ products }: NewArrivalsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Show up to 12 latest products
  const displayProducts = products.slice(0, 12);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white py-10 md:py-14"
    >
      <div className="container mx-auto px-4">
        <SectionTitle
          title="New Arrivals"
          subtitle="Fresh drops, just landed"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product: Product, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <ProductCard product={product} showImageCarousel />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export { NewArrivals };
