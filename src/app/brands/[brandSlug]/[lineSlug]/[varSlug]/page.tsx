import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, ShoppingBasket } from "lucide-react";
import { auth } from "@/lib/auth";
import { getVariationBySlug } from "@/lib/data/productLines";
import { StarRating } from "@/components/shared/StarRating";
import { ReviewCard } from "@/components/shared/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ReviewCTA } from "@/components/shared/ReviewCTA";

const REVIEWS_PER_PAGE = 10;

interface PageProps {
  params: Promise<{ brandSlug: string; lineSlug: string; varSlug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug, lineSlug, varSlug } = await params;
  const variation = await getVariationBySlug(brandSlug, lineSlug, varSlug);
  if (!variation) return { title: "Product Not Found | ReviewWorld" };

  const reviewCount = variation.reviews.length;
  const avgRating =
    reviewCount > 0
      ? variation.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
        reviewCount
      : 0;

  return {
    title: `${variation.name} Reviews | ReviewWorld`,
    description: `Read ${reviewCount} community reviews for ${variation.name} by ${variation.productLine.brand.name}. Average rating: ${avgRating.toFixed(1)}/5.`,
    openGraph: {
      title: `${variation.name} | ReviewWorld`,
      description: variation.description ?? undefined,
      images: (variation.imageUrl ?? variation.productLine.imageUrl)
        ? [{ url: (variation.imageUrl ?? variation.productLine.imageUrl)! }]
        : [],
    },
  };
}

export default async function VariationDetailPage({ params, searchParams }: PageProps) {
  const { brandSlug, lineSlug, varSlug } = await params;
  const { sort = "newest", page: pageStr = "1" } = await searchParams;

  const [variation, session] = await Promise.all([
    getVariationBySlug(brandSlug, lineSlug, varSlug),
    auth(),
  ]);

  if (!variation) notFound();

  const brand = variation.productLine.brand;
  const line = variation.productLine;

  // Compute aggregate stats
  const allReviews = variation.reviews;
  const reviewCount = allReviews.length;
  const avgRating =
    reviewCount > 0
      ? allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
      : 0;
  const wouldBuyAgainPct =
    reviewCount > 0
      ? Math.round(
          (allReviews.filter((r: { wouldBuyAgain: boolean }) => r.wouldBuyAgain).length /
            reviewCount) *
            100,
        )
      : 0;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = allReviews.filter((r: { rating: number }) => r.rating === star).length;
    const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { star, count, pct };
  });

  // Sort reviews
  const sortedReviews = [...allReviews];
  if (sort === "newest") {
    sortedReviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (sort === "highest") {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  } else if (sort === "lowest") {
    sortedReviews.sort((a, b) => a.rating - b.rating);
  }

  // Paginate
  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const totalPages = Math.ceil(reviewCount / REVIEWS_PER_PAGE);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE,
  );

  // Check if current user has reviewed
  const existingReview = session?.user?.id
    ? allReviews.find((r: { user: { id: string } }) => r.user.id === session.user!.id)
    : null;

  function buildHref(p: number, s: string = sort) {
    const ps = new URLSearchParams();
    if (s !== "newest") ps.set("sort", s);
    if (p > 1) ps.set("page", String(p));
    const qs = ps.toString();
    return `/brands/${brandSlug}/${lineSlug}/${varSlug}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/brands">Brands</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/brands/${brandSlug}`}>{brand.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/brands/${brandSlug}/${lineSlug}`}>{line.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{variation.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Variation Header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10 items-start">
        <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-square flex-shrink-0">
          {(variation.imageUrl ?? variation.productLine.imageUrl) ? (
            <Image
              src={(variation.imageUrl ?? variation.productLine.imageUrl)!}
              alt={variation.name}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 640px) 100vw, 40vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
              <ShoppingBasket className="h-16 w-16 text-orange-400" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{variation.name}</h1>
          <p className="text-sm text-muted-foreground">
            <Link
              href={`/brands/${brandSlug}/${lineSlug}`}
              className="hover:underline"
            >
              {line.name}
            </Link>{" "}
            &middot;{" "}
            <Link href={`/brands/${brandSlug}`} className="hover:underline">
              {brand.name}
            </Link>
          </p>

          {variation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {variation.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {variation.description && (
            <p className="text-base leading-relaxed max-w-prose">{variation.description}</p>
          )}

          {/* Rating Summary */}
          <div className="bg-muted/40 rounded-2xl p-5 mt-2">
            {reviewCount > 0 ? (
              <>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-4xl font-bold">{avgRating.toFixed(1)}</span>
                  <StarRating rating={avgRating} size="lg" showValue={false} />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </p>

                <div className="space-y-2 mb-4">
                  {distribution.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-6 text-right">{star}★</span>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>

                <Badge
                  className={
                    wouldBuyAgainPct >= 70
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }
                >
                  {wouldBuyAgainPct}% would buy again
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet — be the first!</p>
            )}
          </div>

          {/* Write Review CTA */}
          <ReviewCTA
            variationId={variation.id}
            isAuthenticated={!!session?.user}
            existingReviewId={existingReview?.id}
            brandSlug={brandSlug}
            lineSlug={lineSlug}
            varSlug={varSlug}
          />
        </div>
      </div>

      {/* Reviews Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Reviews ({reviewCount})</h2>
          <div className="flex gap-2">
            {[
              { value: "newest", label: "Newest" },
              { value: "highest", label: "Highest Rated" },
              { value: "lowest", label: "Lowest Rated" },
            ].map((option) => (
              <Link
                key={option.value}
                href={buildHref(1, option.value)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  sort === option.value
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-border text-muted-foreground hover:border-orange-300"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {reviewCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Star className="h-12 w-12 text-yellow-400" />
            <h3 className="text-lg font-semibold">No reviews yet</h3>
            <p className="text-muted-foreground max-w-xs">
              Be the first to share your thoughts on this product!
            </p>
            <ReviewCTA
              variationId={variation.id}
              isAuthenticated={!!session?.user}
              existingReviewId={undefined}
              brandSlug={brandSlug}
              lineSlug={lineSlug}
              varSlug={varSlug}
              label="Write the First Review"
            />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUserId={session?.user?.id}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={buildHref(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink href={buildHref(p)} isActive={p === currentPage}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={buildHref(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
