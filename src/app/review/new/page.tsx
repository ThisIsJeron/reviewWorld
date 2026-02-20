import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewForm } from "@/components/review/ReviewForm";

export const metadata: Metadata = {
  title: "Write a Review | ReviewWorld",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ variationId?: string; reviewId?: string }>;
}

export default async function WriteReviewPage({ searchParams }: PageProps) {
  const session = await auth();
  const { variationId, reviewId } = await searchParams;

  if (!session?.user?.id) {
    const callbackUrl = variationId
      ? `/review/new?variationId=${variationId}`
      : "/review/new";
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!variationId) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl">
        <div className="flex flex-col items-center text-center gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Product not specified</h1>
          <p className="text-muted-foreground">
            Please navigate to a product page and click &ldquo;Write a Review&rdquo;.
          </p>
          <Button asChild>
            <Link href="/brands">Browse all brands</Link>
          </Button>
        </div>
      </div>
    );
  }

  const variation = await prisma.variation.findUnique({
    where: { id: variationId },
    include: {
      productLine: {
        include: {
          brand: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!variation) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl">
        <div className="flex flex-col items-center text-center gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Product not found</h1>
          <p className="text-muted-foreground">
            The product you&apos;re trying to review couldn&apos;t be found.
          </p>
          <Button asChild>
            <Link href="/brands">Browse all brands</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Check if editing an existing review
  let existingReview = null;
  if (reviewId) {
    existingReview = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existingReview || existingReview.userId !== session.user.id) {
      redirect(
        `/brands/${variation.productLine.brand.slug}/${variation.productLine.slug}/${variation.slug}`,
      );
    }
  }

  const variationUrl = `/brands/${variation.productLine.brand.slug}/${variation.productLine.slug}/${variation.slug}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href={variationUrl}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {variation.name}
      </Link>

      <h1 className="text-3xl font-bold mb-6">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h1>

      {/* Product Context Panel */}
      <div className="bg-muted rounded-xl p-4 flex items-center gap-4 mb-8">
        {(variation.imageUrl ?? variation.productLine.imageUrl) ? (
          <Image
            src={(variation.imageUrl ?? variation.productLine.imageUrl)!}
            alt={variation.name}
            width={64}
            height={64}
            className="rounded-lg object-cover flex-shrink-0"
            unoptimized
          />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex-shrink-0" />
        )}
        <div>
          <p className="font-semibold text-base">{variation.name}</p>
          <p className="text-sm text-muted-foreground">
            {variation.productLine.name} &middot; {variation.productLine.brand.name}
          </p>
        </div>
      </div>

      <ReviewForm
        variationId={variationId}
        variationUrl={variationUrl}
        existingReview={
          existingReview
            ? {
                id: existingReview.id,
                rating: existingReview.rating,
                title: existingReview.title,
                body: existingReview.body,
                wouldBuyAgain: existingReview.wouldBuyAgain,
              }
            : undefined
        }
      />
    </div>
  );
}
