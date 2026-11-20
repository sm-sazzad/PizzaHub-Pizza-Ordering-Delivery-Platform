"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getTokenClient } from "@/lib/tokenAccess";
import {
  StarIcon,
  CheckIcon,
  ShieldCheckIcon,
  MessageSquareIcon,
} from "@/components/ui/Icons";

export interface Review {
  _id?: string;
  menuItemId: string;
  customerName: string;
  customerEmail: string;
  customerImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsSectionProps {
  menuItemId: string;
  itemName: string;
}

export function ReviewsSection({ menuItemId, itemName }: ReviewsSectionProps) {
  const { user, isLoggedIn } = useAuth();
  const toast = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOrdered, setHasOrdered] = useState(false);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check if current logged-in user already has a review
  const myReview = reviews.find((r) => r.customerEmail === user?.email);

  // 1. Fetch all reviews for this menu item
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/reviews?menuItemId=${menuItemId}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [menuItemId]);

  // 2. Check if logged-in customer has ordered this item
  useEffect(() => {
    const checkOrderEligibility = async () => {
      if (!isLoggedIn || !user?.email || user.role !== "customer") {
        setHasOrdered(false);
        return;
      }

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(
          `${apiUrl}/orders?email=${encodeURIComponent(user.email)}`,
          {
            headers: {
              authorization: `Bearer ${await getTokenClient()}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          const orderList = Array.isArray(data) ? data : data.orders || [];
          const matched = orderList.some(
            (o: { menuItemId?: string; itemId?: string }) =>
              o.menuItemId === menuItemId || o.itemId === menuItemId,
          );
          setHasOrdered(matched);
        }
      } catch (err) {
        console.error("Failed to verify order history:", err);
      }
    };

    checkOrderEligibility();
  }, [isLoggedIn, user?.email, user?.role, menuItemId]);

  // 3. Handle Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.warning("Please write a short review before submitting.", "Comment Required");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${await getTokenClient()}`,
        },
        body: JSON.stringify({
          menuItemId,
          rating,
          comment: comment.trim(),
          customerName: user?.name || "Customer",
          customerImage: user?.image || "",
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        toast.error(resData.message || "Failed to submit review.", "Error");
        return;
      }

      toast.success(
        myReview
          ? "Your review has been updated!"
          : "Thank you! Your review has been saved.",
        "Review Saved",
      );

      // Refresh reviews list locally
      const updatedReview: Review = {
        menuItemId,
        customerName: user?.name || "Customer",
        customerEmail: user?.email || "",
        customerImage: user?.image || "",
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => {
        const filtered = prev.filter((r) => r.customerEmail !== user?.email);
        return [updatedReview, ...filtered];
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Review submission error:", err);
      toast.error("Failed to submit review. Please try again.", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate Average Rating
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
          totalReviews
        ).toFixed(1)
      : "5.0";

  // Calculate star rating distribution (1 to 5)
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(Number(r.rating)) === star).length,
  }));

  const ratingDescriptions: Record<number, string> = {
    1: "1 Star — Disappointing",
    2: "2 Stars — Fair",
    3: "3 Stars — Good",
    4: "4 Stars — Very Good",
    5: "5 Stars — Exceptional!",
  };

  return (
    <section className="pt-10 border-t border-stone-200 dark:border-stone-800 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
              Customer Feedback
            </span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-xs font-semibold text-stone-500">
              Verified Orders
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Ratings & Reviews
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Real opinions and experiences from customers who ordered {itemName}.
          </p>
        </div>

        {/* Big Overall Rating Pill */}
        <div className="flex items-center gap-3 bg-stone-50 dark:bg-stone-900 p-3.5 px-5 rounded-2xl border border-stone-200 dark:border-stone-800 w-fit">
          <div className="flex items-center gap-1.5 text-amber-500">
            <StarIcon size={24} className="fill-amber-400 text-amber-400" />
            <span className="font-heading text-2xl font-black text-stone-900 dark:text-white">
              {averageRating}
            </span>
          </div>
          <div className="border-l border-stone-200 dark:border-stone-700 pl-3">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
              {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
            </span>
            <span className="text-[10px] text-stone-400">100% Verified</span>
          </div>
        </div>
      </div>

      {/* Rating Breakdown & Review Submission Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Star Rating Distribution Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
          <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-white">
            Rating Breakdown
          </h3>
          <div className="space-y-2.5">
            {starCounts.map(({ star, count }) => {
              const percent =
                totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2.5 text-xs">
                  <span className="w-12 text-stone-600 dark:text-stone-300 font-semibold flex items-center gap-1">
                    <span>{star}</span>
                    <StarIcon size={12} className="fill-amber-400 text-amber-400 inline" />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] text-stone-400 font-medium">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-[11px] text-stone-500">
            <ShieldCheckIcon size={14} className="text-emerald-500 shrink-0" />
            <span>Only genuine buyers with completed orders can submit ratings.</span>
          </div>
        </div>

        {/* Right Column (2 cols): Submission Form or Status Note */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          {!isLoggedIn ? (
            /* Logged Out Message */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center">
                <StarIcon size={24} />
              </div>
              <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                Have you tasted this pizza?
              </h4>
              <p className="text-xs text-stone-500 max-w-sm">
                Sign in to your customer account and order {itemName} to leave your
                verified rating and review!
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                Sign In to Review
              </Link>
            </div>
          ) : user?.role !== "customer" ? (
            /* Vendor or Admin Role Notice */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Staff / Partner Account
              </span>
              <p className="text-xs text-stone-500 mt-2">
                Reviews can only be submitted by registered customer accounts.
              </p>
            </div>
          ) : !hasOrdered ? (
            /* Customer has NOT ordered this item yet */
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <StarIcon size={24} className="fill-amber-500 text-amber-500" />
              </div>
              <h4 className="font-heading text-base font-bold text-stone-900 dark:text-white">
                Verified Customer Reviews
              </h4>
              <p className="text-xs text-stone-500 max-w-md leading-relaxed">
                To guarantee authenticity, only customers who have placed an order for{" "}
                <strong className="text-stone-800 dark:text-stone-200">{itemName}</strong>{" "}
                can submit ratings and feedback.
              </p>
              <p className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                Order this pizza above to unlock your review form!
              </p>
            </div>
          ) : myReview && !isEditing ? (
            /* User has already submitted a review - show their review card */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckIcon size={12} />
                    <span>Your Review is Published</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRating(myReview.rating);
                    setComment(myReview.comment);
                    setIsEditing(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Edit Review
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        size={18}
                        className={
                          s <= myReview.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-transparent text-stone-300 dark:text-stone-700"
                        }
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {ratingDescriptions[myReview.rating]}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                  <p className="text-xs text-stone-700 dark:text-stone-300 italic leading-relaxed">
                    &ldquo;{myReview.comment}&rdquo;
                  </p>
                </div>

                <p className="text-[11px] text-stone-400">
                  You have already reviewed this pizza. If you wish to adjust your rating or words, click &ldquo;Edit Review&rdquo; above.
                </p>
              </div>
            </div>
          ) : (
            /* Eligible Customer Review Form (New or Editing) */
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h4 className="font-heading text-sm font-bold text-stone-900 dark:text-white">
                    {isEditing ? "Update Your Review" : "Rate Your Pizza Experience"}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {isEditing
                      ? "Make changes to your rating or comment below."
                      : "Your feedback helps artisan kitchens refine their recipes."}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckIcon size={12} />
                  <span>Verified Buyer</span>
                </span>
              </div>

              {/* Star Picker */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const activeScore = hoverRating || rating;
                    const isFilled = starValue <= activeScore;

                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                        aria-label={`Rate ${starValue} stars`}
                      >
                        <StarIcon
                          size={24}
                          className={`transition-colors ${
                            isFilled
                              ? "fill-amber-400 text-amber-400"
                              : "fill-transparent text-stone-300 dark:text-stone-700"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {ratingDescriptions[hoverRating || rating]}
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1">
                <label
                  htmlFor="reviewComment"
                  className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block"
                >
                  Your Review
                </label>
                <textarea
                  id="reviewComment"
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others about crust crispiness, toppings freshness, and delivery speed..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setComment("");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon size={14} />
                      <span>{isEditing ? "Update Review" : "Submit Review"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Customer Reviews List */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <MessageSquareIcon size={18} className="text-red-600" />
          <span>Customer Testimonials ({reviews.length})</span>
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-28" />
                    <div className="h-3 bg-stone-100 dark:bg-stone-800/60 rounded-md w-20" />
                  </div>
                </div>
                <div className="h-4 bg-stone-100 dark:bg-stone-800/60 rounded-md w-full" />
                <div className="h-4 bg-stone-100 dark:bg-stone-800/60 rounded-md w-3/4" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          /* Empty Reviews */
          <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-2">
            <p className="font-heading font-bold text-sm text-stone-900 dark:text-white">
              No Reviews Yet
            </p>
            <p className="text-xs text-stone-500">
              Be the first verified customer to order and share your verdict on {itemName}!
            </p>
          </div>
        ) : (
          /* Reviews Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev, idx) => {
              const formattedDate = rev.createdAt
                ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <div
                  key={rev._id || `rev-${idx}`}
                  className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 shrink-0">
                        {rev.customerImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rev.customerImage}
                            alt={rev.customerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-red-600 text-white font-bold text-xs uppercase">
                            {rev.customerName.charAt(0) || "C"}
                          </div>
                        )}
                      </div>

                      <div>
                        <h5 className="font-heading text-xs font-bold text-stone-900 dark:text-white">
                          {rev.customerName}
                        </h5>
                        <span className="text-[10px] text-stone-400 block">
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon
                          key={s}
                          size={14}
                          className={
                            s <= rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-transparent text-stone-300 dark:text-stone-700"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
