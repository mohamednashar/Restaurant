'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoMenu, IoClose, IoPersonOutline, IoLogOutOutline, IoListOutline, IoChevronDown, IoHeartOutline } from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';
import CartIcon from './CartIcon';
import ThemeToggle from './ui/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/favorites', label: 'Favorites', icon: IoHeartOutline },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, logoutUser } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <nav className={`sticky top-0 z-40 bg-white/95 dark:bg-surface-950/95 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-sm border-b border-surface-100 dark:border-surface-800' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-white hidden sm:block">FoodFusion</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                    : 'text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-surface-800'
                }`}
              >
                {link.icon && <link.icon size={14} className="inline -mt-0.5 mr-1" />}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <CartIcon />

            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                    >
                      <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 rounded-full flex items-center justify-center text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-surface-700 dark:text-surface-200 max-w-[100px] truncate">{user.name}</span>
                      <IoChevronDown size={14} className={`text-surface-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-100 dark:border-surface-700 py-2 z-50 animate-scale-in">
                          <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-700">
                            <p className="font-semibold text-surface-900 dark:text-white text-sm">{user.name}</p>
                            <p className="text-xs text-surface-500 truncate">{user.email}</p>
                          </div>
                          {user.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                              Admin Dashboard
                            </Link>
                          )}
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <IoPersonOutline size={16} /> Profile
                          </Link>
                          <Link href="/my-orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <IoListOutline size={16} /> My Orders
                          </Link>
                          <hr className="my-1 border-surface-100 dark:border-surface-700" />
                          <button
                            onClick={() => { logoutUser(); setUserMenuOpen(false); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                          >
                            <IoLogOutOutline size={16} /> Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link href="/auth/login" className="btn-primary btn-sm">
                    <IoPersonOutline size={16} />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                )}
              </>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
            >
              {mobileOpen ? <IoClose size={22} /> : <IoMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-100 dark:border-surface-800 bg-white dark:bg-surface-900 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                }`}
              >
                {link.icon && <link.icon size={14} className="inline -mt-0.5 mr-1" />}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
