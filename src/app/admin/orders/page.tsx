'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Pagination from '@/app/components/ui/Pagination';
import EmptyState from '@/app/components/ui/EmptyState';
import { IoSearch, IoReceiptOutline } from 'react-icons/io5';

const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
const statusColors: Record<string, string> = {
  pending: 'badge-warning', confirmed: 'badge-info', preparing: 'badge-info',
  ready: 'badge-success', delivered: 'badge-success', cancelled: 'badge-danger',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/orders', { params });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order ${newStatus}`);
      fetchOrders();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setUpdatingId(null); }
  };

  const getNextStatus = (current: string) => {
    const idx = STATUSES.indexOf(current);
    if (current === 'cancelled' || current === 'delivered') return null;
    return STATUSES[Math.min(idx + 1, STATUSES.length - 1)];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Orders</h1>
        <p className="text-surface-500 text-sm">{pagination.total || 0} orders total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <IoSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" placeholder="Search by customer..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field w-auto text-sm">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-surface-100 bg-surface-50">
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Order ID</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Customer</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Items</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Total</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Status</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Date</th>
              <th className="text-right px-6 py-3 font-semibold text-surface-600">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-surface-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon={<IoReceiptOutline size={32} />} title="No orders" description="Orders will appear here once customers start ordering." action={<span />} /></td></tr>
              ) : orders.map((order) => {
                const next = getNextStatus(order.status);
                return (
                  <tr key={order._id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-surface-500">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-surface-900">{order.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-surface-500">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-surface-600">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="px-6 py-4"><span className={`badge ${statusColors[order.status] || 'badge-neutral'} capitalize`}>{order.status}</span></td>
                    <td className="px-6 py-4 text-surface-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {next && (
                          <button
                            onClick={() => updateStatus(order._id, next)}
                            disabled={updatingId === order._id}
                            className={`btn-sm text-xs ${next === 'cancelled' ? 'btn-danger' : 'btn-primary'}`}
                          >
                            {updatingId === order._id ? '...' : `Mark ${next}`}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={pagination.pages} onPageChange={setPage} />
    </div>
  );
}
