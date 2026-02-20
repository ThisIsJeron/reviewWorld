import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils/slugify";
import { z } from "zod";

const brandSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const sort = req.nextUrl.searchParams.get("sort") ?? "alpha";
  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1") || 1;
  const perPage = 12;

  const where = {
    status: "APPROVED" as const,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [brands, total] = await Promise.all([
    prisma.brand.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        _count: { select: { productLines: true } },
      },
      orderBy:
        sort === "alpha-desc"
          ? { name: "desc" }
          : { name: "asc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.brand.count({ where }),
  ]);

  return NextResponse.json({ brands, total, page, perPage });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = brandSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, description, logoUrl } = parsed.data;
  const slug = parsed.data.slug ?? slugify(name);

  if (!slug) {
    return NextResponse.json({ error: "Could not generate a valid slug from the name" }, { status: 400 });
  }

  const existing = await prisma.brand.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A brand with this slug already exists" }, { status: 400 });
  }

  const brand = await prisma.brand.create({
    data: {
      name,
      slug,
      description,
      logoUrl: logoUrl || null,
      status: "PENDING",
    },
  });

  return NextResponse.json(brand, { status: 201 });
}
