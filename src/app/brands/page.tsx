import type { Metadata } from "next";
import Link from "next/link";
import { Search, ShoppingBasket } from "lucide-react";
import { getBrandsWithStats } from "@/lib/data/brands";
import { BrandCard } from "@/components/brands/BrandCard";
import { BrandFilter } from "@/components/brands/BrandFilter";
import { SkeletonBrandCard } from "@/components/shared/SkeletonCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Brands | ReviewWorld",
  description:
    "Browse all food and beverage brands on ReviewWorld. Find ratings, product lines, and community reviews.",
};

const PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ q?: string; sort?: string; page?: string }>;
}

async function BrandGrid({
  q,
  sort,
  page,
}: {
  q: string;
  sort: string;
  page: number;
}) {
  const { brands, total } = await getBrandsWithStats({ q, sort, page, perPage: PER_PAGE });
  const totalPages = Math.ceil(total / PER_PAGE);

  if (total === 0 && !q) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <ShoppingBasket className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No brands yet</h3>
        <p className="text-muted-foreground">Check back soon — we're adding brands all the time.</p>
      </div>
    );
  }

  if (brands.length === 0 && q) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Search className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No brands match &ldquo;{q}&rdquo;</h3>
        <p className="text-muted-foreground">Try a different search term.</p>
        <Button variant="outline" asChild>
          <Link href="/brands">Clear search</Link>
        </Button>
      </div>
    );
  }

  function buildHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sort && sort !== "alpha") params.set("sort", sort);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/brands${qs ? `?${qs}` : ""}`;
  }

  const pageNumbers = getPaginationPages(page, totalPages);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={buildHref(page - 1)} />
                </PaginationItem>
              )}
              {pageNumbers.map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink href={buildHref(p as number)} isActive={p === page}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={buildHref(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}

function getPaginationPages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export default async function BrandsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? "";
  const sort = params.sort ?? "alpha";
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Brands</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">All Brands</h1>

      <BrandFilter />

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonBrandCard key={i} />
            ))}
          </div>
        }
      >
        <BrandGrid q={q} sort={sort} page={page} />
      </Suspense>
    </div>
  );
}
