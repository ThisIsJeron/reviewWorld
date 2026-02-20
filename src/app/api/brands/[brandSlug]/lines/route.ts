import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils/slugify";
import { z } from "zod";

const lineSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ brandSlug: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brandSlug } = await params;

  const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = lineSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, description, imageUrl } = parsed.data;
  const slug = parsed.data.slug ?? slugify(name);

  if (!slug) {
    return NextResponse.json({ error: "Could not generate a valid slug from the name" }, { status: 400 });
  }

  const existing = await prisma.productLine.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A product line with this slug already exists" }, { status: 400 });
  }

  const line = await prisma.productLine.create({
    data: {
      name,
      slug,
      description,
      imageUrl: imageUrl || null,
      brandId: brand.id,
      status: "PENDING",
    },
  });

  return NextResponse.json(line, { status: 201 });
}
