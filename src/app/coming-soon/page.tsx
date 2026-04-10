'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-brand-dark mb-6"
        >
          Coming Soon
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-brand-gray mb-8"
        >
          We're working hard to bring you this section. Stay tuned for exciting new arrivals and exclusive collections.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-block bg-brand-dark text-white px-8 py-3 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-brand-red transition-colors duration-300"
          >
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <p className="text-sm text-brand-gray/60">
            In the meantime, explore our{' '}
            <Link href="/#products" className="text-brand-dark hover:underline">
              current collection
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
