import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/shared/SkeletonCard";

export default function BrandDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-4 w-48 mb-6" />

      {/* Brand header skeleton */}
      <div className="bg-muted/30 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Skeleton className="h-24 w-24 rounded-xl flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      <Skeleton className="h-7 w-40 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
