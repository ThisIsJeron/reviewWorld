"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function BrandFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "alpha";

  const update = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      // Reset to page 1 on filter/sort change
      params.delete("page");
      startTransition(() => {
        router.push(`/brands?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  let debounceTimer: ReturnType<typeof setTimeout>;

  function handleSearchChange(value: string) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      update({ q: value });
    }, 200);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          defaultValue={q}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Filter brands by name..."
          className="pl-9 pr-9"
        />
        {q && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => update({ q: null })}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <Select value={sort} onValueChange={(value) => update({ sort: value })}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alpha">Alphabetical (A–Z)</SelectItem>
          <SelectItem value="alpha-desc">Alphabetical (Z–A)</SelectItem>
          <SelectItem value="reviews">Most Reviewed</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
