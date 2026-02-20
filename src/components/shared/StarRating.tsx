import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  count?: number;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
  count,
}: StarRatingProps) {
  const sizeMap = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const px = sizeMap[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              width={px}
              height={px}
              className={filled ? "fill-orange-400 text-orange-400" : "fill-muted text-muted"}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
