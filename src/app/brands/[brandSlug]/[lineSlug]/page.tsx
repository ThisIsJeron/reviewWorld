import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Package, ShoppingBasket } from "lucide-react";
import { getProductLine } from "@/lib/data/productLines";
import { StarRating } from "@/components/shared/StarRating";
import { Badge } from "@/components/ui/badge";
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
  params: Promise<{ brandSlug: string; lineSlug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brandSlug, lineSlug } = await params;
  const line = await getProductLine(brandSlug, lineSlug);
  if (!line) return { title: "Product Line Not Found | ReviewWorld" };
  return {
    title: `${line.name} by ${line.brand.name} | ReviewWorld`,
    description: `Browse ${line.name} variations and read community reviews. ${line.description?.slice(0, 100) ?? ""}`,
    openGraph: {
      title: `${line.name} by ${line.brand.name}`,
      images: line.imageUrl ? [{ url: line.imageUrl }] : [],
    },
  };
}

export default async function ProductLinePage({ params, searchParams }: PageProps) {
  const { brandSlug, lineSlug } = await params;
  const { sort = "rating" } = await searchParams;

  const line = await getProductLine(brandSlug, lineSlug);

  if (!line) notFound();

  // Compute stats and sort variations
  const variationsWithStats = line.variations.map((v) => {
    const reviewCount = v.reviews.length;
    const avgRating =
      reviewCount > 0
        ? v.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
          reviewCount
        : 0;
    const wouldBuyAgainPct =
      reviewCount > 0
        ? Math.round(
            (v.reviews.filter((r: { wouldBuyAgain: boolean }) => r.wouldBuyAgain).length /
              reviewCount) *
              100,
          )
        : 0;

    return { ...v, reviewCount, avgRating, wouldBuyAgainPct };
  });

  if (sort === "rating") {
    variationsWithStats.sort((a, b) => b.avgRating - a.avgRating);
  } else if (sort === "reviews") {
    variationsWithStats.sort((a, b) => b.reviewCount - a.reviewCount);
  } else if (sort === "newest") {
    variationsWithStats.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (sort === "alpha") {
    variationsWithStats.sort((a, b) => a.name.localeCompare(b.name));
  }

  function buildSortHref(s: string) {
    return `/brands/${brandSlug}/${lineSlug}?sort=${s}`;
  }

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
            <BreadcrumbLink href={`/brands/${brandSlug}`}>{line.brand.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{line.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Product Line Header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10 items-start">
        <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-[4/3] flex-shrink-0">
          {line.imageUrl ? (
            <Image
              src={line.imageUrl}
              alt={line.name}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 640px) 100vw, 40vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-200 rounded-xl flex items-center justify-center">
              <ShoppingBasket className="h-16 w-16 text-orange-400" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{line.name}</h1>
          <p className="text-base text-muted-foreground">
            by{" "}
            <Link
              href={`/brands/${brandSlug}`}
              className="hover:text-foreground transition-colors"
            >
              {line.brand.name}
            </Link>
          </p>
          {line.description && (
            <p className="text-base leading-relaxed max-w-prose">{line.description}</p>
          )}
        </div>
      </div>

      {/* Variations Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Variations</h2>
          <div className="flex gap-2">
            {[
              { value: "rating", label: "Highest Rated" },
              { value: "reviews", label: "Most Reviewed" },
              { value: "newest", label: "Newest" },
              { value: "alpha", label: "A–Z" },
            ].map((option) => (
              <Link
                key={option.value}
                href={buildSortHref(option.value)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  sort === option.value
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-border text-muted-foreground hover:border-orange-300"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {variationsWithStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No variations listed yet</h3>
            <p className="text-muted-foreground max-w-xs">
              Check back soon — variations will appear here as they&apos;re added.
            </p>
            <Button variant="outline" asChild>
              <Link href={`/brands/${brandSlug}`}>Back to {line.brand.name}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {variationsWithStats.map((v) => {
              const displayImage = v.imageUrl ?? line.imageUrl;
              return (
              <Link
                key={v.id}
                href={`/brands/${brandSlug}/${lineSlug}/${v.slug}`}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                  <div className="relative aspect-video w-full">
                    {displayImage ? (
                      <Image
                        src={displayImage}
                        alt={v.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <ShoppingBasket className="h-8 w-8 text-orange-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <p className="font-semibold">{v.name}</p>
                    {v.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {v.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {v.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{v.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    {v.reviewCount > 0 ? (
                      <>
                        <StarRating rating={v.avgRating} size="sm" count={v.reviewCount} />
                        <Badge
                          className={
                            v.wouldBuyAgainPct >= 70
                              ? "bg-green-100 text-green-700 hover:bg-green-100 w-fit text-xs"
                              : "bg-red-100 text-red-700 hover:bg-red-100 w-fit text-xs"
                          }
                        >
                          {v.wouldBuyAgainPct}% would buy again
                        </Badge>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">No reviews yet</p>
                    )}
                  </div>
                </Card>
              </Link>
            )})}
          </div>
        )}
      </section>
    </div>
  );
}
