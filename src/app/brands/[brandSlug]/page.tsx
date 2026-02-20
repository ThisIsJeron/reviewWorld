import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShoppingBasket, Package } from "lucide-react";
import { getBrandBySlug } from "@/lib/data/brands";
import { getBrandColor } from "@/lib/utils/brandColor";
import { StarRating } from "@/components/shared/StarRating";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageProps {
  params: Promise<{ brandSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);
  if (!brand) {
    return { title: "Brand Not Found | ReviewWorld" };
  }
  return {
    title: `${brand.name} | ReviewWorld`,
    description: `Browse ${brand.name} products and read community reviews on ReviewWorld. ${brand.description?.slice(0, 120) ?? ""}`,
    openGraph: {
      title: `${brand.name} | ReviewWorld`,
      description: brand.description ?? undefined,
      images: brand.logoUrl ? [{ url: brand.logoUrl }] : [],
    },
  };
}

export default async function BrandDetailPage({ params }: PageProps) {
  const { brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const colorClass = getBrandColor(brand.name);
  const initial = brand.name.charAt(0).toUpperCase();

  // Compute aggregate stats
  const allReviews = brand.productLines.flatMap((pl) =>
    pl.variations.flatMap((v) => v.reviews),
  );
  const reviewCount = allReviews.length;
  const avgRating =
    reviewCount > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  // Build product line stats
  const productLinesWithStats = brand.productLines.map((pl) => {
    const lineReviews = pl.variations.flatMap((v) => v.reviews);
    const lineReviewCount = lineReviews.length;
    const lineAvgRating =
      lineReviewCount > 0
        ? lineReviews.reduce((sum, r) => sum + r.rating, 0) / lineReviewCount
        : 0;
    return {
      ...pl,
      reviewCount: lineReviewCount,
      avgRating: lineAvgRating,
      variationCount: pl._count.variations,
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/brands">Brands</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{brand.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Brand Header */}
      <div className="bg-muted/30 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {brand.logoUrl ? (
            <Image
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              width={96}
              height={96}
              className="rounded-xl object-contain border border-border bg-white p-2 flex-shrink-0"
              unoptimized
            />
          ) : (
            <div
              className={`h-16 w-16 sm:h-24 sm:w-24 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-3xl ${colorClass}`}
            >
              {initial}
            </div>
          )}

          <div className="flex flex-col gap-2 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">{brand.name}</h1>
            {reviewCount > 0 && (
              <StarRating rating={avgRating} size="md" count={reviewCount} />
            )}
            {brand.description && (
              <p className="text-base text-muted-foreground leading-relaxed max-w-prose">
                {brand.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Lines */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Product Lines</h2>

        {productLinesWithStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No products listed yet</h3>
            <p className="text-muted-foreground max-w-xs">
              Check back soon — {brand.name}&apos;s products will appear here.
            </p>
            <Button variant="outline" asChild>
              <Link href="/brands">Back to all brands</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productLinesWithStats.map((pl) => (
              <Link key={pl.id} href={`/brands/${brand.slug}/${pl.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative aspect-video w-full">
                    {pl.imageUrl ? (
                      <Image
                        src={pl.imageUrl}
                        alt={pl.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-200 flex items-center justify-center">
                        <ShoppingBasket className="h-10 w-10 text-orange-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-semibold text-base">{pl.name}</h3>
                    {pl.reviewCount > 0 && (
                      <StarRating rating={pl.avgRating} size="sm" count={pl.reviewCount} />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {pl.variationCount}{" "}
                      {pl.variationCount === 1 ? "variation" : "variations"}
                    </p>
                    {pl.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {pl.description}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
