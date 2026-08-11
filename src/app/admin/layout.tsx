'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  IoGridOutline,
  IoRestaurantOutline,
  IoPricetagOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoLogOutOutline,
  IoChevronDown,
} from 'react-icons/io5';
import ThemeToggle from '@/app/components/ui/ThemeToggle';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: IoGridOutline },
  { href: '/admin/meals', label: 'Meals', icon: IoRestaurantOutline },
  { href: '/admin/categories', label: 'Categories', icon: IoPricetagOutline },
  { href: '/admin/orders', label: 'Orders', icon: IoReceiptOutline },
  { href: '/admin/users', label: 'Users', icon: IoPeopleOutline },
  { href: '/admin/settings', label: 'Settings', icon: IoSettingsOutline },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const authCtx = useAuth();
  const user = authCtx.user as any;
  const loading = authCtx.loading;
  const logoutUser = authCtx.logoutUser;
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-surface-100 dark:border-surface-800">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-black text-lg">F</span>
          </div>
          <div>
            <span className="font-bold text-surface-900 dark:text-white">FoodFusion</span>
            <span className="block text-[10px] text-surface-400 uppercase tracking-wider">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded">
            <IoCloseOutline size={20} className="text-surface-600 dark:text-surface-300" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`admin-sidebar-link ${isActive ? 'admin-sidebar-link-active' : ''}`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-100 dark:border-surface-800">
          <Link href="/" className="admin-sidebar-link text-surface-500 hover:text-surface-700 dark:hover:text-white">
            ← Back to Store
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl">
            <IoMenuOutline size={22} className="text-surface-600 dark:text-surface-300" />
          </button>

          <div className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <input type="text" placeholder="Search..." className="w-full pl-4 pr-4 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" readOnly />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-surface-500">Administrator</p>
                </div>
                <IoChevronDown size={14} className="text-surface-400 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-100 dark:border-surface-700 py-2 z-50 animate-scale-in">
                    <Link href="/profile" className="block px-4 py-2.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700" onClick={() => setUserMenuOpen(false)}>Profile</Link>
                    <Link href="/" className="block px-4 py-2.5 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700" onClick={() => setUserMenuOpen(false)}>View Store</Link>
                    <hr className="my-1 border-surface-100 dark:border-surface-700" />
                    <button onClick={() => { logoutUser?.(); setUserMenuOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <IoLogOutOutline size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
