"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  brands: Array<{ id: string; name: string; slug: string }>;
  variations: Array<{
    id: string;
    name: string;
    slug: string;
    productLine: {
      slug: string;
      brand: { slug: string };
    };
  }>;
}

interface SearchBarProps {
  variant?: "hero" | "header";
  autoFocus?: boolean;
}

export function SearchBar({ variant = "header", autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
      if (res.ok) {
        const data = await res.json() as SearchResult;
        setResults(data);
        setIsOpen(true);
        setSelectedIndex(-1);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const allItems = [
    ...(results?.brands ?? []).map((b) => ({
      type: "brand" as const,
      label: b.name,
      href: `/brands/${b.slug}`,
    })),
    ...(results?.variations ?? []).map((v) => ({
      type: "variation" as const,
      label: v.name,
      href: `/brands/${v.productLine.brand.slug}/${v.productLine.slug}/${v.slug}`,
    })),
  ];

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const item = allItems[selectedIndex];
      if (item) {
        setIsOpen(false);
        router.push(item.href);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={cn("relative", isHero ? "w-full max-w-[600px]" : "flex-1")}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "flex items-center gap-2 bg-white border border-input",
            isHero ? "h-14 rounded-full px-5 shadow-lg" : "h-10 rounded-lg px-3",
          )}
        >
          <Search
            className="text-muted-foreground flex-shrink-0"
            size={isHero ? 20 : 16}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setIsOpen(true)}
            placeholder={isHero ? "Search products or brands..." : "Search..."}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults(null);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
          {isHero && (
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Search
            </button>
          )}
        </div>
      </form>

      {isOpen && results && allItems.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.brands.length > 0 && (
            <div>
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                Brands
              </p>
              {results.brands.slice(0, 3).map((brand, i) => (
                <button
                  key={brand.id}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-muted",
                    selectedIndex === i && "bg-muted",
                  )}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/brands/${brand.slug}`);
                  }}
                >
                  <span>🏷</span> {brand.name}
                </button>
              ))}
            </div>
          )}
          {results.variations.length > 0 && (
            <div>
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                Products
              </p>
              {results.variations.slice(0, 5).map((variation, i) => {
                const idx = results.brands.slice(0, 3).length + i;
                return (
                  <button
                    key={variation.id}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-muted",
                      selectedIndex === idx && "bg-muted",
                    )}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(
                        `/brands/${variation.productLine.brand.slug}/${variation.productLine.slug}/${variation.slug}`,
                      );
                    }}
                  >
                    <span>🥛</span> {variation.name}
                  </button>
                );
              })}
            </div>
          )}
          <div className="border-t">
            <button
              className="w-full text-left px-4 py-2 text-sm text-orange-500 hover:bg-muted font-medium"
              onClick={handleSubmit as unknown as React.MouseEventHandler}
            >
              See all results for &ldquo;{query}&rdquo; →
            </button>
          </div>
        </div>
      )}

      {isOpen && results && allItems.length === 0 && !isLoading && query && (
        <div className="absolute top-full mt-2 w-full bg-white border border-border rounded-xl shadow-lg z-50 p-4 text-sm text-muted-foreground">
          No results for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
