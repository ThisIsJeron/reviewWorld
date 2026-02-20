import { prisma } from "@/lib/prisma";
import { cache } from "react";

export interface BrandWithStats {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  productLineCount: number;
  avgRating: number;
  reviewCount: number;
}

export const getBrandsWithStats = cache(
  async ({
    q = "",
    sort = "alpha",
    page = 1,
    perPage = 12,
  }: {
    q?: string;
    sort?: string;
    page?: number;
    perPage?: number;
  }): Promise<{ brands: BrandWithStats[]; total: number }> => {
    const where = {
      status: "APPROVED" as const,
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    };

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        include: {
          _count: { select: { productLines: true } },
          productLines: {
            where: { status: "APPROVED" },
            include: {
              variations: {
                where: { status: "APPROVED" },
                include: {
                  reviews: { select: { rating: true } },
                },
              },
            },
          },
        },
      }),
      prisma.brand.count({ where }),
    ]);

    const withStats: BrandWithStats[] = brands.map((brand) => {
      const allReviews = brand.productLines.flatMap((pl) =>
        pl.variations.flatMap((v) => v.reviews),
      );
      const reviewCount = allReviews.length;
      const avgRating =
        reviewCount > 0
          ? allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
            reviewCount
          : 0;

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        logoUrl: brand.logoUrl,
        productLineCount: brand._count.productLines,
        avgRating,
        reviewCount,
      };
    });

    // Sort
    if (sort === "alpha" || sort === "") {
      withStats.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "alpha-desc") {
      withStats.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "reviews") {
      withStats.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (sort === "rating") {
      withStats.sort((a, b) => b.avgRating - a.avgRating);
    }

    // Paginate
    const start = (page - 1) * perPage;
    const paginated = withStats.slice(start, start + perPage);

    return { brands: paginated, total };
  },
);

export const getBrandBySlug = cache(async (slug: string) => {
  return prisma.brand.findUnique({
    where: { slug, status: "APPROVED" },
    include: {
      productLines: {
        where: { status: "APPROVED" },
        include: {
          _count: { select: { variations: true } },
          variations: {
            where: { status: "APPROVED" },
            include: {
              reviews: { select: { rating: true } },
            },
          },
        },
      },
    },
  });
});
