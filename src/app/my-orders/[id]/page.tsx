'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Link from 'next/link';
import { IoArrowBack, IoTimeOutline, IoLocationOutline, IoCallOutline, IoReceiptOutline } from 'react-icons/io5';

const STATUSES = [
  { key: 'pending', label: 'Order Placed', icon: '📋', description: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', description: 'Restaurant confirmed your order' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳', description: 'Your food is being prepared' },
  { key: 'ready', label: 'Ready', icon: '📦', description: 'Your order is ready for pickup/delivery' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', description: 'Enjoy your meal!' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${params.id}`);
        setOrder(data.order);
      } catch {} finally { setLoading(false); }
    };
    if (user) fetchOrder();
  }, [params.id, user]);

  if (loading || authLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse"><div className="skeleton h-96 rounded-2xl" /></div>;
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">❌</p>
        <h1 className="text-xl font-bold text-surface-900 mb-2">Order not found</h1>
        <Link href="/my-orders" className="btn-primary">View My Orders</Link>
      </div>
    );
  }

  const currentIdx = STATUSES.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/my-orders" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 mb-6 transition-colors">
        <IoArrowBack size={16} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-surface-500 text-sm">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <IoReceiptOutline size={32} className="text-surface-300" />
      </div>

      <div className="card card-body mb-8">
        {isCancelled ? (
          <div className="text-center py-6">
            <span className="text-4xl mb-3 block">❌</span>
            <h3 className="text-lg font-bold text-red-600">Order Cancelled</h3>
            <p className="text-surface-500 text-sm">This order has been cancelled</p>
          </div>
        ) : (
          <>
            <div className="relative mb-8">
              <div className="absolute top-5 left-0 right-0 h-1 bg-surface-200 rounded-full">
                <div
                  className="h-full bg-brand-600 rounded-full transition-all duration-700"
                  style={{ width: `${(currentIdx / (STATUSES.length - 1)) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {STATUSES.map((status, idx) => {
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  return (
                    <div key={status.key} className="flex flex-col items-center w-1/5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                        isCompleted ? 'bg-brand-600 border-brand-600 shadow-lg' : 'bg-white border-surface-200'
                      } ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}>
                        {isCompleted ? '✓' : status.icon}
                      </div>
                      <span className={`text-xs mt-2 text-center font-medium ${isCurrent ? 'text-brand-600' : isCompleted ? 'text-surface-700' : 'text-surface-400'}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-surface-900">{STATUSES[currentIdx]?.label}</p>
              <p className="text-sm text-surface-500">{STATUSES[currentIdx]?.description}</p>
            </div>
          </>
        )}
      </div>

      <div className="card card-body mb-6">
        <h2 className="font-bold text-surface-900 mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-100 shrink-0">
                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-surface-900 text-sm truncate">{item.name}</p>
                <p className="text-xs text-surface-500">{item.size} × {item.quantity}</p>
              </div>
              <span className="font-semibold text-surface-900 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <hr className="my-4 border-surface-100" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="card card-body">
        <h2 className="font-bold text-surface-900 mb-4">Delivery Details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <IoLocationOutline size={18} className="text-surface-400" />
            <span className="text-surface-600">{order.deliveryAddress}</span>
          </div>
          <div className="flex items-center gap-3">
            <IoCallOutline size={18} className="text-surface-400" />
            <span className="text-surface-600">{order.phone}</span>
          </div>
          {order.notes && (
            <div className="flex items-start gap-3">
              <IoTimeOutline size={18} className="text-surface-400 mt-0.5" />
              <span className="text-surface-600">{order.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
