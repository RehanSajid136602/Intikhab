'use client';

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  product: string;
  date: string;
}

function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      } catch {
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        <SectionTitle title="What Our Customers Say" />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-brand-gray border-t-brand-dark rounded-full animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-brand-gray py-12">
            Reviews from our customers will appear here once approved.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-red text-brand-red" />
                  ))}
                </div>

                <p className="text-brand-gray text-sm mb-4 leading-relaxed">
                  &ldquo;{testimonial.review}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-dark text-sm">{testimonial.name}</p>
                  </div>
                  {testimonial.product && (
                    <p className="text-xs text-brand-gray bg-white px-3 py-1 rounded-full">
                      {testimonial.product}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

export { Testimonials };
