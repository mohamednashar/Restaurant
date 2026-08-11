'use client';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, removeFromCart, updateQuantity, clearCart } from '@/Redux/CartSlice';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IoTrashOutline, IoArrowBack, IoCartOutline, IoBagCheckOutline, IoPricetagOutline, IoClose } from 'react-icons/io5';

export default function CartPage() {
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const deliveryFee = total >= 50 ? 0 : 5.99;
  const serviceFee = total * 0.05;
  const grandTotal = Math.max(0, total + deliveryFee + serviceFee - promoDiscount);

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    try {
      const { data } = await api.post('/promos/validate', { code: promoCode, orderAmount: total });
      setPromoDiscount(data.discount);
      setAppliedPromo(data.promo);
      toast.success(`${data.promo.code} applied! -$${data.discount.toFixed(2)}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid promo code'); }
    finally { setPromoLoading(false); }
  };

  const removePromo = () => { setPromoDiscount(0); setAppliedPromo(null); setPromoCode(''); };

  const handleCheckout = async () => {
    if (!user) { toast.error('Please login to place an order'); router.push('/auth/login'); return; }
    if (!deliveryAddress.trim()) { toast.error('Please enter delivery address'); return; }
    if (!phone.trim()) { toast.error('Please enter phone number'); return; }
    setLoading(true);
    try {
      if (appliedPromo) {
        await api.post('/promos/apply', { code: appliedPromo.code, orderAmount: total });
      }
      const { data } = await api.post('/orders', {
        items: items.map((item) => ({
          meal: item.meal._id, name: item.meal.name, quantity: item.quantity,
          price: item.unitPrice, size: item.size, image: item.meal.image?.url || '',
        })),
        totalAmount: grandTotal, paymentMethod: 'cash',
        deliveryAddress, phone, notes,
        promoCode: appliedPromo?.code || '',
        discount: promoDiscount,
      });
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      router.push(`/my-orders/${data.order._id}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <IoCartOutline size={64} className="mx-auto text-surface-300 mb-4" />
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Your Cart is Empty</h1>
        <p className="text-surface-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/menu" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 mb-6 transition-colors">
        <IoArrowBack size={16} /> Continue Shopping
      </Link>
      <h1 className="text-3xl font-bold text-surface-900 mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="card card-body flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                {item.meal.image?.url ? <img src={item.meal.image.url} alt={item.meal.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-surface-900 truncate">{item.meal.name}</h3>
                <p className="text-sm text-surface-500">{item.size}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => item.quantity > 1 && dispatch(updateQuantity({ index, quantity: item.quantity - 1 }))} className="w-8 h-8 border border-surface-200 rounded-lg flex items-center justify-center hover:bg-surface-50 text-sm">-</button>
                <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                <button onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity + 1 }))} className="w-8 h-8 border border-surface-200 rounded-lg flex items-center justify-center hover:bg-surface-50 text-sm">+</button>
              </div>
              <span className="font-bold text-surface-900 w-20 text-right">${item.total.toFixed(2)}</span>
              <button onClick={() => dispatch(removeFromCart(index))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><IoTrashOutline size={18} /></button>
            </div>
          ))}
          <button onClick={() => dispatch(clearCart())} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear Cart</button>
        </div>
        <div className="card card-body h-fit space-y-4">
          <h2 className="font-bold text-lg text-surface-900">Order Summary</h2>

          <div>
            <label className="label">Promo Code</label>
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <IoPricetagOutline size={16} className="text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">{appliedPromo.code}</span>
                  <span className="text-xs text-emerald-600">-${promoDiscount.toFixed(2)}</span>
                </div>
                <button onClick={removePromo} className="text-emerald-600 hover:text-emerald-800"><IoClose size={16} /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code" className="input-field text-sm flex-1" />
                <button onClick={applyPromo} disabled={promoLoading} className="btn-secondary btn-sm">{promoLoading ? '...' : 'Apply'}</button>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-surface-500">Subtotal</span><span className="font-medium">${total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-surface-500">Delivery</span><span className="font-medium">{deliveryFee === 0 ? <span className="text-emerald-600">Free</span> : `$${deliveryFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span className="text-surface-500">Service Fee</span><span className="font-medium">${serviceFee.toFixed(2)}</span></div>
            {promoDiscount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span className="font-medium">-${promoDiscount.toFixed(2)}</span></div>}
            <hr className="border-surface-100" />
            <div className="flex justify-between text-base font-bold"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
          </div>
          <div className="space-y-3 pt-2">
            <div><label className="label">Delivery Address *</label><input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="123 Main St, City" className="input-field text-sm" /></div>
            <div><label className="label">Phone Number *</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" className="input-field text-sm" /></div>
            <div><label className="label">Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special instructions..." rows={2} className="input-field text-sm resize-none" /></div>
          </div>
          <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full">
            <IoBagCheckOutline size={18} />{loading ? 'Placing Order...' : 'Place Order'}
          </button>
          {total < 50 && <p className="text-xs text-surface-400 text-center">Add ${(50 - total).toFixed(2)} more for free delivery</p>}
        </div>
      </div>
    </div>
  );
}
