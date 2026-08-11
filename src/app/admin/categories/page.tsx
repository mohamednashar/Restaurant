'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Modal from '@/app/components/ui/Modal';
import ConfirmDialog from '@/app/components/ui/ConfirmDialog';
import ImageUpload from '@/app/components/ui/ImageUpload';
import EmptyState from '@/app/components/ui/EmptyState';
import { IoAddOutline, IoPencilOutline, IoTrashOutline } from 'react-icons/io5';

interface Category { _id: string; name: string; slug: string; description: string; image?: { url: string; publicId: string }; color: string; mealCount: number; isActive: boolean; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#e74c3c', isActive: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', color: '#e74c3c', isActive: true }); setImageFile(null); setModalOpen(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setForm({ name: cat.name, description: cat.description, color: cat.color, isActive: cat.isActive }); setImageFile(null); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('color', form.color);
      fd.append('isActive', String(form.isActive));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/categories/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated');
      } else {
        await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category created');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/categories/${deleteTarget._id}`);
      toast.success('Category deleted');
      setDeleteTarget(null);
      fetchCategories();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  const emojis: Record<string, string> = { pizzas: '🍕', burgers: '🍔', pastas: '🍝', salads: '🥗', drinks: '🥤' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Categories</h1>
          <p className="text-surface-500 text-sm">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm"><IoAddOutline size={18} /> Add Category</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState icon={<IoAddOutline size={32} />} title="No categories" description="Create your first category." action={<button onClick={openAdd} className="btn-primary btn-sm">Add Category</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="card card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-100">
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl" style={{ backgroundColor: cat.color + '15' }}>
                        {emojis[cat.slug] || '🍽️'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-900">{cat.name}</h3>
                    <p className="text-xs text-surface-500">{cat.mealCount} meals</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(cat)} className="p-2 hover:bg-surface-100 rounded-lg text-surface-500 transition-colors"><IoPencilOutline size={16} /></button>
                  <button onClick={() => setDeleteTarget(cat)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><IoTrashOutline size={16} /></button>
                </div>
              </div>
              <p className="text-sm text-surface-500 line-clamp-2">{cat.description || 'No description'}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`badge ${cat.isActive ? 'badge-success' : 'badge-danger'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span>
                <div className="w-4 h-4 rounded-full border border-surface-200" style={{ backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} maxWidth="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg border border-surface-200 cursor-pointer" />
                <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="input-field flex-1 font-mono text-sm" />
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-3">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-surface-300" />
                <span className="text-sm text-surface-700">Active</span>
              </label>
            </div>
          </div>
          <ImageUpload currentImage={editing?.image?.url} onUpload={(file: File) => setImageFile(file)} onRemove={() => setImageFile(null)} disabled={saving} />
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary btn-sm" disabled={saving}>Cancel</button>
            <button type="submit" className="btn-primary btn-sm" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Category" message={`Delete "${deleteTarget?.name}"? ${deleteTarget?.mealCount ? `It has ${deleteTarget.mealCount} meals.` : 'This cannot be undone.'}`} loading={deleting} />
    </div>
  );
}
