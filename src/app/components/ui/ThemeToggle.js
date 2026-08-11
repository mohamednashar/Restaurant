'use client';
import { useTheme } from '@/hooks/useTheme';
import { IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors ${className}`}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <IoMoonOutline size={20} className="text-surface-600" />
      ) : (
        <IoSunnyOutline size={20} className="text-amber-400" />
      )}
    </button>
  );
}
