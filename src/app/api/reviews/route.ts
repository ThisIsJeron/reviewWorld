import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  variationId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(120),
  body: z.string().min(10).max(2000),
  wouldBuyAgain: z.boolean(),
});

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

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { variationId, rating, title, body, wouldBuyAgain } = parsed.data;

  // Check variation exists
  const variation = await prisma.variation.findUnique({ where: { id: variationId } });
  if (!variation) {
    return NextResponse.json({ error: "Variation not found" }, { status: 404 });
  }

  // Check for existing review
  const existing = await prisma.review.findUnique({
    where: { userId_variationId: { userId: session.user.id, variationId } },
  });
  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this product" }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      variationId,
      rating,
      title,
      body,
      wouldBuyAgain,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
