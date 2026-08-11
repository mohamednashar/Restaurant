'use client';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-surface-300 mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-surface-700 mb-2">{title}</h3>
      {description && <p className="text-surface-500 max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}
