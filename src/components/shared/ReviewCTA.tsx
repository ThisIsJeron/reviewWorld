"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface ReviewCTAProps {
  variationId: string;
  isAuthenticated: boolean;
  existingReviewId?: string;
  brandSlug: string;
  lineSlug: string;
  varSlug: string;
  label?: string;
}

export function ReviewCTA({
  variationId,
  isAuthenticated,
  existingReviewId,
  brandSlug,
  lineSlug,
  varSlug,
  label,
}: ReviewCTAProps) {
  const callbackUrl = `/review/new?variationId=${variationId}`;

  if (!isAuthenticated) {
    return (
      <Button
        size="lg"
        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
        onClick={() => signIn("google", { callbackUrl })}
      >
        {label ?? "Sign In to Review"}
      </Button>
    );
  }

  if (existingReviewId) {
    return (
      <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
        <Link href={`/review/new?variationId=${variationId}&reviewId=${existingReviewId}`}>
          Edit Your Review
        </Link>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
      asChild
    >
      <Link href={`/review/new?variationId=${variationId}`}>
        {label ?? "Write a Review"}
      </Link>
    </Button>
  );
}
