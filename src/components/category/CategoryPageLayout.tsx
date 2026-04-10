'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { Product } from '@/types/product';
import { formatPKR } from '@/lib/utils';

interface CategoryPageLayoutProps {
  title: string;
  description: string;
  products: Product[];
  heroImage?: string;
  category?: string;
}

/**
 * Reusable layout for category pages (Men, Women, Kids, Bags).
 * Shows products in a grid with a hero banner, filters, and sorting.
 */
export function CategoryPageLayout({
  title,
  description,
  products,
  heroImage,
  category,
}: CategoryPageLayoutProps) {
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allSizes = [6, 7, 8, 9, 10, 11];
  const allColors = ['Black', 'Blue', 'White', 'Red', 'Brown'];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by size
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes?.some((size) => selectedSizes.includes(size))
      );
    }

    // Filter by price
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, selectedSizes, selectedColors, priceRange, sortBy]);

  const activeFilterCount = selectedSizes.length + selectedColors.length;

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 50000]);
  };

  const hasProducts = filteredAndSortedProducts.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-gray-300">{description}</p>
          </motion.div>
        </div>
        {heroImage && (
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        )}
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          {category && (
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: title },
              ]}
              className="mb-6"
            />
          )}

          {/* Filter & Sort Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-brand-border rounded-lg hover:border-brand-dark transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-brand-red text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-brand-red hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm text-brand-gray">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-brand-dark">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-brand-red hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Size Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-brand-dark mb-3">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size]
                          );
                        }}
                        className={`w-10 h-10 border-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSizes.includes(size)
                            ? 'border-brand-dark bg-brand-dark text-white'
                            : 'border-brand-border text-brand-dark hover:border-brand-dark'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-brand-dark mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={0}
                      max={50000}
                      step={1000}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-brand-gray">
                      <span>{formatPKR(priceRange[0])}</span>
                      <span>{formatPKR(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {hasProducts ? (
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                  <AnimatePresence>
                    {filteredAndSortedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        layout
                      >
                        <ProductCard product={product} showImageCarousel />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                      No products found
                    </h2>
                    <p className="text-lg text-brand-gray mb-8 max-w-xl mx-auto">
                      Try adjusting your filters to find what you're looking for.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="inline-block bg-brand-dark text-white px-8 py-3 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-brand-red transition-colors duration-300"
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[150] lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[160] rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-brand-dark text-lg">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-brand-dark mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSizes((prev) =>
                          prev.includes(size)
                            ? prev.filter((s) => s !== size)
                            : [...prev, size]
                        );
                      }}
                      className={`w-12 h-12 border-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSizes.includes(size)
                          ? 'border-brand-dark bg-brand-dark text-white'
                          : 'border-brand-border text-brand-dark hover:border-brand-dark'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-brand-dark mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-brand-gray">
                    <span>{formatPKR(priceRange[0])}</span>
                    <span>{formatPKR(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-brand-dark text-white py-3 rounded-lg font-semibold mt-4"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
