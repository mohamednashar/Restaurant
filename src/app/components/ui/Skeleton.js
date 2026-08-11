'use client';

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function MealCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-6 w-2/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="flex justify-between items-center">
          <div className="skeleton h-8 w-20 rounded" />
          <div className="skeleton h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="skeleton h-40 w-full rounded-t-2xl" />
      <div className="p-5 space-y-2">
        <div className="skeleton h-6 w-1/2 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <div className="flex gap-4 p-4 border-b border-surface-100 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="skeleton h-5 rounded flex-1" />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      <div className="skeleton h-8 w-48 rounded" />
      <div className="skeleton h-4 w-96 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MealCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
