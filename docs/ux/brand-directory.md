# UX Spec: Brand Directory Page (`/brands`)

> Ticket: #10 — UX+FS: Brand directory page (/brands)
> Status: UX Complete
> File: `docs/ux/brand-directory.md`

---

## 1. Page Purpose

Comprehensive, browsable list of all brands on the platform. Serves users who know a brand they want to explore, as well as users discovering new brands by browsing.

---

## 2. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │  ← AppHeader (sticky)
│  [Search ...]           │
├─────────────────────────┤
│  Home > Brands          │  ← Breadcrumb
├─────────────────────────┤
│  All Brands             │  ← h1
│                         │
│  [🔍 Filter brands...]  │  ← filter input (full width)
│  Sort: [Alphabetical ▾] │  ← SortSelect (right-aligned)
├─────────────────────────┤
│  [BrandCard]            │  ← 1-col stack
│  [BrandCard]            │
│  [BrandCard]            │
│  ...                    │
├─────────────────────────┤
│  [< Prev]  1 / 4  [Next >] │ ← Pagination
├─────────────────────────┤
│       AppFooter         │
└─────────────────────────┘
```

### Desktop (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search products, brands...]    [Sign In ▾] │
├─────────────────────────────────────────────────────────────────┤
│  Home > Brands                                                  │
├─────────────────────────────────────────────────────────────────┤
│  All Brands                                                     │
│                                                                 │
│  ┌──────────────────────────────────┐  Sort: [Alphabetical ▾]  │
│  │ 🔍  Filter brands by name...    │                           │
│  └──────────────────────────────────┘                           │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  BrandCard   │ │  BrandCard   │ │  BrandCard   │  ← 3-col  │
│  └──────────────┘ └──────────────┘ └──────────────┘
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  │  BrandCard   │ │  BrandCard   │ │  BrandCard   │
│  └──────────────┘ └──────────────┘ └──────────────┘
│  ... (12 per page)                                              │
│                                                                 │
│                  [< Prev]  Page 1 of 4  [Next >]               │
├─────────────────────────────────────────────────────────────────┤
│                          AppFooter                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Section Specs

### 3.1 Page Header

- `<h1>` "All Brands" — `text-3xl font-bold`
- Breadcrumb above the heading: `Home > Brands`
  - "Home" links to `/`
  - "Brands" is current page (non-linked, `aria-current="page"`)

### 3.2 Filter + Sort Bar

Layout: filter input (flex-1) + sort select (auto width), on same row on desktop; stacked on mobile.

**Filter Input:**
- Placeholder: "Filter brands by name..."
- `<Input>` with `Search` icon (lucide) on left
- Behavior: client-side filter against already-loaded brand list (if all brands fit in one page), OR server-side search param (`?q=`) for large datasets
- Debounce: 200ms
- Clear button (×) appears when input has value
- Filtering resets to page 1

**Sort Select (shadcn `<Select>`):**
- Options:
  - "Alphabetical (A–Z)" — default
  - "Alphabetical (Z–A)"
  - "Most Reviewed"
  - "Highest Rated"
- Changing sort resets to page 1
- Implemented as a URL search param (`?sort=alpha|alpha-desc|reviews|rating`) for shareability + SSR

### 3.3 Brand Card Grid

- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- 12 cards per page

**BrandCard:**

```
┌──────────────────────────────────┐
│  ┌──────┐                        │
│  │ Logo │  Chobani               │  ← logo (48×48, rounded), brand name h3
│  └──────┘  ★★★★☆ 4.1 (523)      │  ← StarRating + total review count
│                                  │
│  Greek yogurt and dairy products │  ← description, 2-line clamp
│  for everyday wellness.          │    (line-clamp-2)
│                                  │
│  12 product lines                │  ← text-sm text-muted-foreground
└──────────────────────────────────┘
```

- Entire card is a `<Link href="/brands/{slug}">` — no nested button
- Hover: `hover:shadow-lg hover:border-orange-300 transition-all`
- Logo placeholder: colored circle with brand initial when no `logoUrl`
  - Background color derived from brand name hash (deterministic) — use one of 8 preset Tailwind bg colors
- `<Card className="flex flex-col gap-3 p-4 h-full">`
- Description: `text-sm text-muted-foreground line-clamp-2`
- Product line count: always show even if 0 ("0 product lines")

### 3.4 Pagination

- shadcn `Pagination` component
- Show: Previous / page numbers / Next
- Show up to 5 page number buttons; ellipsis for large page counts
- Current page highlighted
- URL param: `?page=2` — enables direct linking and back-button support
- "12 brands per page" — 24 option future enhancement

---

## 4. Component States

### Loading State

Server-renders page with data (SSR). If client-side navigation: show skeleton grid.

```
SkeletonBrandCard × 12 (same 3-col grid):
┌──────────────────────────────────┐
│  ████  ████████████████          │  ← logo skeleton + name skeleton
│        ██████████                │  ← rating skeleton
│                                  │
│  ██████████████████████████      │  ← description line 1
│  ████████████                    │  ← description line 2
│                                  │
│  ██████████                      │  ← line count skeleton
└──────────────────────────────────┘
```

### Empty State — No Brands Exist

```
┌────────────────────────────────────────┐
│                                        │
│         [ShoppingBasket icon, 48px]    │
│                                        │
│         No brands yet                  │
│         Check back soon — we're        │
│         adding brands all the time.    │
│                                        │
└────────────────────────────────────────┘
```

- Centered, `py-24`
- No pagination shown

### Empty State — No Search Results

```
┌────────────────────────────────────────┐
│                                        │
│         [Search icon, 48px]            │
│                                        │
│         No brands match "oatly"        │
│         Try a different search term.   │
│                                        │
│         [Clear search]                 │
│                                        │
└────────────────────────────────────────┘
```

- "Clear search" button resets filter input and shows all brands
- Brand name in message uses the actual query value

### Error State

```
┌────────────────────────────────────────┐
│  Could not load brands.                │
│  Please try refreshing the page.       │
│  [Refresh]                             │
└────────────────────────────────────────┘
```

- `bg-red-50 border border-red-200 rounded-lg p-4`

---

## 5. Responsive Breakpoints Summary

| Element | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---------|--------------|------------------|----------------|
| Brand card grid | 1 col | 2 col | 3 col |
| Filter + sort | Stacked (filter on top, sort below) | Inline | Inline |
| Breadcrumb | Shown | Shown | Shown |
| Pagination | Compact (Prev / page# / Next only) | Full | Full |

---

## 6. SEO / Meta

```tsx
export const metadata = {
  title: 'Brands | ReviewWorld',
  description: 'Browse all food and beverage brands on ReviewWorld. Find ratings, product lines, and community reviews.',
}
```

- Page is SSR — brand list is indexed by search engines
- Each BrandCard's link is a standard `<a>` tag (crawlable)

---

## 7. URL State

All filter/sort/pagination state lives in URL search params for shareability:

| Param | Values | Default |
|-------|--------|---------|
| `?q=` | filter string | (empty) |
| `?sort=` | `alpha` \| `alpha-desc` \| `reviews` \| `rating` | `alpha` |
| `?page=` | integer ≥ 1 | `1` |

---

## 8. shadcn/ui Components Used

- `Card` — BrandCard wrapper
- `Input` — filter input
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` — sort dropdown
- `Skeleton` — loading states
- `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationNext`, `PaginationPrevious` — pagination
- `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`

---

## 9. Implementation Notes for FS

- Page: `app/brands/page.tsx` — Server Component
- Read `searchParams` (q, sort, page) on the server and fetch filtered/sorted data from DB
- `BrandCard` can be a pure Server Component (no interactivity)
- Filter input: if client-side, extract into a `'use client'` `BrandFilter` component that updates URL params via `useRouter().push()` without full page reload
- Logo image: use `next/image` with `width={48} height={48}` and a fallback div
- Brand initial color: utility function `getBrandColor(name: string): string` returning a Tailwind class
