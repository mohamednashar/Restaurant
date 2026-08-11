import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu - FoodFusion',
};

async function getCategories() {
  try {
    const res = await fetch('http://localhost:5000/api/categories', { cache: 'no-store' });
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

export default async function MenuPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="section-title">Our Menu</h1>
        <p className="section-subtitle">Explore our delicious categories</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-surface-500 text-lg">No categories available yet.</p>
          </div>
        ) : (
          categories.map((cat: any) => (
            <Link
              key={cat._id}
              href={`/menu/${cat.slug}`}
              className="group card overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-surface-100">
                {cat.image?.url ? (
                  <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl" style={{ backgroundColor: cat.color + '15' }}>
                    {cat.slug === 'pizzas' ? '🍕' : cat.slug === 'burgers' ? '🍔' : cat.slug === 'pastas' ? '🍝' : cat.slug === 'salads' ? '🥗' : cat.slug === 'drinks' ? '🥤' : '🍽️'}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-bold text-xl text-surface-900 group-hover:text-brand-600 transition-colors mb-1">{cat.name}</h2>
                <p className="text-sm text-surface-500">{cat.description}</p>
                <p className="text-xs text-surface-400 mt-2">{cat.mealCount || 0} items</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
