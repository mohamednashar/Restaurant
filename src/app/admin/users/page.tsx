'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Pagination from '@/app/components/ui/Pagination';
import ConfirmDialog from '@/app/components/ui/ConfirmDialog';
import EmptyState from '@/app/components/ui/EmptyState';
import { IoSearch, IoPeopleOutline, IoTrashOutline } from 'react-icons/io5';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/auth/users', { params: { page, limit: 10, search } });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/auth/users/${deleteTarget._id}`);
      toast.success('User deleted');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Users</h1>
        <p className="text-surface-500 text-sm">{pagination.total || 0} users</p>
      </div>

      <div className="relative max-w-md">
        <IoSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10 text-sm" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-surface-100 bg-surface-50">
              <th className="text-left px-6 py-3 font-semibold text-surface-600">User</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Email</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Role</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Joined</th>
              <th className="text-right px-6 py-3 font-semibold text-surface-600">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-surface-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon={<IoPeopleOutline size={32} />} title="No users found" description="" action={<span />} /></td></tr>
              ) : users.map((user) => (
                <tr key={user._id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-surface-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-surface-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-neutral'} capitalize`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4 text-surface-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'admin' && (
                      <button onClick={() => setDeleteTarget(user)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><IoTrashOutline size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={pagination.pages} onPageChange={setPage} />
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete User" message={`Delete user "${deleteTarget?.name}"? This cannot be undone.`} loading={deleting} />
    </div>
  );
}
