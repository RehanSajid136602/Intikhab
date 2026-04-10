'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';

const categories = [
  {
    label: 'MEN',
    image: '/intikhab-man-bench-indoor-white.jpeg',
    href: '/coming-soon',
  },
  {
    label: 'WOMEN',
    image: '/intikhab-sneakers-jute-mat-blue.jpeg',
    href: '/coming-soon',
  },
  {
    label: 'NEW ARRIVALS',
    image: '/intikhab-man-blazer-skyline-sunset.jpeg',
    href: '/coming-soon',
  },
  {
    label: 'BAGS',
    image: '/intikhab-man-cafe-outdoor-white.jpeg',
    href: '/coming-soon',
  },
  {
    label: 'KIDS',
    image: '/shoe_collection.jpeg',
    href: '/coming-soon',
  },
];

/**
 * Simplified 2-row grid layout for better image loading and alignment.
 * Row 1: MEN (tall), WOMEN, NEW ARRIVALS
 * Row 2: BAGS (wide), KIDS (wide)
 */
function CategoryMosaic() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white py-12 md:py-16"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTitle title="Shop by Categories" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Row 1 */}
          <div className="h-[400px] md:h-[500px]">
            <CategoryCell category={categories[0]} />
          </div>
          <div className="h-[400px] md:h-[500px]">
            <CategoryCell category={categories[1]} />
          </div>
          <div className="h-[400px] md:h-[500px]">
            <CategoryCell category={categories[2]} />
          </div>

          {/* Row 2 */}
          <div className="md:col-span-2 h-[300px] md:h-[350px]">
            <CategoryCell category={categories[3]} />
          </div>
          <div className="md:col-span-1 h-[300px] md:h-[350px]">
            <CategoryCell category={categories[4]} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

interface CategoryCellProps {
  category: (typeof categories)[number];
  className?: string;
}

function CategoryCell({ category, className }: CategoryCellProps) {
  return (
    <Link
      href={category.href}
      className={`category-cell relative overflow-hidden cursor-pointer group h-full w-full bg-gray-200 ${
        className || ''
      }`}
    >
      <img
        src={category.image}
        alt={category.label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          console.error(`Failed to load image: ${category.image}`, e);
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="overlay absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white font-bold text-base md:text-lg uppercase tracking-wider">
          {category.label}
        </p>
        <p className="shop-now-text text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
          Shop Now →
        </p>
      </div>
    </Link>
  );
}

export { CategoryMosaic };
