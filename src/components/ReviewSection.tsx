import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, User, Send, Award } from 'lucide-react';
import { ProductReview, UserProfile } from '../types';
import { Button } from './common/Button';

interface ReviewSectionProps {
  listingId: string;
  reviews: ProductReview[];
  currentUser: UserProfile | null;
  onAddReview: (listingId: string, rating: number, comment: string) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  listingId,
  reviews,
  currentUser,
  onAddReview
}) => {
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);

  const listingReviews = reviews.filter(r => r.listingId === listingId);
  const avgRating = listingReviews.length > 0
    ? (listingReviews.reduce((sum, r) => sum + r.rating, 0) / listingReviews.length).toFixed(1)
    : '5.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddReview(listingId, ratingInput, commentInput);
    setCommentInput('');
    setShowReviewForm(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
      
      {/* Header & Rating Breakdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-stone-100 pb-6">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" /> Buyer Ratings & Quality Reviews
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">Verified wholesale buyer inspection feedback</p>
        </div>

        <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <div className="text-center px-3 border-r border-stone-200">
            <p className="text-3xl font-extrabold text-stone-900 leading-none">{avgRating}</p>
            <div className="flex text-amber-500 justify-center mt-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${star <= Math.round(Number(avgRating)) ? 'fill-amber-500' : 'text-stone-300'}`}
                />
              ))}
            </div>
            <p className="text-[10px] text-stone-400 font-semibold mt-1">{listingReviews.length} reviews</p>
          </div>

          <div className="space-y-1 min-w-32">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = listingReviews.filter(r => r.rating === stars).length;
              const pct = listingReviews.length > 0 ? (count / listingReviews.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-[10px] text-stone-500">
                  <span className="w-3 text-right font-medium">{stars}★</span>
                  <div className="h-1.5 flex-1 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="w-4 font-mono text-[9px]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Review Button / Form */}
      {currentUser && (
        <div>
          {!showReviewForm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewForm(true)}
              icon={<MessageSquare className="w-4 h-4 text-emerald-700" />}
            >
              Write Quality Review
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
              <h4 className="text-xs font-bold text-stone-900">Write a Review for this Crop Harvest</h4>
              
              {/* Star selector */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Your Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || ratingInput)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Inspection Feedback:</label>
                <textarea
                  rows={3}
                  required
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  placeholder="Share details on moisture content, cleanliness, packaging, and delivery efficiency..."
                  className="w-full bg-white border border-stone-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                  Post Review
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {listingReviews.length === 0 ? (
          <p className="text-xs text-stone-400 italic">No buyer reviews yet. Be the first to leave inspection feedback for this harvest.</p>
        ) : (
          listingReviews.map(rev => (
            <div key={rev.id} className="p-4 rounded-2xl border border-stone-100 bg-stone-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                    {rev.reviewerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-stone-900">{rev.reviewerName}</h5>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400">{rev.reviewerRole} • {rev.createdAt}</p>
                  </div>
                </div>

                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-500' : 'text-stone-300'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed pl-10">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
