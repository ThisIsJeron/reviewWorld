import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function _getProductLine(brandSlug: string, lineSlug: string) {
  return prisma.productLine.findUnique({
    where: { slug: lineSlug, status: "APPROVED" },
    include: {
      brand: { select: { id: true, name: true, slug: true } },
      variations: {
        where: { status: "APPROVED" },
        include: {
          reviews: { select: { rating: true, wouldBuyAgain: true } },
        },
      },
    },
  });
}

export const getProductLine = async (brandSlug: string, lineSlug: string) => {
  const cached = unstable_cache(
    () => _getProductLine(brandSlug, lineSlug),
    ["product-line", brandSlug, lineSlug],
    { revalidate: 300, tags: ["product-lines"] },
  );
  return cached();
};

async function _getVariationBySlug(brandSlug: string, lineSlug: string, varSlug: string) {
  return prisma.variation.findUnique({
    where: { slug: varSlug, status: "APPROVED" },
    include: {
      productLine: {
        include: {
          brand: { select: { id: true, name: true, slug: true } },
        },
      },
      reviews: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export const getVariationBySlug = async (brandSlug: string, lineSlug: string, varSlug: string) => {
  const cached = unstable_cache(
    () => _getVariationBySlug(brandSlug, lineSlug, varSlug),
    ["variation-by-slug", brandSlug, lineSlug, varSlug],
    { revalidate: 300, tags: ["variations"] },
  );
  return cached();
};
