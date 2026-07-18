'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductTabs } from '@/hooks/useProductTabs';
import type { Category, Product } from '@/types/product';

const tabs = [
  { label: 'MEN', value: 'men' },
  { label: 'WOMEN', value: 'women' },
  { label: 'KIDS', value: 'kids' },
] as const;

interface ShopByCategoryProps {
  products: Product[];
}

/**
 * Gender category tabs (MEN/WOMEN/KIDS) with product grid per tab.
 * Receives products as props from server component.
 */
function ShopByCategory({ products }: ShopByCategoryProps) {
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
            {!hasProducts ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-brand-light-gray rounded-full flex items-center justify-center mb-4">
                  <Package className="w-7 h-7 text-brand-gray" />
                </div>
                <h3 className="text-sm font-semibold text-brand-dark">
                  No products in this category yet
                </h3>
                <p className="text-xs text-brand-gray mt-1 max-w-xs">
                  We&apos;re refreshing our collection for this category. Check back soon or browse our other categories.
                </p>
                <Link
                  href="/products"
                  className="mt-5 px-6 py-2.5 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-black transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            ) : (
              currentProducts.map((product: Product, index: number) => (
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
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export { ShopByCategory };
