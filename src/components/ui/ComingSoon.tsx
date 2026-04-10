'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface ComingSoonProps {
  routeLabel: string;
}

/**
 * Branded Coming Soon page with route label, email capture, and back-to-home CTA.
 */
function ComingSoonPage({ routeLabel }: ComingSoonProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center max-w-lg mx-auto">
        {/* Decorative Icon */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light-gray mb-8"
        >
          <Sparkles className="w-8 h-8 text-brand-red" />
        </motion.div>

        {/* Route Label */}
        <motion.p
          variants={itemVariants}
          className="text-xs font-semibold uppercase tracking-widest text-brand-red mb-3"
        >
          {routeLabel}
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-brand-dark mb-3"
        >
          Coming Soon
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-brand-gray text-sm md:text-base mb-10"
        >
          We&apos;re working on something great. Get notified when it launches.
        </motion.p>

        {/* Email Capture */}
        <motion.div variants={itemVariants}>
          {submitted ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm font-medium text-green-600"
            >
              Thank you! We&apos;ll keep you updated.
            </motion.p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark rounded-sm"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-brand-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors rounded-sm whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                Notify Me
              </button>
            </form>
          )}
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-4 my-10"
        >
          <div className="h-px w-16 bg-brand-border" />
          <p className="text-xs text-brand-gray">or</p>
          <div className="h-px w-16 bg-brand-border" />
        </motion.div>

        {/* Back to Home */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark hover:text-brand-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {BRAND.name}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export { ComingSoonPage };
export type { ComingSoonProps };
