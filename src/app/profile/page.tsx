'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IoPersonOutline, IoLockClosedOutline, IoSaveOutline, IoArrowBack } from 'react-icons/io5';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser, checkAuth } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '' });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', profileForm);
      await checkAuth();
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 mb-6 transition-colors">
        <IoArrowBack size={16} /> Back
      </Link>
      <h1 className="text-3xl font-bold text-surface-900 mb-8">My Profile</h1>

      <div className="flex gap-2 mb-8">
        <button onClick={() => setTab('profile')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'profile' ? 'bg-brand-50 text-brand-700' : 'text-surface-600 hover:bg-surface-50'}`}>
          <IoPersonOutline size={16} /> Profile
        </button>
        <button onClick={() => setTab('password')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'password' ? 'bg-brand-50 text-brand-700' : 'text-surface-600 hover:bg-surface-50'}`}>
          <IoLockClosedOutline size={16} /> Change Password
        </button>
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleProfileUpdate} className="card card-body space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="label">Address</label>
            <input type="text" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            <IoSaveOutline size={18} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePasswordChange} className="card card-body space-y-5">
          <div>
            <label className="label">Current Password</label>
            <input type="password" required value={passForm.currentPassword} onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })} className="input-field" minLength={6} />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" required value={passForm.newPassword} onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} className="input-field" minLength={6} />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" required value={passForm.confirmPassword} onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })} className="input-field" minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            <IoLockClosedOutline size={18} /> {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  );
}
