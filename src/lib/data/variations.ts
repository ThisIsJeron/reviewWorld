import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

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

async function computeStatsBatch(
  variationIds: string[],
): Promise<Map<string, { avgRating: number; reviewCount: number; wouldBuyAgainPercent: number }>> {
  const defaultStats = { avgRating: 0, reviewCount: 0, wouldBuyAgainPercent: 0 };
  if (variationIds.length === 0) return new Map();

  const reviews = await prisma.review.findMany({
    where: { variationId: { in: variationIds } },
    select: { variationId: true, rating: true, wouldBuyAgain: true },
  });

  const grouped = new Map<string, { ratings: number[]; buyAgainCount: number }>();
  for (const r of reviews) {
    let entry = grouped.get(r.variationId);
    if (!entry) {
      entry = { ratings: [], buyAgainCount: 0 };
      grouped.set(r.variationId, entry);
    }
    entry.ratings.push(r.rating);
    if (r.wouldBuyAgain) entry.buyAgainCount++;
  }

  const result = new Map<string, { avgRating: number; reviewCount: number; wouldBuyAgainPercent: number }>();
  for (const id of variationIds) {
    const entry = grouped.get(id);
    if (!entry || entry.ratings.length === 0) {
      result.set(id, defaultStats);
    } else {
      const avgRating = entry.ratings.reduce((sum, r) => sum + r, 0) / entry.ratings.length;
      const wouldBuyAgainPercent = Math.round((entry.buyAgainCount / entry.ratings.length) * 100);
      result.set(id, { avgRating, reviewCount: entry.ratings.length, wouldBuyAgainPercent });
    }
  }

  return result;
}

async function _getTrendingVariations(limit: number): Promise<VariationWithStats[]> {
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

  const statsMap = await computeStatsBatch(variations.map((v) => v.id));
  const withStats = variations.map((v) => ({ ...v, ...statsMap.get(v.id)! }));

  return withStats;
}

export const getTrendingVariations = async (limit = 6): Promise<VariationWithStats[]> => {
  const cached = unstable_cache(
    () => _getTrendingVariations(limit),
    ["trending-variations", String(limit)],
    { revalidate: 60, tags: ["variations"] },
  );
  return cached();
};

async function _getRecentlyReviewedVariations(limit: number): Promise<VariationWithStats[]> {
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

  const statsMap = await computeStatsBatch(variations.map((v) => v.id));
  const withStats = variations.map((v) => ({ ...v, ...statsMap.get(v.id)! }));

  // Re-order to match the original order
  const ordered = variationIds
    .map((id: string) => withStats.find((v) => v.id === id))
    .filter(Boolean) as VariationWithStats[];

  return ordered;
}

export const getRecentlyReviewedVariations = async (limit = 4): Promise<VariationWithStats[]> => {
  const cached = unstable_cache(
    () => _getRecentlyReviewedVariations(limit),
    ["recently-reviewed-variations", String(limit)],
    { revalidate: 60, tags: ["variations"] },
  );
  return cached();
};
