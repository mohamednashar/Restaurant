'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/app/components/ui/Modal';
import ConfirmDialog from '@/app/components/ui/ConfirmDialog';
import Pagination from '@/app/components/ui/Pagination';
import ImageUpload from '@/app/components/ui/ImageUpload';
import EmptyState from '@/app/components/ui/EmptyState';
import { IoAddOutline, IoPencilOutline, IoTrashOutline, IoSearch } from 'react-icons/io5';

interface Meal { _id: string; name: string; description: string; price: number; category: any; image?: { url: string; publicId: string }; options: any[]; ingredients: string[]; preparationTime: number; isAvailable: boolean; isFeatured: boolean; }
interface Category { _id: string; name: string; }

const defaultMeal = { name: '', description: '', price: '', category: '', options: '[{"title":"Small","additionalPrice":0},{"title":"Medium","additionalPrice":4},{"title":"Large","additionalPrice":6}]', ingredients: '', preparationTime: '15', isAvailable: true, isFeatured: false };

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Meal | null>(null);
  const [form, setForm] = useState(defaultMeal);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/meals', { params: { page, limit: 10, search } });
      setMeals(data.meals);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load meals'); }
    finally { setLoading(false); }
  }, [page, search]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch {}
  };

  useEffect(() => { fetchMeals(); }, [fetchMeals]);
  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultMeal); setImageFile(null); setModalOpen(true); };
  const openEdit = (meal: Meal) => {
    setEditing(meal);
    setForm({
      name: meal.name, description: meal.description, price: String(meal.price),
      category: meal.category?._id || '', options: JSON.stringify(meal.options || []),
      ingredients: (meal.ingredients || []).join(', '), preparationTime: String(meal.preparationTime),
      isAvailable: meal.isAvailable, isFeatured: meal.isFeatured,
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('preparationTime', form.preparationTime);
      fd.append('isAvailable', String(form.isAvailable));
      fd.append('isFeatured', String(form.isFeatured));
      fd.append('options', form.options);
      fd.append('ingredients', JSON.stringify(form.ingredients.split(',').map((s: string) => s.trim()).filter(Boolean)));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/meals/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Meal updated');
      } else {
        await api.post('/meals', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Meal created');
      }
      setModalOpen(false);
      fetchMeals();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/meals/${deleteTarget._id}`);
      toast.success('Meal deleted');
      setDeleteTarget(null);
      fetchMeals();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Meals</h1>
          <p className="text-surface-500 text-sm">{pagination.total || 0} meals total</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm"><IoAddOutline size={18} /> Add Meal</button>
      </div>

      <div className="relative max-w-md">
        <IoSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" placeholder="Search meals..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10 text-sm" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-surface-100 bg-surface-50">
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Meal</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Category</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Price</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Status</th>
              <th className="text-left px-6 py-3 font-semibold text-surface-600">Featured</th>
              <th className="text-right px-6 py-3 font-semibold text-surface-600">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-surface-400">Loading...</td></tr>
              ) : meals.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={<IoAddOutline size={32} />} title="No meals" description="Add your first meal to get started." action={<button onClick={openAdd} className="btn-primary btn-sm">Add Meal</button>} /></td></tr>
              ) : meals.map((meal) => (
                <tr key={meal._id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-100 shrink-0">
                        {meal.image?.url ? <img src={meal.image.url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>}
                      </div>
                      <span className="font-medium text-surface-900">{meal.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-surface-600">{meal.category?.name || '—'}</td>
                  <td className="px-6 py-4 font-semibold">${meal.price.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`badge ${meal.isAvailable ? 'badge-success' : 'badge-danger'}`}>{meal.isAvailable ? 'Available' : 'Unavailable'}</span></td>
                  <td className="px-6 py-4"><span className={`badge ${meal.isFeatured ? 'badge-warning' : 'badge-neutral'}`}>{meal.isFeatured ? 'Yes' : 'No'}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(meal)} className="p-2 hover:bg-surface-100 rounded-lg text-surface-500 hover:text-surface-700 transition-colors"><IoPencilOutline size={16} /></button>
                      <button onClick={() => setDeleteTarget(meal)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-600 transition-colors"><IoTrashOutline size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={pagination.pages} onPageChange={setPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Meal' : 'Add Meal'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label">Price *</label>
              <input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Preparation Time (min)</label>
              <input type="number" value={form.preparationTime} onChange={(e) => setForm({ ...form, preparationTime: e.target.value })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} />
          </div>
          <div>
            <label className="label">Ingredients (comma-separated)</label>
            <input type="text" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} placeholder="Tomato, Cheese, Basil" className="input-field" />
          </div>
          <div>
            <label className="label">Options (JSON)</label>
            <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} className="input-field font-mono text-xs resize-none" rows={3} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="rounded border-surface-300" />
              <span className="text-sm text-surface-700">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-surface-300" />
              <span className="text-sm text-surface-700">Featured</span>
            </label>
          </div>
          <ImageUpload currentImage={editing?.image?.url} onUpload={(file: File) => setImageFile(file)} onRemove={() => setImageFile(null)} disabled={saving} />
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary btn-sm" disabled={saving}>Cancel</button>
            <button type="submit" className="btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Meal" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} loading={deleting} />
    </div>
  );
}
