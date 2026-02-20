import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/StarRating";

interface VariationCardProps {
  variation: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    avgRating: number;
    reviewCount: number;
    wouldBuyAgainPercent: number;
    productLine: {
      name: string;
      slug: string;
      imageUrl: string | null;
      brand: {
        name: string;
        slug: string;
      };
    };
  };
  className?: string;
}

export function VariationCard({ variation, className }: VariationCardProps) {
  const href = `/brands/${variation.productLine.brand.slug}/${variation.productLine.slug}/${variation.slug}`;
  const displayImage = variation.imageUrl ?? variation.productLine.imageUrl;

  return (
    <Link href={href} aria-label={`${variation.name} by ${variation.productLine.brand.name}`}>
      <Card
        className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full ${className ?? ""}`}
      >
        <div className="relative aspect-video w-full">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={variation.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <span className="text-orange-400 text-3xl">🛒</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{variation.productLine.brand.name}</p>
          <p className="text-base font-semibold leading-tight">{variation.name}</p>
          <p className="text-sm text-muted-foreground">{variation.productLine.name}</p>
          {variation.reviewCount > 0 ? (
            <>
              <StarRating
                rating={variation.avgRating}
                size="sm"
                count={variation.reviewCount}
              />
              <Badge
                variant={variation.wouldBuyAgainPercent >= 70 ? "default" : "destructive"}
                className="w-fit text-xs"
              >
                {variation.wouldBuyAgainPercent}% would buy again
              </Badge>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">No reviews yet</p>
          )}
          <p className="text-sm text-orange-500 mt-1 font-medium">View Product →</p>
        </div>
      </Card>
    </Link>
  );
}
