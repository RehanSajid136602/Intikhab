'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductTabs } from '@/hooks/useProductTabs';
import { products } from '@/data/products';
import type { Category, Product } from '@/types/product';

const tabs = [
  { label: 'MEN', value: 'men' },
  { label: 'WOMEN', value: 'women' },
  { label: 'KIDS', value: 'kids' },
] as const;

/**
 * Gender category tabs (MEN/WOMEN/KIDS) with product grid per tab.
 * MEN/WOMEN show "Coming Soon". KIDS shows real products with image carousel.
 */
function ShopByCategory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { activeTab, setActiveTab } = useProductTabs('men');

  const getProductsByCategory = (cat: Category) =>
    products.filter((p) => p.category === cat);

  const currentProducts = getProductsByCategory(activeTab as Category);
  const hasProducts = currentProducts.length > 0;

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
        <div
          className="flex justify-center gap-2 md:gap-4 mb-8"
          role="tablist"
          aria-label="Product category tabs"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              aria-controls={`panel-${tab.value}`}
              id={`tab-${tab.value}`}
              onClick={() => setActiveTab(tab.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const prevIndex = (index - 1 + tabs.length) % tabs.length;
                  setActiveTab(tabs[prevIndex].value);
                }
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  const nextIndex = (index + 1) % tabs.length;
                  setActiveTab(tabs[nextIndex].value);
                }
              }}
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
            {!hasProducts
              ? Array.from({ length: 4 }).map((_, i: number) => (
                  <div
                    key={i}
                    className="product-card relative bg-white rounded-sm overflow-hidden border border-brand-border"
                  >
                    <div className="aspect-square overflow-hidden bg-brand-light-gray flex items-center justify-center">
                      <p className="text-[13px] font-medium text-brand-gray opacity-60">
                        Coming Soon
                      </p>
                    </div>
                  </div>
                ))
              : currentProducts.map((product: Product, index: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      showImageCarousel
                    />
                  </motion.div>
                ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export { ShopByCategory };
