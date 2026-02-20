import { prisma } from "@/lib/prisma";
import { cache } from "react";

export interface VariationWithStats {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  avgRating: number;
  reviewCount: number;
  wouldBuyAgainPercent: number;
  productLine: {
    name: string;
    slug: string;
    imageUrl: string | null;
    brand: {
      name: string;
      slug: string;
    };
  };
}

async function computeStats(
  variationId: string,
): Promise<{ avgRating: number; reviewCount: number; wouldBuyAgainPercent: number }> {
  const reviews = await prisma.review.findMany({
    where: { variationId },
    select: { rating: true, wouldBuyAgain: true },
  });

  if (reviews.length === 0) {
    return { avgRating: 0, reviewCount: 0, wouldBuyAgainPercent: 0 };
  }

  const avgRating =
    reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length;
  const wouldBuyAgainCount = reviews.filter((r: { wouldBuyAgain: boolean }) => r.wouldBuyAgain).length;
  const wouldBuyAgainPercent = Math.round((wouldBuyAgainCount / reviews.length) * 100);

  return { avgRating, reviewCount: reviews.length, wouldBuyAgainPercent };
}

export const getTrendingVariations = cache(async (limit = 6): Promise<VariationWithStats[]> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get variations with most reviews in the last 30 days (only APPROVED variations)
  const topVariationIds = await prisma.review.groupBy({
    by: ["variationId"],
    where: {
      createdAt: { gte: thirtyDaysAgo },
      variation: { status: "APPROVED" },
    },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  // Fall back to all-time if no recent reviews
  const variationIds =
    topVariationIds.length > 0
      ? topVariationIds.map((v: { variationId: string }) => v.variationId)
      : await prisma.review
          .groupBy({
            by: ["variationId"],
            where: { variation: { status: "APPROVED" } },
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: limit,
          })
          .then((groups: Array<{ variationId: string }>) => groups.map((g) => g.variationId));

  if (variationIds.length === 0) return [];

  const variations = await prisma.variation.findMany({
    where: { id: { in: variationIds }, status: "APPROVED" },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      productLine: {
        select: {
          name: true,
          slug: true,
          imageUrl: true,
          brand: { select: { name: true, slug: true } },
        },
      },
    },
  });

  const withStats = await Promise.all(
    variations.map(async (v) => {
      const stats = await computeStats(v.id);
      return { ...v, ...stats };
    }),
  );

  return withStats;
});

export const getRecentlyReviewedVariations = cache(
  async (limit = 4): Promise<VariationWithStats[]> => {
    const recentReviews = await prisma.review.findMany({
      distinct: ["variationId"],
      orderBy: { createdAt: "desc" },
      take: limit,
      where: { variation: { status: "APPROVED" } },
      select: { variationId: true },
    });

    if (recentReviews.length === 0) return [];

    const variationIds = recentReviews.map((r: { variationId: string }) => r.variationId);

    const variations = await prisma.variation.findMany({
      where: { id: { in: variationIds }, status: "APPROVED" },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        productLine: {
          select: {
            name: true,
            slug: true,
            brand: { select: { name: true, slug: true } },
          },
        },
      },
    });

    const withStats = await Promise.all(
      variations.map(async (v) => {
        const stats = await computeStats(v.id);
        return { ...v, ...stats };
      }),
    );

    // Re-order to match the original order
    const ordered = variationIds
      .map((id: string) => withStats.find((v) => v.id === id))
      .filter(Boolean) as VariationWithStats[];

    return ordered;
  },
);
