import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const type = req.nextUrl.searchParams.get("type");
  const status = req.nextUrl.searchParams.get("status") ?? "PENDING";

  const [brands, productLines, variations] = await Promise.all([
    !type || type === "brand"
      ? prisma.brand.findMany({
          where: { status: status as "PENDING" | "APPROVED" | "REJECTED" },
          orderBy: { createdAt: "desc" },
        })
      : [],
    !type || type === "productLine"
      ? prisma.productLine.findMany({
          where: { status: status as "PENDING" | "APPROVED" | "REJECTED" },
          include: { brand: { select: { name: true, slug: true } } },
          orderBy: { createdAt: "desc" },
        })
      : [],
    !type || type === "variation"
      ? prisma.variation.findMany({
          where: { status: status as "PENDING" | "APPROVED" | "REJECTED" },
          include: {
            productLine: {
              include: { brand: { select: { name: true, slug: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [],
  ]);

  return NextResponse.json({ brands, productLines, variations });
}
