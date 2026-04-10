'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

// TODO: Replace with real reviews from client
const testimonials = [
  {
    name: 'Ali Hassan',
    city: 'Lahore',
    rating: 5,
    review: 'Amazing quality! The sneakers are super comfortable and the delivery was fast. Will definitely order again.',
    product: 'Urban Runner X',
  },
  {
    name: 'Sara Ahmed',
    city: 'Karachi',
    rating: 5,
    review: 'Best online shoe shopping experience in Pakistan. The fit is perfect and material is top-notch.',
    product: 'Classic White Kicks',
  },
  {
    name: 'Usman Khan',
    city: 'Islamabad',
    rating: 4,
    review: 'Great value for money. The shoes look exactly like the pictures. Customer service was very helpful.',
    product: 'Street Style Pro',
  },
  {
    name: 'Fatima Malik',
    city: 'Faisalabad',
    rating: 5,
    review: 'I was skeptical about ordering shoes online, but Intikhab proved me wrong. Excellent quality and quick delivery!',
    product: 'Urban Runner X',
  },
];

/**
 * Testimonials section with customer reviews.
 * Horizontal scroll on mobile, 2x2 grid on desktop.
 */
function Testimonials() {
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
        <SectionTitle title="What Our Customers Say" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-gray-50 p-6 rounded-lg"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand-red text-brand-red" />
                ))}
              </div>

              {/* Review */}
              <p className="text-brand-gray text-sm mb-4 leading-relaxed">
                "{testimonial.review}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{testimonial.name}</p>
                  <p className="text-xs text-brand-gray">{testimonial.city}</p>
                </div>
                <p className="text-xs text-brand-gray bg-white px-3 py-1 rounded-full">
                  {testimonial.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export { Testimonials };
