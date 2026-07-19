"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, X } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Product } from "@/types/product";
import { formatPKR } from "@/lib/utils";

interface StoreCategory {
  id: string;
  name: string;
  slug: string;
}

interface CategoryPageLayoutProps {
  title: string;
  description: string;
  products: Product[];
  heroImage?: string;
  category?: string;
  productType?: string;
  subcategory?: string;
  initialSearch?: string;
  initialSort?: string;
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
  productType,
  subcategory,
  initialSearch = "",
  initialSort = "featured",
}: CategoryPageLayoutProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"all" | "in-stock">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState(initialSort);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setStoreCategories(data))
      .catch(() => setStoreCategories([]));
  }, []);

  // Dynamic sizes based on product type
  const allSizes = productType === "shoes" ? ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"] : ["small", "medium", "large", "xl", "one-size"];
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) =>
        [p.name, p.brand, p.sku, p.category, p.productType, p.subcategory]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q)),
      );
    }

    // Filter by size (now using string sizes)
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizeStock?.some(
          (ss) => selectedSizes.includes(ss.size) && ss.stock > 0,
        ),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by price
    filtered = filtered.filter(
      (p) => p.price == null || (p.price >= priceRange[0] && p.price <= priceRange[1]),
    );

    if (availability === "in-stock") {
      filtered = filtered.filter((p) =>
        p.sizeStock?.length
          ? p.sizeStock.some((size) => size.stock > 0)
          : p.inStock,
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "newest":
      case "latest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedSizes, selectedCategory, priceRange, availability, sortBy]);

  const activeFilterCount =
    selectedSizes.length + (availability === "in-stock" ? 1 : 0);

  const clearFilters = () => {
    setSelectedSizes([]);
    setAvailability("all");
    setSelectedCategory("all");
    setPriceRange([0, 50000]);
  };

  const hasProducts = filteredAndSortedProducts.length > 0;

  return (
    <div className="min-h-screen bg-brand-background">
      {/* Hero Section */}
      <section className="relative bg-brand-dark text-white py-16 md:py-24">
        <div className="store-container">
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
        <div className="store-container">
          {/* Breadcrumbs */}
          {category && (
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                ...(productType ? [{ label: productType.charAt(0).toUpperCase() + productType.slice(1), href: `/${productType}` }] : []),
                { label: title },
              ]}
              className="mb-6"
            />
          )}

          {/* Filter & Sort Bar */}
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="form-field pl-10"
                placeholder="Search by product, category, SKU..."
                aria-label="Search products"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
            {/* Subcategory Filter Pills */}
            {subcategory && (
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <span className="text-sm font-medium text-brand-gray">Style:</span>
                <span className="px-3 py-1 bg-brand-light-gray rounded-full text-sm capitalize">{subcategory}</span>
              </div>
            )}

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="secondary-cta px-4 py-2"
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
                Showing {filteredAndSortedProducts.length} of {products.length}{" "}
                products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-field w-auto min-w-[190px] py-2"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="latest">Latest</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="surface-card sticky top-24 p-6">
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

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-brand-dark mb-3">
                    Availability
                  </h4>
                  <label className="flex items-center gap-2 text-sm text-brand-gray">
                    <input
                      type="checkbox"
                      checked={availability === "in-stock"}
                      onChange={(event) =>
                        setAvailability(event.target.checked ? "in-stock" : "all")
                      }
                    />
                    In stock only
                  </label>
                </div>

                {/* Size Filter */}
                {storeCategories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-brand-dark mb-3">
                      Category
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`block text-sm ${selectedCategory === "all" ? "text-brand-red" : "text-brand-gray"}`}
                      >
                        All categories
                      </button>
                      {storeCategories.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedCategory(item.slug)}
                          className={`block text-sm capitalize ${selectedCategory === item.slug ? "text-brand-red" : "text-brand-gray"}`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-brand-dark mb-3">
                    Size
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes((prev) =>
                            prev.includes(size)
                              ? prev.filter((s) => s !== size)
                              : [...prev, size],
                          );
                        }}
                        className={`w-10 h-10 border-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSizes.includes(size)
                              ? "border-brand-dark bg-brand-dark text-white"
                            : "border-brand-border text-brand-dark hover:border-brand-dark"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-brand-dark mb-3">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={0}
                      max={50000}
                      step={1000}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
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
                      Try adjusting your filters to find what you're looking
                      for.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="primary-cta"
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
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[160] rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-brand-dark text-lg">
                  Filters
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-brand-dark mb-3">
                  Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSizes((prev) =>
                          prev.includes(size)
                            ? prev.filter((s) => s !== size)
                            : [...prev, size],
                        );
                      }}
                      className={`w-12 h-12 border-2 rounded-lg text-sm font-medium transition-all ${
                        selectedSizes.includes(size)
                          ? "border-brand-dark bg-brand-dark text-white"
                          : "border-brand-border text-brand-dark hover:border-brand-dark"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-brand-dark mb-3">
                  Availability
                </h4>
                <label className="flex items-center gap-2 text-sm text-brand-gray">
                  <input
                    type="checkbox"
                    checked={availability === "in-stock"}
                    onChange={(event) =>
                      setAvailability(event.target.checked ? "in-stock" : "all")
                    }
                  />
                  In stock only
                </label>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-brand-dark mb-3">
                  Price Range
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
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
