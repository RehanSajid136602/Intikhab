'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductTabs } from '@/hooks/useProductTabs';
import { products } from '@/data/products';
import type { Category } from '@/types/product';
import { homepageImages } from '@/data/homepageImages';

const tabs = [
  { label: 'MEN', value: 'men' },
  { label: 'WOMEN', value: 'women' },
  { label: 'KIDS', value: 'kids' },
] as const;

/**
 * Gender category tabs (MEN/WOMEN/KIDS) with product grid per tab.
 */
function GenderTabs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { activeTab, setActiveTab } = useProductTabs('men');

  const getProductsByCategory = (cat: Category) =>
    products.filter((p) => p.category === cat).slice(0, 4);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      id="products"
      className="bg-white py-10"
    >
      <div className="container mx-auto px-4">
        <SectionTitle title="Shop by Category" />

        {/* Tab Buttons */}
        <div className="flex justify-center gap-2 md:gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-6 md:px-8 py-2.5 text-xs md:text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === tab.value
                  ? 'border-brand-dark text-brand-dark'
                  : 'border-transparent text-brand-gray hover:text-brand-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {getProductsByCategory(activeTab as Category).length === 0 ? (
              homepageImages.primaryCategories.map((cat, i) => (
                <Link
                  key={i}
                  href={cat.href}
                  className="group relative overflow-hidden rounded-sm aspect-square block border border-brand-border"
                >
                  <Image
                    src={cat.src}
                    alt={cat.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    quality={85}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-white font-bold text-sm tracking-widest uppercase mb-1 drop-shadow-md">
                      {cat.label}
                    </span>
                    <span className="text-white/80 text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              getProductsByCategory(activeTab as Category).map(
                (product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ),
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export { GenderTabs };
