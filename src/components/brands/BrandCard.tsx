import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/shared/StarRating";
import { getBrandColor } from "@/lib/utils/brandColor";
import type { BrandWithStats } from "@/lib/data/brands";

interface BrandCardProps {
  brand: BrandWithStats;
}

export function BrandCard({ brand }: BrandCardProps) {
  const colorClass = getBrandColor(brand.name);
  const initial = brand.name.charAt(0).toUpperCase();

  return (
    <Link href={`/brands/${brand.slug}`}>
      <Card className="flex flex-col gap-3 p-4 h-full hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer">
        <div className="flex items-center gap-3">
          {brand.logoUrl ? (
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                width={48}
                height={48}
                className="rounded-lg object-contain border border-border bg-white p-1"
                unoptimized
              />
            </div>
          ) : (
            <div
              className={`h-12 w-12 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-lg ${colorClass}`}
            >
              {initial}
            </div>
          )}
          <div className="flex flex-col gap-0.5 min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate">{brand.name}</h3>
            {brand.reviewCount > 0 && (
              <StarRating
                rating={brand.avgRating}
                size="sm"
                count={brand.reviewCount}
              />
            )}
          </div>
        </div>

        {brand.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {brand.description}
          </p>
        )}

        <p className="text-sm text-muted-foreground mt-auto">
          {brand.productLineCount}{" "}
          {brand.productLineCount === 1 ? "product line" : "product lines"}
        </p>
      </Card>
    </Link>
  );
}
