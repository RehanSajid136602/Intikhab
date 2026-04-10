'use client';

import { useState } from 'react';
import { z } from 'zod';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const emailSchema = z.string().email('Please enter a valid email address').trim().min(1);

/**
 * Dark newsletter section with email form and Zod validation.
 */
function Newsletter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-brand-dark py-14 md:py-16 px-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-3/5">
            <h2 className="text-2xl md:text-[28px] font-bold text-white mb-3">
              Stay in Style
            </h2>
            <p className="text-white/60 text-sm">
              Subscribe for early access to new drops, exclusive offers and
              seasonal lookbooks.
            </p>
          </div>
          <div className="md:w-2/5 w-full">
            {submitted ? (
              <p className="text-green-400 text-sm font-medium">
                Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-5 py-3.5 text-sm border-0 outline-none ${
                      error ? 'ring-2 ring-brand-red' : ''
                    }`}
                    required
                  />
                  {error && (
                    <p className="text-brand-red text-xs mt-1">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-brand-red text-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
            <p className="text-white/40 text-xs mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export { Newsletter };
