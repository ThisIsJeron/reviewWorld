"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReviewFormProps {
  variationId: string;
  variationUrl: string;
  existingReview?: {
    id: string;
    rating: number;
    title: string;
    body: string;
    wouldBuyAgain: boolean;
  };
}

interface FieldErrors {
  rating?: string[];
  title?: string[];
  body?: string[];
  wouldBuyAgain?: string[];
}

export function ReviewForm({ variationId, variationUrl, existingReview }: ReviewFormProps) {
  const router = useRouter();
  const isEdit = !!existingReview;

  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [wouldBuyAgain, setWouldBuyAgain] = useState<boolean | null>(
    existingReview?.wouldBuyAgain ?? null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");

  function validate(): boolean {
    const newErrors: FieldErrors = {};
    if (rating === 0) newErrors.rating = ["Please select a rating"];
    if (!title.trim()) newErrors.title = ["Title is required"];
    else if (title.length > 120) newErrors.title = ["Title must be under 120 characters"];
    if (!body.trim()) newErrors.body = ["Review is required"];
    else if (body.length < 10) newErrors.body = ["Review must be at least 10 characters"];
    else if (body.length > 2000) newErrors.body = ["Review must be under 2000 characters"];
    if (wouldBuyAgain === null) newErrors.wouldBuyAgain = ["Please select Yes or No"];
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setGlobalError("");

    try {
      const url = isEdit ? `/api/reviews/${existingReview!.id}` : "/api/reviews";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variationId, rating, title, body, wouldBuyAgain }),
      });

      const data = await res.json() as { error?: string; details?: FieldErrors };

      if (!res.ok) {
        if (data.details) {
          setErrors(data.details);
        } else {
          setGlobalError(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }

      toast.success(isEdit ? "Review updated!" : "Review posted!");
      router.push(variationUrl);
    } catch {
      setGlobalError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const displayStars = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Picker */}
      <div>
        <Label className="text-base font-medium">
          Your Rating <span className="text-red-500">*</span>
        </Label>
        <div
          role="radiogroup"
          aria-label="Star rating"
          className="flex gap-1 mt-2"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-label={`${star} stars`}
              aria-checked={rating === star}
              className="focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setRating(Math.min(5, star + 1));
                if (e.key === "ArrowLeft") setRating(Math.max(1, star - 1));
              }}
            >
              <Star
                className={`h-10 w-10 sm:h-9 sm:w-9 transition-colors ${
                  star <= displayStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-sm text-red-500 mt-1">{errors.rating[0]}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="title" className="text-base font-medium">
            Review Title <span className="text-red-500">*</span>
          </Label>
          <span
            className={`text-xs ${title.length > 100 ? "text-red-500" : "text-muted-foreground"}`}
          >
            {title.length}/120
          </span>
        </div>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 120))}
          placeholder="Summarize your experience in one line..."
          aria-describedby="title-error"
          disabled={submitting}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-red-500 mt-1">
            {errors.title[0]}
          </p>
        )}
      </div>

      {/* Body */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="body" className="text-base font-medium">
            Your Review <span className="text-red-500">*</span>
          </Label>
          <span
            className={`text-xs ${body.length > 1800 ? "text-red-500" : "text-muted-foreground"}`}
          >
            {body.length}/2000
          </span>
        </div>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 2000))}
          placeholder="Share the details of your experience..."
          rows={6}
          aria-describedby="body-error"
          disabled={submitting}
        />
        {errors.body && (
          <p id="body-error" className="text-sm text-red-500 mt-1">
            {errors.body[0]}
          </p>
        )}
      </div>

      {/* Would Buy Again */}
      <div>
        <Label className="text-base font-medium">
          Would you buy this product again? <span className="text-red-500">*</span>
        </Label>
        <div role="radiogroup" className="flex gap-3 mt-2">
          <button
            type="button"
            role="radio"
            aria-checked={wouldBuyAgain === true}
            className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors ${
              wouldBuyAgain === true
                ? "bg-green-100 text-green-700 border-green-400"
                : "border-border text-foreground hover:border-green-300"
            }`}
            onClick={() => setWouldBuyAgain(true)}
            disabled={submitting}
          >
            Yes
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={wouldBuyAgain === false}
            className={`px-6 py-2 rounded-lg border-2 font-medium transition-colors ${
              wouldBuyAgain === false
                ? "bg-red-100 text-red-700 border-red-400"
                : "border-border text-foreground hover:border-red-300"
            }`}
            onClick={() => setWouldBuyAgain(false)}
            disabled={submitting}
          >
            No
          </button>
        </div>
        {errors.wouldBuyAgain && (
          <p className="text-sm text-red-500 mt-1">{errors.wouldBuyAgain[0]}</p>
        )}
      </div>

      {globalError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          {globalError}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {isEdit ? "Updating..." : "Posting..."}
            </>
          ) : isEdit ? (
            "Update Review"
          ) : (
            "Post Review"
          )}
        </Button>
      </div>
    </form>
  );
}
