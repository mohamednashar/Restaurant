'use client';
import { useAuth } from '@/hooks/useAuth';
import { IoPersonOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-surface-500 text-sm">Manage your account and preferences</p>
      </div>

      <div className="card card-body">
        <h2 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
          <IoPersonOutline size={18} /> Account Information
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-surface-100">
            <span className="text-surface-500">Name</span>
            <span className="font-medium text-surface-900">{user?.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-surface-100">
            <span className="text-surface-500">Email</span>
            <span className="font-medium text-surface-900">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-surface-100">
            <span className="text-surface-500">Role</span>
            <span className="badge badge-warning capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-surface-500">Phone</span>
            <span className="font-medium text-surface-900">{user?.phone || 'Not set'}</span>
          </div>
        </div>
      </div>

      <div className="card card-body">
        <h2 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
          <IoShieldCheckmarkOutline size={18} /> Security
        </h2>
        <div className="space-y-3">
          <Link href="/profile" className="btn-secondary w-full justify-start">
            Edit Profile & Change Password
          </Link>
        </div>
      </div>

      <div className="card card-body">
        <h2 className="font-bold text-surface-900 mb-4">About</h2>
        <div className="space-y-2 text-sm text-surface-500">
          <p>FoodFusion Restaurant Management System</p>
          <p>Version 1.0.0</p>
          <p>Built with Next.js, Node.js, Express, MongoDB</p>
        </div>
      </div>
    </div>
  );
}
