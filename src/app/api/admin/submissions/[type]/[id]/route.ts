import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { type, id } = await params;

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { status } = parsed.data;

  try {
    if (type === "brand") {
      const updated = await prisma.brand.update({ where: { id }, data: { status } });
      return NextResponse.json(updated);
    } else if (type === "productLine") {
      const updated = await prisma.productLine.update({ where: { id }, data: { status } });
      return NextResponse.json(updated);
    } else if (type === "variation") {
      const updated = await prisma.variation.update({ where: { id }, data: { status } });
      return NextResponse.json(updated);
    } else {
      return NextResponse.json({ error: "Invalid type. Must be brand, productLine, or variation" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }
}
