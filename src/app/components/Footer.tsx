import Link from 'next/link';
import { IoLogoInstagram, IoLogoFacebook, IoLogoTwitter } from 'react-icons/io5';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FoodFusion</span>
            </div>
            <p className="text-surface-400 text-sm max-w-sm leading-relaxed">
              Premium restaurant experience with fresh ingredients and fast delivery.
              Order your favorite meals online.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 bg-surface-800 hover:bg-surface-700 rounded-xl flex items-center justify-center transition-colors">
                <IoLogoInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-surface-800 hover:bg-surface-700 rounded-xl flex items-center justify-center transition-colors">
                <IoLogoFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-surface-800 hover:bg-surface-700 rounded-xl flex items-center justify-center transition-colors">
                <IoLogoTwitter size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-surface-300">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-surface-400 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link href="/menu" className="text-surface-400 hover:text-white text-sm transition-colors">Menu</Link></li>
              <li><Link href="/cart" className="text-surface-400 hover:text-white text-sm transition-colors">Cart</Link></li>
              <li><Link href="/my-orders" className="text-surface-400 hover:text-white text-sm transition-colors">Orders</Link></li>
              <li><a href="https://your-frontend.vercel.app" className="text-surface-400 hover:text-white text-sm transition-colors" target="_blank" rel="noopener noreferrer">Live Site</a></li>
              <li><a href="https://your-backend.onrender.com" className="text-surface-400 hover:text-white text-sm transition-colors" target="_blank" rel="noopener noreferrer">API (Backend)</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-surface-300">Contact</h3>
            <ul className="space-y-3 text-sm text-surface-400">
              <li>123 Food Street, City</li>
              <li>+1 (234) 567-890</li>
              <li>info@foodfusion.com</li>
              <li className="pt-2">
                <span className="text-sm font-medium text-surface-300">Hours:</span><br />
                Mon-Sun: 10:00 AM - 11:00 PM
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-surface-800 mt-10 pt-6 text-center text-surface-500 text-sm">
          &copy; {new Date().getFullYear()} FoodFusion. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
