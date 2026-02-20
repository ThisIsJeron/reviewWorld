import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BrandNotFound() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <SearchX className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Brand not found</h1>
        <p className="text-muted-foreground max-w-sm">
          We couldn&apos;t find a brand at this address.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/brands">Browse all brands</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
