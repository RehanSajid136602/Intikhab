'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowLeftRight,
  RotateCcw,
  Shield,
  MessageCircle,
} from 'lucide-react';

const badges = [
  {
    icon: ArrowLeftRight,
    title: 'Free Nationwide Delivery',
    subtitle: 'On all prepaid orders',
  },
  {
    icon: RotateCcw,
    title: 'Easy 30-Day Returns',
    subtitle: 'Hassle-free exchange',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    subtitle: '100% safe checkout',
  },
  {
    icon: MessageCircle,
    title: '24/7 Support',
    subtitle: '0319 2776896',
  },
];

/**
 * 4 trust badges strip with Lucide icons.
 */
function TrustBadges() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-brand-light-gray border-y border-brand-border py-6 md:py-8"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <badge.icon className="w-10 h-10 text-brand-dark" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-brand-dark">
                {badge.title}
              </p>
              <p className="text-xs text-brand-gray mt-1">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export { TrustBadges };
