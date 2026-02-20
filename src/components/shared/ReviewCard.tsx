"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/StarRating";
import { ReportDialog } from "@/components/shared/ReportDialog";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title: string;
    body: string;
    wouldBuyAgain: boolean;
    createdAt: Date | string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  currentUserId?: string;
}

export function ReviewCard({ review, currentUserId }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const isLong = review.body.length > 300;
  const displayBody = isLong && !expanded ? review.body.slice(0, 300) + "..." : review.body;

  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const initials = review.user.name
    ? review.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              {review.user.image ? (
                <Image
                  src={review.user.image}
                  alt={review.user.name ?? "User"}
                  fill
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium text-sm">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <Link
                href={`/profile/${review.user.id}`}
                className="font-medium text-sm hover:underline"
              >
                {review.user.name ?? "Anonymous"}
              </Link>
              <StarRating rating={review.rating} size="sm" showValue={false} />
            </div>
          </div>
          <span className="text-sm text-muted-foreground flex-shrink-0">{date}</span>
        </div>

        <h3 className="font-semibold text-base mb-2">{review.title}</h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{displayBody}</p>

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-orange-500 hover:underline mb-3"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        <div className="flex items-center justify-between mt-2">
          <Badge
            className={
              review.wouldBuyAgain
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-red-100 text-red-700 hover:bg-red-100"
            }
          >
            {review.wouldBuyAgain ? "Yes, would buy again" : "Would not buy again"}
          </Badge>

          {currentUserId !== review.user.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReportOpen(true)}
              className="text-muted-foreground hover:text-red-500 gap-1"
            >
              <Flag className="h-3 w-3" />
              <span className="hidden sm:inline">Report</span>
            </Button>
          )}
        </div>
      </Card>

      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reviewId={review.id}
        isAuthenticated={!!currentUserId}
      />
    </>
  );
}
