import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "8");

  if (!q.trim()) {
    return NextResponse.json({ brands: [], variations: [] });
  }

  const [brands, variations] = await Promise.all([
    prisma.brand.findMany({
      where: {
        status: "APPROVED",
        name: { contains: q, mode: "insensitive" },
      },
      take: 3,
      select: { id: true, name: true, slug: true },
    }),
    prisma.variation.findMany({
      where: {
        status: "APPROVED",
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { productLine: { name: { contains: q, mode: "insensitive" } } },
          { productLine: { brand: { name: { contains: q, mode: "insensitive" } } } },
        ],
      },
      take: Math.min(limit, 5),
      select: {
        id: true,
        name: true,
        slug: true,
        productLine: {
          select: {
            slug: true,
            brand: { select: { slug: true } },
          },
        },
      },
    }),
  ]);

  return NextResponse.json({ brands, variations });
}
