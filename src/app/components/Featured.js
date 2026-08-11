'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoArrowForward } from 'react-icons/io5';
import api from '@/lib/api';
import { MealCardSkeleton } from './ui/Skeleton';

export default function Featured() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/meals/featured?limit=6');
        setMeals(data.meals);
      } catch (err) {
        console.error('Failed to load featured meals');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-title">Featured Dishes</h2>
            <p className="section-subtitle">Our most popular meals, loved by everyone</p>
          </div>
          <Link href="/menu" className="flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors">
            View All Menu <IoArrowForward size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <MealCardSkeleton key={i} />)}
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-12 text-surface-500">
            <p className="text-4xl mb-4">🍽️</p>
            <p>No featured dishes yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <Link key={meal._id} href={`/meal/${meal._id}`} className="group card hover:shadow-lg transition-all duration-300">
                <div className="relative h-52 overflow-hidden bg-surface-100">
                  {meal.image?.url ? (
                    <img src={meal.image.url} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-surface-50">🍽️</div>
                  )}
                  {meal.isFeatured && (
                    <span className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-brand-600 mb-1">{meal.category?.name}</p>
                  <h3 className="font-bold text-surface-900 text-lg mb-1 group-hover:text-brand-600 transition-colors">{meal.name}</h3>
                  <p className="text-sm text-surface-500 line-clamp-2 mb-4">{meal.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-surface-900">${meal.price.toFixed(2)}</span>
                    <span className="text-sm text-brand-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View <IoArrowForward size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
