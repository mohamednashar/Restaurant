'use client';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import FavoriteButton from '@/app/components/ui/FavoriteButton';
import { MealCardSkeleton } from '@/app/components/ui/Skeleton';
import { IoHeartOutline, IoArrowBack } from 'react-icons/io5';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const { data } = await api.get('/auth/favorites');
          setMeals(data.favorites);
        } catch {}
      } else if (favorites.length === 0) {
        setMeals([]);
      } else {
        try {
          const results = await Promise.all(
            favorites.map((id: string) => api.get(`/meals/${id}`).then((r) => r.data.meal))
          );
          setMeals(results);
        } catch {}
      }
      setLoading(false);
    };
    if (!authLoading) fetchFavorites();
  }, [user, authLoading, favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/menu" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 mb-6 transition-colors">
        <IoArrowBack size={16} /> Back to Menu
      </Link>
      <h1 className="text-3xl font-bold text-surface-900 mb-8">My Favorites</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <MealCardSkeleton key={i} />)}
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-16">
          <IoHeartOutline size={48} className="mx-auto text-surface-300 mb-4" />
          <h2 className="text-xl font-bold text-surface-700 mb-2">No favorites yet</h2>
          <p className="text-surface-500 mb-6">Tap the heart icon on any meal to save it here.</p>
          <Link href="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal: any) => (
            <Link key={meal._id} href={`/meal/${meal._id}`} className="group card hover:shadow-lg transition-all duration-300 relative">
              <div className="absolute top-3 right-3 z-10">
                <FavoriteButton mealId={meal._id} />
              </div>
              <div className="relative h-52 overflow-hidden bg-surface-100">
                {meal.image?.url ? (
                  <img src={meal.image.url} alt={meal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-surface-50">🍽️</div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-medium text-brand-600 mb-1">{meal.category?.name}</p>
                <h3 className="font-bold text-surface-900 text-lg mb-1 group-hover:text-brand-600 transition-colors">{meal.name}</h3>
                <p className="text-sm text-surface-500 line-clamp-2 mb-4">{meal.description}</p>
                <span className="text-xl font-bold text-surface-900">${meal.price.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
