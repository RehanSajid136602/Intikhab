'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  product: string;
  date: string;
}

const FEATURED = {
  name: 'Ahsan',
  review:
    "Today allhamdulilah I received my parcel my shoes. And no doubt shoes are very awesome+ comfortable. I liked it so much and will inshallah shop again... Jazakallah",
  product: 'Premium Sneakers',
  images: [
    '/Products/tan_sneaker_flat_lay.webp',
    '/Products/sneaker_side_profile.webp',
    '/Products/sneaker_toe_macro.webp',
    '/images/intikhab/intikhab-packaging-shoe-box.webp',
  ],
};

function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

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

  const prevImage = () =>
    setActiveImage((i) => (i === 0 ? FEATURED.images.length - 1 : i - 1));
  const nextImage = () =>
    setActiveImage((i) => (i === FEATURED.images.length - 1 ? 0 : i + 1));

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white py-16 md:py-24"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTitle title="What Our Customers Say" />

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-brand-dark rounded-sm overflow-hidden md:grid md:grid-cols-5"
        >
          {/* Photo gallery */}
          <div className="md:col-span-3 relative bg-zinc-900">
            <div className="aspect-[4/3] md:aspect-square relative">
              <Image
                src={FEATURED.images[activeImage]}
                alt="Customer's delivered Intikhab shoes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>

            {/* Image navigation arrows */}
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-brand-dark" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-brand-dark" />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 p-3 bg-gradient-to-t from-black/60 to-transparent">
              {FEATURED.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-14 h-14 rounded-sm overflow-hidden border-2 transition-all ${
                    i === activeImage
                      ? 'border-amber-400 opacity-100'
                      : 'border-white/30 opacity-60 hover:opacity-90'
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quote content */}
          <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-400 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-sm">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Verified Customer
              </span>
            </div>

            <Quote className="w-8 h-8 text-amber-500/30 mb-4" />

            <blockquote className="text-white/90 text-base md:text-lg leading-relaxed font-light italic mb-6">
              &ldquo;{FEATURED.review}&rdquo;
            </blockquote>

            <div className="mt-auto">
              <p className="text-white font-semibold">— {FEATURED.name}</p>
              <p className="text-white/50 text-sm mt-0.5">
                Purchased {FEATURED.product}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Additional DB testimonials */}
        {!loading && testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="bg-stone-50 p-6 rounded-sm border border-stone-100"
              >
                {testimonial.rating > 0 && (
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-brand-red text-brand-red"
                      />
                    ))}
                  </div>
                )}

                <p className="text-brand-gray text-sm mb-4 leading-relaxed">
                  &ldquo;{testimonial.review}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <p className="font-semibold text-brand-dark text-sm">
                    {testimonial.name}
                  </p>
                  {testimonial.product && (
                    <span className="text-xs text-brand-gray bg-white px-3 py-1 rounded-full border border-stone-200">
                      {testimonial.product}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state (no DB testimonials, which is fine since we have Ahsan) */}
        {!loading && testimonials.length === 0 && (
          <p className="text-center text-brand-gray text-sm mt-10">
            More reviews from our customers will appear here once approved.
          </p>
        )}
      </div>
    </motion.section>
  );
}

export { Testimonials };
