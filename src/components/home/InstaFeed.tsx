'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Instagram } from 'lucide-react';

const instaImages = [
  '/intikhab-man-sofa-indoor-white.jpeg',
  '/intikhab-man-bench-indoor-white.jpeg',
  '/intikhab-sneakers-jute-mat-blue.jpeg',
  '/intikhab-man-cafe-outdoor-white.jpeg',
];

/**
 * Instagram-style photo grid with hover overlay.
 */
function InstaFeed() {
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
        <Link
          href="https://www.instagram.com/intikhab_pakistan?igsh=aW5yaWJldTc0d2F2"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center mb-8 group"
        >
          <h2 className="text-xl md:text-2xl font-bold text-brand-dark text-center mb-2 group-hover:text-brand-red transition-colors cursor-pointer">
            INSTA STYLE FEED
          </h2>
          <span className="text-brand-red text-sm group-hover:underline">@intikhab_pakistan</span>
        </Link>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-0">
          {instaImages.map((src, index) => (
            <Link
              key={index}
              href="https://www.instagram.com/intikhab_pakistan?igsh=aW5yaWJldTc0d2F2"
              target="_blank"
              rel="noopener noreferrer"
              className="insta-cell relative aspect-[4/5] overflow-hidden cursor-pointer group block"
            >
              <Image
                src={src}
                alt={`Instagram post ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={75}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="insta-overlay absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 flex flex-col items-center justify-center">
                <Instagram className="w-8 h-8 text-white mb-2" />
                <p className="text-white text-xs font-medium">
                  Follow on Instagram
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export { InstaFeed };
