"use client";
import { FeedbackRequestStatus } from "@/generated/enums";
import { useCompAlert } from "@/hooks/useCompAlert";
import { getClientErrorMessage } from "@/lib/errors/clientErrors";
import axios from "axios";
import { Star, Send, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

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
  parentRefetch: () => void
}

export const FeedbacksCardVolunteer: React.FC<FeedbackCardProps> = ({
  feedbackData,
  parentRefetch,
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(feedbackData.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState(feedbackData.feedback || "");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { triggerCompAlert } = useCompAlert();
  const triggerCompAlertRef = useRef(triggerCompAlert);

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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!rating) {
      setError("Please select a rating");
      return;
    }

    if (!feedback.trim()) {
      setError("Please provide feedback");
      return;
    }

    setSubmitLoading(true);
    setError(null);

    try {
      e.preventDefault();

      const response = await axios.put(
        `/api/user/eventFeedbacks/${feedbackData.id}`,
        { feedback: feedback, rating: rating },
      );
      triggerCompAlertRef.current({
        message: `${response.data.message}`,
        type: "success",
        isOpened: true,
      });
      setRating(0);
      setFeedback("");
      parentRefetch()
    } catch (error) {
      const message = getClientErrorMessage(error);
      triggerCompAlertRef.current({
        message: `${message}`,
        type: "error",
        isOpened: true,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    setRating(feedbackData.rating || 0);
    setFeedback(feedbackData.feedback || "");
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/40 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/60">
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
        {!isEditing && isResponded ? (
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
        ) : isEditing && isPending ? (
          // Edit Mode (Pending Feedback)
          <div className="space-y-5">
            {/* Rating Selector */}
            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-300">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    type="button"
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  >
                    <Star
                      size={24}
                      className={`transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600 hover:text-slate-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {!rating && error === "Please select a rating" && (
                <p className="mt-2 text-xs text-red-400">{error}</p>
              )}
            </div>

            {/* Feedback Textarea */}
            <div>
              <label
                htmlFor={`feedback-${feedbackData.id}`}
                className="mb-3 block text-xs font-medium uppercase tracking-wider text-slate-300"
              >
                Your Feedback
              </label>
              <textarea
                id={`feedback-${feedbackData.id}`}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts and experience..."
                className="w-full resize-none rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-slate-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
                rows={4}
              />
              {!feedback.trim() && error === "Please provide feedback" && (
                <p className="mt-2 text-xs text-red-400">{error}</p>
              )}
            </div>

            {/* Generic Error */}
            {error &&
              !error.includes("rating") &&
              !error.includes("feedback") && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={(e) => handleSubmit(e)}
                disabled={submitLoading || isLoading}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading || isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Feedback
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={submitLoading || isLoading}
                type="button"
                className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : isPending ? (
          // Display Mode (Pending Feedback)
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Waiting for your feedback on this event.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700"
            >
              <Send size={16} />
              Provide Feedback
            </button>
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

export default FeedbacksCardVolunteer;
