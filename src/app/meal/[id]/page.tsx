'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/Redux/CartSlice';
import { IoArrowBack, IoTimeOutline, IoCartOutline, IoCheckmarkCircle } from 'react-icons/io5';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import MealReviews from '@/app/components/MealReviews';
import FavoriteButton from '@/app/components/ui/FavoriteButton';

interface MealOption {
  title: string;
  additionalPrice: number;
}

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Meal {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: { url: string };
  category: { name: string; slug: string };
  options: MealOption[];
  ingredients: string[];
  preparationTime: number;
  isAvailable: boolean;
  nutritionalInfo?: NutritionalInfo;
  allergens?: string[];
  dietaryLabels?: string[];
}

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(0);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const { data } = await api.get(`/meals/${params.id}`);
        setMeal(data.meal);
      } catch (err) {
        toast.error('Meal not found');
        router.push('/menu');
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [params.id, router]);

  const handleAddToCart = () => {
    if (!meal) return;
    const option = meal.options[selectedOption];
    const unitPrice = meal.price + (option?.additionalPrice || 0);
    dispatch(addToCart({
      meal,
      quantity,
      size: option?.title || 'Regular',
      selectedOptions: option?.title || '',
      unitPrice,
      total: unitPrice * quantity,
    }));
    toast.success(`${meal.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="skeleton h-[400px] rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-20 w-full rounded" />
            <div className="skeleton h-10 w-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!meal) return null;

  const option = meal.options[selectedOption];
  const unitPrice = meal.price + (option?.additionalPrice || 0);
  const totalPrice = unitPrice * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 mb-8 transition-colors">
        <IoArrowBack size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative rounded-2xl overflow-hidden bg-surface-100 aspect-square">
          {meal.image?.url ? (
            <img src={meal.image.url} alt={meal.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[100px] bg-surface-50">🍽️</div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-brand-600 mb-2">{meal.category?.name}</span>
            <FavoriteButton mealId={meal._id} className="mt-1" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-surface-900 mb-3">{meal.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-sm text-surface-500">
              <IoTimeOutline size={16} /> {meal.preparationTime} min
            </div>
            {meal.isAvailable ? (
              <span className="badge badge-success flex items-center gap-1"><IoCheckmarkCircle size={12} /> Available</span>
            ) : (
              <span className="badge badge-danger">Unavailable</span>
            )}
          </div>

          <p className="text-surface-600 leading-relaxed mb-6">{meal.description}</p>

          {meal.ingredients?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-surface-900 mb-2">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {meal.ingredients.map((ing, i) => (
                  <span key={i} className="bg-surface-100 text-surface-600 text-xs px-3 py-1 rounded-full">{ing}</span>
                ))}
              </div>
            </div>
          )}

          {(meal.nutritionalInfo?.calories || meal.allergens?.length || meal.dietaryLabels?.length) && (
            <div className="mb-6 p-4 bg-surface-50 rounded-xl">
              <h3 className="text-sm font-semibold text-surface-900 mb-3">Nutritional Information</h3>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {meal.nutritionalInfo?.calories ? <div className="text-center"><p className="text-lg font-bold text-surface-900">{meal.nutritionalInfo.calories}</p><p className="text-[10px] text-surface-500">Calories</p></div> : null}
                {meal.nutritionalInfo?.protein ? <div className="text-center"><p className="text-lg font-bold text-surface-900">{meal.nutritionalInfo.protein}g</p><p className="text-[10px] text-surface-500">Protein</p></div> : null}
                {meal.nutritionalInfo?.carbs ? <div className="text-center"><p className="text-lg font-bold text-surface-900">{meal.nutritionalInfo.carbs}g</p><p className="text-[10px] text-surface-500">Carbs</p></div> : null}
                {meal.nutritionalInfo?.fat ? <div className="text-center"><p className="text-lg font-bold text-surface-900">{meal.nutritionalInfo.fat}g</p><p className="text-[10px] text-surface-500">Fat</p></div> : null}
                {meal.nutritionalInfo?.fiber ? <div className="text-center"><p className="text-lg font-bold text-surface-900">{meal.nutritionalInfo.fiber}g</p><p className="text-[10px] text-surface-500">Fiber</p></div> : null}
              </div>
              {meal.dietaryLabels?.length && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {meal.dietaryLabels.map((label: string) => (
                    <span key={label} className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium px-2 py-0.5 rounded-full uppercase">{label}</span>
                  ))}
                </div>
              )}
              {meal.allergens?.length && (
                <p className="text-xs text-surface-500"><span className="font-medium">Allergens:</span> {meal.allergens.join(', ')}</p>
              )}
            </div>
          )}

          {meal.options?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-surface-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {meal.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      selectedOption === i
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-surface-200 hover:border-surface-300 text-surface-600'
                    }`}
                  >
                    {opt.title}
                    {opt.additionalPrice > 0 && <span className="ml-1 text-surface-400">+${opt.additionalPrice}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-black text-surface-900">${totalPrice.toFixed(2)}</span>
              <span className="text-sm text-surface-500">${unitPrice.toFixed(2)} each</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-surface-200 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-surface-50 rounded-l-xl transition-colors">-</button>
                <span className="w-12 h-12 flex items-center justify-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-surface-50 rounded-r-xl transition-colors">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!meal.isAvailable}
                className="flex-1 btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IoCartOutline size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <MealReviews mealId={meal._id} />
      </div>
    </div>
  );
}
