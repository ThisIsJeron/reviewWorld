import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getBrandColor } from "@/lib/utils/brandColor";
import { StarRating } from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

const REVIEWS_PER_PAGE = 10;

const getUser = cache(async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { reviews: true } },
    },
  });
});

interface PageProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUser(userId);
  if (!user) return { title: "User Not Found | ReviewWorld" };
  return {
    title: `${user.name ?? "User"}'s Reviews | ReviewWorld`,
    description: `Read ${user.name ?? "this user"}'s food product reviews on ReviewWorld. ${user._count.reviews} reviews written.`,
  };
}

export default async function ProfilePage({ params, searchParams }: PageProps) {
  const { userId } = await params;
  const { page: pageStr = "1" } = await searchParams;

  const user = await getUser(userId);
  if (!user) notFound();

  const currentPage = Math.max(1, parseInt(pageStr) || 1);
  const totalReviews = user._count.reviews;
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      variation: {
        include: {
          productLine: {
            include: {
              brand: { select: { name: true, slug: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * REVIEWS_PER_PAGE,
    take: REVIEWS_PER_PAGE,
  });

  const colorClass = getBrandColor(user.name ?? user.email);
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstName = user.name?.split(" ")[0] ?? "This user";

  function buildPageHref(p: number) {
    return `/profile/${userId}${p > 1 ? `?page=${p}` : ""}`;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{user.name ?? "User"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Profile Header */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="flex-shrink-0">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "User"}
                width={96}
                height={96}
                className="rounded-full object-cover ring-2 ring-border"
                unoptimized
              />
            ) : (
              <div
                className={`h-18 w-18 sm:h-24 sm:w-24 rounded-full flex items-center justify-center text-white font-bold text-2xl ring-2 ring-border ${colorClass}`}
              >
                {initials}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{user.name ?? "Anonymous User"}</h1>
            <p className="text-sm text-muted-foreground">Member since {memberSince}</p>
            <p className="text-sm text-muted-foreground">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"} written
            </p>
          </div>
        </div>
      </Card>

      {/* Reviews Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Reviews ({totalReviews})</h2>

        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Star className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No reviews yet</h3>
            <p className="text-muted-foreground">
              {firstName} hasn&apos;t reviewed any products yet.
            </p>
            <Button asChild>
              <Link href="/">Browse products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review) => {
                const v = review.variation;
                const pl = v.productLine;
                const brand = pl.brand;
                const varUrl = `/brands/${brand.slug}/${pl.slug}/${v.slug}`;
                const date = new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                const isLong = review.body.length > 300;
                const displayBody = isLong ? review.body.slice(0, 300) + "..." : review.body;

                return (
                  <Card key={review.id} className="p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <StarRating rating={review.rating} size="sm" showValue={false} />
                      <span className="text-sm text-muted-foreground">{date}</span>
                    </div>
                    <h3 className="font-semibold text-base mb-2">{review.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {displayBody}
                    </p>
                    {isLong && (
                      <Link href={varUrl} className="text-sm text-orange-500 hover:underline mb-3 block">
                        Read full review →
                      </Link>
                    )}
                    <Badge
                      className={
                        review.wouldBuyAgain
                          ? "bg-green-100 text-green-700 hover:bg-green-100 mb-3"
                          : "bg-red-100 text-red-700 hover:bg-red-100 mb-3"
                      }
                    >
                      {review.wouldBuyAgain ? "Yes, would buy again" : "Would not buy again"}
                    </Badge>
                    <p className="text-sm">
                      <Link href={varUrl} className="hover:underline text-orange-500 font-medium">
                        {v.name}
                      </Link>{" "}
                      &middot;{" "}
                      <Link
                        href={`/brands/${brand.slug}/${pl.slug}`}
                        className="hover:underline text-muted-foreground"
                      >
                        {pl.name}
                      </Link>{" "}
                      &middot;{" "}
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="hover:underline text-muted-foreground"
                      >
                        {brand.name}
                      </Link>
                    </p>
                  </Card>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={buildPageHref(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink href={buildPageHref(p)} isActive={p === currentPage}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={buildPageHref(currentPage + 1)} />
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
