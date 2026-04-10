'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const categories = [
  {
    label: 'MEN',
    image: '/intikhab-man-bench-indoor-white.jpeg',
    href: '/men',
  },
  {
    label: 'WOMEN',
    image: '/intikhab-sneakers-jute-mat-blue.jpeg',
    href: '/women',
  },
  {
    label: 'KIDS',
    image: '/shoe_collection.jpeg',
    href: '/kids',
  },
];

/**
 * Clean 4-column grid layout for Shop by Categories section
 * All tiles have consistent aspect ratio and alignment
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
      className="w-full py-12 px-4 md:px-8"
    >
      {/* HEADING — plain, no background, no positioning */}
      <h2 className="text-center text-xl md:text-2xl font-semibold 
                     tracking-widest text-brand-dark mb-8">
        — Shop by Categories —
      </h2>

      {/* GRID — single unified grid, all tiles in one container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 
                      max-w-7xl mx-auto">
        
        {categories.map((category) => (
          <Link 
            key={category.label} 
            href={category.href}
            className="group relative overflow-hidden rounded-xl 
                       aspect-[3/4] block"
          >
            {/* IMAGE */}
            <img
              src={category.image}
              alt={category.label}
              className="w-full h-full object-cover transition-transform 
                         duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                console.error(`Failed to load image: ${category.image}`, e);
                (e.target as HTMLImageElement).src = '/intikhab-man-bench-indoor-white.jpeg';
              }}
            />
            
            {/* DARK OVERLAY — only at bottom for label */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 
                            bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* CATEGORY LABEL — bottom left, no background box */}
            <span className="absolute bottom-4 left-4 
                             text-white font-bold text-sm 
                             tracking-widest uppercase z-10">
              {category.label}
            </span>
          </Link>
        ))}
        
      </div>
    </motion.section>
  );
}

export { CategoryMosaic };
