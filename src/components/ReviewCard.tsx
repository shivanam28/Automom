import { Star, User } from "lucide-react";
import type { Review } from "@/types/review";

// Note: meeting_title is intentionally NOT displayed here even though it's
// stored in the database. A meeting title can reveal confidential internal
// context (project names, client names, etc.) that a reviewer never
// consented to making public. We keep it in storage for potential internal
// analytics, but it must never render on this public-facing card.
export function ReviewCard({ review }: { review: Review }) {
  const displayName = review.user_name || "Anonymous";
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="animate-fade-in rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center gap-3">
        {review.user_avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.user_avatar_url}
            alt={displayName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
            <User className="h-4 w-4 text-slate-400" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {displayName}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{date}</p>
        </div>
      </div>

      <div className="mb-2 flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= review.rating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200 dark:text-slate-600"
            }`}
          />
        ))}
      </div>

      {review.comment && (
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {review.comment}
        </p>
      )}
    </div>
  );
}
