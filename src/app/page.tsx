import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { auth } from "@/lib/auth";
import { SearchBar } from "@/components/layout/SearchBar";
import { VariationCard } from "@/components/shared/VariationCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Button } from "@/components/ui/button";
import { getTrendingVariations, getRecentlyReviewedVariations } from "@/lib/data/variations";

export const metadata: Metadata = {
  title: "ReviewWorld — Community Reviews for Food Products",
  description:
    "Discover and review food products. Real opinions from real people on yogurt, snacks, beverages, and more.",
  openGraph: {
    title: "ReviewWorld",
    description: "Community food product reviews",
    type: "website",
  },
};

export default async function HomePage() {
  const [session, trending, recentlyReviewed] = await Promise.all([
    auth(),
    getTrendingVariations(6),
    getRecentlyReviewedVariations(4),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-orange-500 py-16 px-4 md:py-24 md:px-8">
        <div className="container mx-auto flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl font-bold text-white md:text-6xl">ReviewWorld</h1>
          <p className="text-xl text-orange-100 max-w-xl">
            The community review platform for food products.
          </p>
          <SearchBar variant="hero" autoFocus />
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 flex flex-col gap-12">
        {/* Trending This Month */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trending This Month</h2>
            <Link href="/brands" className="text-sm text-orange-500 hover:underline font-medium">
              See all →
            </Link>
          </div>

          {trending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <ShoppingBasket className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Nothing here yet!</h3>
              <p className="text-muted-foreground max-w-xs">
                Be the first to review a food product.
              </p>
              <Button asChild>
                <Link href="/brands">Browse Brands</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.map((variation) => (
                <VariationCard key={variation.id} variation={variation} />
              ))}
            </div>
          )}
        </section>

        {/* Recently Reviewed */}
        {recentlyReviewed.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recently Reviewed</h2>
              <Link href="/brands" className="text-sm text-orange-500 hover:underline font-medium">
                See all →
              </Link>
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory lg:hidden">
              {recentlyReviewed.map((variation) => (
                <div key={variation.id} className="snap-start min-w-[260px]">
                  <VariationCard variation={variation} />
                </div>
              ))}
            </div>

            {/* Desktop: 4-col grid */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {recentlyReviewed.map((variation) => (
                <VariationCard key={variation.id} variation={variation} />
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner — unauthenticated only */}
        {!session && (
          <section className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-base text-foreground font-medium">
                Join ReviewWorld — sign in to share your opinion on the foods you love.
              </p>
              <Button size="lg" asChild>
                <Link href="/api/auth/signin">Sign In with Google</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Loading skeleton placeholder exported for Suspense fallback usage
export function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
