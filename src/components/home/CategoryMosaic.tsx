'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { homepageImages } from '@/data/homepageImages';

/**
 * Clean 4-column grid layout for Shop by Categories section
 * Sourced dynamically from homepageImages config.
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
      {/* HEADING */}
      <h2 className="text-center text-xl md:text-2xl font-semibold 
                     tracking-widest text-brand-dark mb-8">
        — Shop by Categories —
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 
                      max-w-7xl mx-auto">
        {homepageImages.primaryCategories.map((category) => (
          <Link 
            key={category.label} 
            href={category.href}
            className="group relative overflow-hidden rounded-xl 
                       aspect-[3/4] block"
          >
            {/* IMAGE */}
            <Image
              src={category.src}
              alt={category.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              quality={85}
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

