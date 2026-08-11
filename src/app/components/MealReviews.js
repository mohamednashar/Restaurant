'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { IoStar, IoStarOutline, IoTrashOutline } from 'react-icons/io5';

function StarRating({ rating, onRate, interactive = false, size = 16 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          {star <= (hover || rating) ? (
            <IoStar size={size} className="text-amber-400" fill="currentColor" />
          ) : (
            <IoStarOutline size={size} className="text-amber-400" />
          )}
        </button>
      ))}
    </div>
  );
}

export default function MealReviews({ mealId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/meal/${mealId}`);
      setReviews(data.reviews);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [mealId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) { toast.error('Please enter the order ID this meal was part of'); return; }
    setSubmitting(true);
    try {
      await api.post(`/reviews/meal/${mealId}`, { rating, comment, orderId: orderId.trim() });
      toast.success('Review submitted!');
      setShowForm(false);
      setComment('');
      setOrderId('');
      setRating(5);
      fetchReviews();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-surface-900">{avgRating}</span>
          <div>
            <StarRating rating={Math.round(Number(avgRating))} size={18} />
            <p className="text-xs text-surface-500 mt-0.5">{reviews.length} reviews</p>
          </div>
        </div>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="btn-secondary btn-sm">
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card card-body space-y-4 animate-slide-up">
          <div>
            <label className="label">Your Rating</label>
            <StarRating rating={rating} onRate={setRating} interactive size={24} />
          </div>
          <div>
            <label className="label">Order ID</label>
            <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Paste your order ID here" className="input-field text-sm" required />
          </div>
          <div>
            <label className="label">Comment (optional)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="input-field text-sm resize-none" placeholder="How was the meal?" maxLength={500} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary btn-sm w-fit">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-surface-500 py-8">No reviews yet. Be the first to review!</p>
        ) : reviews.map((review) => (
          <div key={review._id} className="card card-body">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium text-surface-900 text-sm">{review.user?.name || 'Anonymous'}</p>
                  <StarRating rating={review.rating} size={12} />
                </div>
              </div>
              {user && (user._id === review.user?._id || user.role === 'admin') && (
                <button onClick={() => handleDelete(review._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                  <IoTrashOutline size={14} />
                </button>
              )}
            </div>
            {review.comment && <p className="text-sm text-surface-600 mt-3">{review.comment}</p>}
            <p className="text-xs text-surface-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
