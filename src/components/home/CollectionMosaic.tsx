'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';

const collections = [
  { label: 'GIRL B', image: '/intikhab-man-relaxed-chair-blue.jpeg', badge: 'CLASSIC', badgeBg: 'bg-white/90 text-brand-dark', href: '/coming-soon' },
  { label: "Summer '25", image: '/intikhab-sneakers-balcony-sunset-blue.jpeg', badge: 'TOP SELLER', badgeBg: 'bg-brand-red text-white', href: '/coming-soon' },
  { label: 'KIDS', image: '/intikhab-man-sitting-bench-white.jpeg', href: '/coming-soon' },
  { label: 'NAYZA', image: '/intikhab-sneakers-woven-mat-black.jpeg', href: '/coming-soon' },
];

/**
 * 4-cell collection mosaic with different layout than CategoryMosaic.
 */
function CollectionMosaic() {
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
      <div className="container mx-auto px-4">
        <SectionTitle title="Shop by Collection" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 h-[500px] md:h-[480px]">
          {/* Left Tall - row-span-2 */}
          <CollectionCell
            collection={collections[0]}
            className="col-span-1 row-span-2"
          />

          {/* Top Right - col-span-2 */}
          <CollectionCell
            collection={collections[1]}
            className="col-span-2"
          />

          {/* Bottom Right */}
          <CollectionCell
            collection={collections[2]}
            className="col-span-2 md:col-span-1"
          />

          {/* Bottom Center - col-span-2 */}
          <CollectionCell
            collection={collections[3]}
            className="col-span-2"
          />
        </div>
      </div>
    </motion.section>
  );
}

interface CollectionCellProps {
  collection: (typeof collections)[number];
  className?: string;
}

function CollectionCell({ collection, className }: CollectionCellProps) {
  return (
    <Link
      href={collection.href}
      className={`category-cell relative block overflow-hidden cursor-pointer group h-full w-full ${
        className || ''
      }`}
    >
      <Image
        src={collection.image}
        alt={collection.label}
        fill
        className="object-cover transition-transform duration-500"
        sizes="(max-width: 768px) 33vw, 20vw"
        quality={85}
      />
      <div className="overlay absolute inset-0 bg-black/15 opacity-0 transition-opacity duration-300" />
      {collection.badge && (
        <div
          className={`absolute top-3 left-3 z-10 text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider ${collection.badgeBg}`}
        >
          {collection.badge}
        </div>
      )}
      <div className="absolute bottom-0 left-0 p-3 md:p-4">
        <p className="text-white font-bold text-sm md:text-base uppercase drop-shadow-lg">
          {collection.label}
        </p>
        <p className="shop-now-text text-white/80 text-xs opacity-0 transition-opacity duration-300 mt-1">
          SHOP NOW →
        </p>
      </div>
    </Link>
  );
}

export { CollectionMosaic };
