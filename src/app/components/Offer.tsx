import Link from 'next/link';
import { IoArrowForward } from 'react-icons/io5';

export default function Offer() {
  return (
    <section className="py-16 md:py-24 bg-surface-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-[200px]">🍔</div>
        <div className="absolute bottom-10 right-10 text-[150px]">🍟</div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-brand-500/20 text-brand-400 rounded-full text-sm font-medium mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
              Get 20% Off<br />Your First Order
            </h2>
            <p className="text-surface-400 text-lg mb-8 leading-relaxed">
              Use code <span className="text-brand-400 font-bold">WELCOME20</span> at checkout 
              and enjoy 20% off your first order. Fresh ingredients, fast delivery.
            </p>
            <Link href="/menu" className="inline-flex items-center gap-2 btn-primary btn-lg">
              Order Now <IoArrowForward size={18} />
            </Link>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-brand-600/20 rounded-full flex items-center justify-center">
                <div className="w-60 h-60 bg-brand-600/30 rounded-full flex items-center justify-center">
                  <span className="text-[120px]">🍔</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-accent-500 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                20% OFF
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
