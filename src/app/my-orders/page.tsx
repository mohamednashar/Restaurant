'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/Redux/CartSlice';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Pagination from '@/app/components/ui/Pagination';
import { TableRowSkeleton } from '@/app/components/ui/Skeleton';
import EmptyState from '@/app/components/ui/EmptyState';
import { IoReceiptOutline, IoArrowBack, IoRefreshOutline, IoDocumentTextOutline } from 'react-icons/io5';

const statusColors: Record<string, string> = {
  pending: 'badge-warning', confirmed: 'badge-info', preparing: 'badge-info',
  ready: 'badge-success', delivered: 'badge-success', cancelled: 'badge-danger',
};

function printInvoice(order: any) {
  const win = window.open('', '_blank');
  if (!win) return;
  const itemsHtml = order.items.map((item: any) =>
    `<tr><td style="padding:8px;border-bottom:1px solid #eee">${item.name} (${item.size})</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(item.price * item.quantity).toFixed(2)}</td></tr>`
  ).join('');
  win.document.write(`<!DOCTYPE html><html><head><title>Invoice #${order._id.slice(-8).toUpperCase()}</title>
    <style>body{font-family:'Segoe UI',sans-serif;padding:40px;max-width:600px;margin:0 auto;color:#333}
    h1{font-size:24px;margin-bottom:4px}h2{font-size:14px;color:#666;font-weight:normal;margin-top:0}
    table{width:100%;border-collapse:collapse;margin:20px 0}.total{font-size:18px;font-weight:bold;text-align:right;margin-top:16px}
    .detail{margin:8px 0;font-size:14px;color:#555}.label{color:#888}</style></head><body>
    <h1>FoodFusion</h1><h2>Invoice</h2>
    <p class="detail"><span class="label">Order ID:</span> #${order._id.slice(-8).toUpperCase()}</p>
    <p class="detail"><span class="label">Date:</span> ${new Date(order.createdAt).toLocaleString()}</p>
    <p class="detail"><span class="label">Status:</span> ${order.status}</p>
    <p class="detail"><span class="label">Delivery:</span> ${order.deliveryAddress}</p>
    <p class="detail"><span class="label">Phone:</span> ${order.phone}</p>
    <table><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #333">Item</th><th style="text-align:center;padding:8px;border-bottom:2px solid #333">Qty</th><th style="text-align:right;padding:8px;border-bottom:2px solid #333">Price</th></tr></thead><tbody>${itemsHtml}</tbody></table>
    <div class="total">Total: $${order.totalAmount.toFixed(2)}</div>
    <p style="text-align:center;margin-top:40px;color:#888;font-size:12px">Thank you for ordering with FoodFusion!</p>
    </body></html>`);
  win.document.close();
  win.print();
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });

  useEffect(() => { if (!authLoading && !user) router.push('/auth/login'); }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/orders/my-orders', { params: { page, limit: 10 } });
        setOrders(data.orders);
        setPagination(data.pagination);
      } catch {} finally { setLoading(false); }
    };
    if (user) fetchOrders();
  }, [user, page]);

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      dispatch(addToCart({
        meal: { _id: item.meal?._id || item.meal, name: item.name, image: { url: item.image }, price: item.price },
        quantity: item.quantity, size: item.size, selectedOptions: item.size, unitPrice: item.price, total: item.price * item.quantity,
      }));
    });
    toast.success('Items added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/menu" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 mb-6 transition-colors">
        <IoArrowBack size={16} /> Back to Menu
      </Link>
      <h1 className="text-3xl font-bold text-surface-900 mb-8">My Orders</h1>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)}</div>
      ) : orders.length === 0 ? (
        <EmptyState icon={<IoReceiptOutline size={48} />} title="No orders yet" description="Place your first order and it will appear here." action={<Link href="/menu" className="btn-primary">Browse Menu</Link>} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-surface-100 bg-surface-50">
                  <th className="text-left px-6 py-3 font-semibold text-surface-600">Order ID</th>
                  <th className="text-left px-6 py-3 font-semibold text-surface-600">Items</th>
                  <th className="text-left px-6 py-3 font-semibold text-surface-600">Total</th>
                  <th className="text-left px-6 py-3 font-semibold text-surface-600">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-surface-600">Date</th>
                  <th className="text-right px-6 py-3 font-semibold text-surface-600">Actions</th>
                </tr></thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-surface-500">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4"><div className="flex items-center gap-2">{order.items.slice(0, 2).map((item: any, i: number) => <span key={i} className="text-surface-600">{item.name}{i < Math.min(order.items.length, 2) - 1 ? ',' : ''}</span>)}{order.items.length > 2 && <span className="text-surface-400">+{order.items.length - 2}</span>}</div></td>
                      <td className="px-6 py-4 font-semibold">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4"><span className={`badge ${statusColors[order.status] || 'badge-neutral'} capitalize`}>{order.status}</span></td>
                      <td className="px-6 py-4 text-surface-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/my-orders/${order._id}`} className="btn-ghost btn-sm text-xs">Track</Link>
                          <button onClick={() => handleReorder(order)} className="btn-ghost btn-sm text-xs text-brand-600"><IoRefreshOutline size={14} /> Reorder</button>
                          <button onClick={() => printInvoice(order)} className="btn-ghost btn-sm text-xs"><IoDocumentTextOutline size={14} /> Invoice</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
