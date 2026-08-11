'use client';
import { useFavorites } from '@/hooks/useFavorites';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function FavoriteButton({ mealId, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(mealId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = await toggleFavorite(mealId);
    toast.success(added === undefined ? (liked ? 'Removed from favorites' : 'Added to favorites') : (added ? 'Added to favorites' : 'Removed from favorites'));
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 ${
        liked
          ? 'bg-red-50 dark:bg-red-900/30 text-red-500 scale-110'
          : 'bg-white/80 dark:bg-surface-800/80 text-surface-400 hover:text-red-400 hover:bg-white dark:hover:bg-surface-700'
      } ${className}`}
    >
      {liked ? <IoHeart size={18} fill="currentColor" /> : <IoHeartOutline size={18} />}
    </button>
  );
}
