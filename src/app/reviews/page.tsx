"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageSquareText } from "lucide-react";
import { ReviewCard } from "@/components/ReviewCard";
import type { Review } from "@/types/review";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reviews?limit=50")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setReviews(data.reviews);
      })
      .catch(() => setError("Couldn't load reviews right now."));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          What people are saying
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Real feedback from Automom users.
        </p>
      </div>

      {reviews === null && !error && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400 dark:text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading reviews...
        </div>
      )}

      {error && (
        <p className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">{error}</p>
      )}

      {reviews && reviews.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <MessageSquareText className="h-6 w-6 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">
            No reviews yet — be the first to share your experience.
          </p>
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </main>
  );
}
