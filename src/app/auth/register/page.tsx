'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { IoEyeOutline, IoEyeOffOutline, IoPersonAdd } from 'react-icons/io5';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerUser } = useAuth();
  const router = useRouter();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success('Account created!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Create Account</h1>
          <p className="text-surface-500 mt-1">Join us and start ordering</p>
        </div>

        <form onSubmit={handleSubmit} className="card card-body space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" required value={form.name} onChange={update('name')} placeholder="John Doe" className="input-field" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" required value={form.email} onChange={update('email')} placeholder="you@example.com" className="input-field" />
          </div>
          <div>
            <label className="label">Phone (optional)</label>
            <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+1234567890" className="input-field" />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={update('password')} placeholder="••••••••" className="input-field pr-11" minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                {showPass ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" required value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="••••••••" className="input-field" minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <IoPersonAdd size={18} />
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-semibold">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
