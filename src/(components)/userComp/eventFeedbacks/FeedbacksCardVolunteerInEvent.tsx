"use client";
import { FeedbackRequestStatus } from "@/generated/enums";
import { Star } from "lucide-react";

type FeedbackData = {
  id: string;
  userId: string | null;
  user: {
    name: string | null;
  } | null;
  rating: number | null;
  event: {
    name: string;
  };
  feedback: string | null;
  eventId: string;
  requestStatus: FeedbackRequestStatus;
  requestedAt: Date;
  respondedAt: Date | null;
  responded: boolean;
};

interface FeedbackCardProps {
  feedbackData: FeedbackData;
  isLoading?: boolean;
  parentRefetch: () => void;
}

export const FeedbacksCardVolunteerInEvent: React.FC<FeedbackCardProps> = ({
  feedbackData,
}) => {
  const isPending = feedbackData.requestStatus === "PENDING";
  const isResponded = feedbackData.requestStatus === "SUBMITTED";

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/90 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/60">
      {/* Status Badge */}
      <div className="absolute right-4 top-4 z-10">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            isPending
              ? "bg-amber-500/20 text-amber-300"
              : isResponded
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-500/20 text-slate-300"
          }`}
        >
          {feedbackData.requestStatus}
        </span>
      </div>

      {/* Header Section */}
      <div className="space-y-4 border-b border-slate-700/50 px-6 py-5">
        <div className="flex items-start justify-between gap-4 pr-24">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-slate-100">
              {feedbackData.event.name}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {feedbackData.user?.name || "Anonymous"} · Requested{" "}
              {formatDate(feedbackData.requestedAt)}
            </p>
          </div>
        </div>

        {/* Existing Feedback Info (if already responded) */}
        {isResponded && feedbackData.rating && (
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`transition-colors ${
                    star <= feedbackData.rating!
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">
              {feedbackData.rating} out of 5
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-6 py-5">
        {isResponded ? (
          // Display Mode (Already Responded)
          <div className="space-y-4">
            {feedbackData.feedback && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Feedback
                </p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                  {feedbackData.feedback}
                </p>
              </div>
            )}
            {feedbackData.respondedAt && (
              <p className="text-xs text-slate-500">
                Responded on {formatDate(feedbackData.respondedAt)}
              </p>
            )}
          </div>
        ) : isPending ? (
          // Display Mode (Pending Feedback)
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Waiting for feedback on this event.
            </p>
          </div>
        ) : (
          // Display Mode (Cancelled)
          <p className="text-sm text-slate-400">
            This feedback request was cancelled.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbacksCardVolunteerInEvent;
