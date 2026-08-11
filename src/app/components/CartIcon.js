'use client';
import Link from 'next/link';
import { IoCartOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { selectCartCount } from '@/Redux/CartSlice';

export default function CartIcon() {
  const count = useSelector(selectCartCount);
  return (
    <Link href="/cart" className="relative p-2 hover:bg-surface-100 rounded-xl transition-colors">
      <IoCartOutline size={22} className="text-surface-700" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
