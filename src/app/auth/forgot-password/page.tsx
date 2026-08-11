'use client';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { IoMailOutline, IoArrowBack } from 'react-icons/io5';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call since backend doesn't have forgot-password yet
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">Forgot Password?</h1>
          <p className="text-surface-500 mt-1">Enter your email to receive reset instructions</p>
        </div>

        {sent ? (
          <div className="card card-body text-center">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-lg font-bold text-surface-900 mb-2">Check Your Email</h2>
            <p className="text-surface-500 text-sm mb-6">
              We&apos;ve sent password reset instructions to <strong>{email}</strong>
            </p>
            <Link href="/auth/login" className="btn-primary w-full">
              <IoArrowBack size={18} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card card-body space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className="input-field"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              <IoMailOutline size={18} />
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link href="/auth/login" className="text-center text-sm text-surface-500 hover:text-surface-700 block">
              <IoArrowBack size={14} className="inline mr-1" /> Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
