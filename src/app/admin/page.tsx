'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  IoReceiptOutline,
  IoPeopleOutline,
  IoRestaurantOutline,
  IoCashOutline,
  IoTrendingUpOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from 'react-icons/io5';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  ready: '#10b981',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function AdminDashboard() {
  const [orderStats, setOrderStats] = useState<any>(null);
  const [mealStats, setMealStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orderRes, mealRes] = await Promise.all([
          api.get('/orders/stats'),
          api.get('/meals/stats'),
        ]);
        setOrderStats(orderRes.data.stats);
        setMealStats(mealRes.data.stats);
      } catch (err) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `$${(orderStats?.totalRevenue || 0).toLocaleString()}`, icon: IoCashOutline, color: 'bg-emerald-50 text-emerald-700', iconBg: 'bg-emerald-100' },
    { label: 'Total Orders', value: orderStats?.totalOrders || 0, icon: IoReceiptOutline, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
    { label: 'Total Meals', value: mealStats?.totalMeals || 0, icon: IoRestaurantOutline, color: 'bg-purple-50 text-purple-700', iconBg: 'bg-purple-100' },
    { label: 'Total Users', value: '—', icon: IoPeopleOutline, color: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-100' },
  ];

  const todayCards = [
    { label: "Today's Revenue", value: `$${(orderStats?.todayRevenue || 0).toLocaleString()}`, icon: IoTrendingUpOutline, iconBg: 'bg-emerald-100 text-emerald-700' },
    { label: "Today's Orders", value: orderStats?.todayOrders || 0, icon: IoTimeOutline, iconBg: 'bg-blue-100 text-blue-700' },
    { label: 'Pending Orders', value: orderStats?.pendingOrders || 0, icon: IoTimeOutline, iconBg: 'bg-amber-100 text-amber-700' },
    { label: 'Delivered', value: orderStats?.deliveredOrders || 0, icon: IoCheckmarkCircleOutline, iconBg: 'bg-emerald-100 text-emerald-700' },
  ];

  const pieData = (orderStats?.statusStats || []).map((s: any) => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-surface-500 text-sm">Overview of your restaurant performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card card-body flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}>
              <card.icon size={22} />
            </div>
            <div>
              <p className="text-sm text-surface-500">{card.label}</p>
              <p className="text-2xl font-bold text-surface-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {todayCards.map((card) => (
          <div key={card.label} className="card card-body">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg} mb-3`}>
              <card.icon size={18} />
            </div>
            <p className="text-xs text-surface-500">{card.label}</p>
            <p className="text-xl font-bold text-surface-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card card-body">
          <h3 className="font-bold text-surface-900 mb-4">Orders (Last 7 Days)</h3>
          {orderStats?.last7Days?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={orderStats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#f04438" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#f04438" opacity={0.3} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-surface-400 text-sm">No data yet</div>
          )}
        </div>

        <div className="card card-body">
          <h3 className="font-bold text-surface-900 mb-4">Order Status Distribution</h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((_: any, index: number) => (
                      <Cell key={index} fill={Object.values(STATUS_COLORS)[index % Object.values(STATUS_COLORS).length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((item: any, i: number) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: Object.values(STATUS_COLORS)[i % Object.values(STATUS_COLORS).length] }} />
                    <span className="text-surface-600">{item.name}</span>
                    <span className="font-semibold text-surface-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-surface-400 text-sm">No orders yet</div>
          )}
        </div>
      </div>

      {mealStats?.categoryStats?.length > 0 && (
        <div className="card card-body">
          <h3 className="font-bold text-surface-900 mb-4">Meals by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealStats.categoryStats.map((cat: any) => (
              <div key={cat.name} className="flex items-center gap-3 p-4 bg-surface-50 rounded-xl">
                <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-lg flex items-center justify-center font-bold text-sm">
                  {cat.count}
                </div>
                <div>
                  <p className="font-medium text-surface-900 text-sm">{cat.name}</p>
                  <p className="text-xs text-surface-500">Avg ${cat.avgPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
