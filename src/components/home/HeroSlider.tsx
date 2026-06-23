'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHeroSlider } from '@/hooks/useHeroSlider';
import { HERO_SLIDER } from '@/lib/constants';

const slides = [
  {
    image: '/intikhab-man-blazer-skyline-sunset.jpeg',
    alt: 'Hero 1',
    label: "NEW COLLECTION '25",
    title: (
      <>
        Nationwide
        <br />
        <span className="italic font-light">Free Delivery</span>
        <br />
        On All Prepaid Orders
      </>
    ),
    subtitle: 'Shop from PKR 3,200',
    alignment: 'left' as const,
  },
  {
    image: '/intikhab-sneakers-balcony-sunset-blue.jpeg',
    alt: 'Hero 2',
    label: 'SUMMER READY',
    title: (
      <>
        Stay Cool
        <br />
        <span className="italic font-light">This Season</span>
      </>
    ),
    subtitle: 'Explore Blue Collection',
    alignment: 'right' as const,
  },
  {
    image: '/intikhab-man-sofa-indoor-white.jpeg',
    alt: 'Hero 3',
    label: 'YOUR FAVORITES',
    title: (
      <>
        Timeless
        <br />
        <span className="italic font-light">Classics</span>
      </>
    ),
    subtitle: 'Discover Your Style',
    alignment: 'left' as const,
  },
];

/**
 * Full-bleed hero slider with auto-advance, arrows, dots, and Framer Motion fade.
 * Images rendered at native resolution (max 1024px) centered on dark background
 * to avoid upscaling blur.
 */
function HeroSlider() {
  const { currentSlide, goToSlide, nextSlide, prevSlide, setIsPaused, isPaused } =
    useHeroSlider();

  return (
    <div
      className="relative bg-brand-dark flex items-center justify-center overflow-hidden"
      style={{ height: 'clamp(320px, 50vw, 480px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === ' ') {
          e.preventDefault();
          setIsPaused(!isPaused);
        }
      }}
      role="region"
      aria-label="Hero image slider"
      tabIndex={0}
    >
      <div className="relative w-full max-w-[1024px] h-full">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide absolute inset-0 ${
              index === currentSlide ? 'active' : ''
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAgIBBAMBAAAAAAAAAAAAAQIDBAUREiExQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Amtz1tptx2fa9OxtNrPFJaivjX1Kc4pvpqvFdMoyp0pZUVRXj7gA7QAAH/9k="
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${
                  slide.alignment === 'right'
                    ? 'from-transparent via-black/30 to-black/55'
                    : 'from-black/55 via-black/30 to-transparent'
                }`}
              />
            </div>
            <div
              className={`absolute inset-0 flex items-center ${
                slide.alignment === 'right' ? 'justify-end' : ''
              }`}
            >
              <div
                className={`container mx-auto px-8 md:px-20 ${
                  slide.alignment === 'right' ? 'text-right' : ''
                }`}
              >
                <p className="text-white/90 text-xs font-semibold uppercase tracking-widest mb-3">
                  {slide.label}
                </p>
                <h1 className="text-4xl md:text-[52px] font-bold text-white leading-tight mb-3 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-white/80 text-sm md:text-base mb-6 font-medium">{slide.subtitle}</p>
                <Link
                  href="/coming-soon"
                  className="inline-block bg-white text-brand-dark px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Arrow Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {Array.from({ length: HERO_SLIDER.totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { HeroSlider };
