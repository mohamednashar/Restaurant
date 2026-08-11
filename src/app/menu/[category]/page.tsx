'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { MealCardSkeleton } from '@/app/components/ui/Skeleton';
import { IoArrowBack, IoSearch } from 'react-icons/io5';

interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: { url: string };
  category: { name: string; slug: string };
  isAvailable: boolean;
  preparationTime: number;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.category as string;
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const { data: catData } = await api.get(`/categories/slug/${slug}`);
        setCategoryName(catData.category.name);
        const { data } = await api.get('/meals', {
          params: { category: catData.category._id, limit: 50 },
        });
        setMeals(data.meals);
      } catch (err) {
        console.error('Failed to load meals');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [slug]);

  const filtered = meals.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link href="/menu" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 mb-4 transition-colors">
          <IoArrowBack size={16} /> Back to Menu
        </Link>
        <h1 className="section-title capitalize">{categoryName || slug}</h1>
        <p className="section-subtitle">{filtered.length} items available</p>
      </div>

      <div className="relative max-w-md mb-8">
        <IoSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Search in this category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <MealCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-surface-500 text-lg">No meals found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((meal) => (
            <Link key={meal._id} href={`/meal/${meal._id}`} className="group card hover:shadow-lg transition-all duration-300">
              <div className="relative h-52 overflow-hidden bg-surface-100">
                {meal.image?.url ? (
                  <img src={meal.image.url} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl bg-surface-50">🍽️</div>
                )}
                {!meal.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm">Unavailable</span>
                  </div>
                )}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-surface-700 text-xs font-medium px-3 py-1 rounded-full">
                  {meal.preparationTime} min
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-surface-900 text-lg mb-1 group-hover:text-brand-600 transition-colors">{meal.name}</h3>
                <p className="text-sm text-surface-500 line-clamp-2 mb-4">{meal.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-surface-900">${meal.price.toFixed(2)}</span>
                  {meal.isAvailable && (
                    <span className="text-sm text-brand-600 font-medium">Add to Cart →</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
