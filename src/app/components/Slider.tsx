'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoArrowForward } from 'react-icons/io5';

const slides = [
  {
    id: 1,
    title: 'Delicious Pizza',
    subtitle: 'Wood-fired perfection',
    description: 'Handcrafted with the finest ingredients and baked to perfection in our traditional stone oven.',
    cta: 'Order Now',
    link: '/menu',
    gradient: 'from-brand-600 to-brand-800',
    emoji: '🍕',
  },
  {
    id: 2,
    title: 'Juicy Burgers',
    subtitle: 'Grilled to perfection',
    description: 'Premium beef patties with fresh toppings and our secret sauce on a toasted brioche bun.',
    cta: 'View Menu',
    link: '/menu',
    gradient: 'from-amber-600 to-orange-800',
    emoji: '🍔',
  },
  {
    id: 3,
    title: 'Fresh Pastas',
    subtitle: 'Authentic Italian taste',
    description: 'Traditional Italian recipes made with love, fresh pasta, and premium ingredients.',
    cta: 'Explore',
    link: '/menu',
    gradient: 'from-emerald-600 to-teal-800',
    emoji: '🍝',
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
            <div className="max-w-xl text-white">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4 animate-fade-in">
                {slide.subtitle}
              </span>
              <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight animate-slide-up">
                {slide.title}
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {slide.description}
              </p>
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 bg-white text-surface-900 px-8 py-4 rounded-xl font-bold hover:bg-surface-50 transition-all duration-200 shadow-lg hover:shadow-xl animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                {slide.cta}
                <IoArrowForward size={18} />
              </Link>
            </div>
            <div className="hidden lg:flex items-center justify-center absolute right-20 text-[200px] opacity-20 select-none">
              {slide.emoji}
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
