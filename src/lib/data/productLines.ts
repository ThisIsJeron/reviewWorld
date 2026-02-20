import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getProductLine = cache(
  async (brandSlug: string, lineSlug: string) => {
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
  },
);

export const getVariationBySlug = cache(
  async (brandSlug: string, lineSlug: string, varSlug: string) => {
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
  },
);
