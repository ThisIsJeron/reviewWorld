# UX Spec: Variation Detail Page (`/brands/[brandSlug]/[lineSlug]/[varSlug]`)

> Ticket: #13 — UX+FS: Variation/product page with reviews
> Status: UX Complete
> File: `docs/ux/variation-detail.md`

---

## 1. Page Purpose

The core content page of ReviewWorld. Users land here from search, cards, or direct links. Goal: quickly convey product trustworthiness via aggregate rating, then surface individual reviews. The "Write a Review" CTA drives user engagement.

---

## 2. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
├─────────────────────────┤
│  Home > ... > Plain     │  ← Breadcrumb (truncated)
├─────────────────────────┤
│  [Product Image 16:9]   │
│                         │
│  Plain (32oz)           │  ← h1
│  Greek Yogurt · Chobani │  ← line + brand, muted
│  [Strawberry] [Low-Fat] │  ← tag badges
│                         │
│  Creamy, smooth plain   │  ← description
│  yogurt with nothing    │
│  added.                 │
├─────────────────────────┤
│  ★★★★☆  4.3             │  ← RatingSummary block
│  88 reviews             │
│  ████████████ 5★ (42)   │
│  ██████████   4★ (28)   │
│  ████         3★ (10)   │
│  ██           2★ (5)    │
│  █            1★ (3)    │
│  79% would buy again    │
│                         │
│  [Write a Review]       │  ← primary CTA button (full width)
├─────────────────────────┤
│  Reviews (88)           │  ← h2
│  Sort: [Newest ▾]       │
│                         │
│  [ReviewCard]           │
│  [ReviewCard]           │
│  [ReviewCard]           │
│  ...                    │
│  [Load more / Pagination]│
├─────────────────────────┤
│       AppFooter         │
└─────────────────────────┘
```

### Desktop (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search ...]                    [avatar ▾]  │
├─────────────────────────────────────────────────────────────────┤
│  Home > Brands > Chobani > Greek Yogurt > Plain                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────┐  Plain (32oz)                        │
│  │                       │  Greek Yogurt · Chobani              │
│  │   Product Image       │  [Strawberry] [Low-Fat]              │
│  │   (square or 4:3)     │                                     │
│  │                       │  Creamy, smooth plain yogurt with   │
│  └───────────────────────┘  nothing added.                      │
│                                                                 │
│                             ★★★★☆  4.3  (88 reviews)           │
│                             ████████████ 5★ (42)               │
│                             ██████████   4★ (28)               │
│                             ████         3★ (10)               │
│                             ██           2★  (5)               │
│                             █            1★  (3)               │
│                             79% would buy again                 │
│                                                                 │
│                             [Write a Review]                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Reviews (88)                           Sort: [Newest ▾]        │
│                                                                 │
│  [ReviewCard — full width]                                      │
│  [ReviewCard — full width]                                      │
│  [ReviewCard — full width]                                      │
│  ...                                                            │
│                                                                 │
│                  [< Prev]  Page 1 of 9  [Next >]               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Section Specs

### 3.1 Breadcrumb

```
Home > Brands > Chobani > Greek Yogurt > Plain (32oz)
```

- Mobile: `< Greek Yogurt` (back link only)
- All crumbs linked except last (current page)

### 3.2 Variation Header

Two-column on desktop; stacked on mobile.

**Image:**
- Square (1:1) preferred on desktop sidebar; 16:9 full-width on mobile
- `<Image className="rounded-xl object-cover">`
- Placeholder: gradient + `ShoppingBasket` icon

**Name:** `<h1>` — e.g. "Plain (32oz)"

**Context line:** "{Line Name} · {Brand Name}" — both linked
- Line → `/brands/{brandSlug}/{lineSlug}`
- Brand → `/brands/{brandSlug}`
- `text-sm text-muted-foreground`

**Tags:** `<Badge variant="secondary">` pills, horizontal wrap, `gap-1`

**Description:** Full text, `text-base leading-relaxed max-w-prose`

### 3.3 RatingSummary Block

```
★★★★☆  4.3
88 reviews · 79% would buy again

Distribution:
5★  ████████████████░░░░  42  (48%)
4★  ████████████░░░░░░░░  28  (32%)
3★  ████░░░░░░░░░░░░░░░░  10  (11%)
2★  ██░░░░░░░░░░░░░░░░░░   5   (6%)
1★  █░░░░░░░░░░░░░░░░░░░   3   (3%)
```

- Large star display: `StarRating` component, display-only, size `lg`
- Numeric average: `text-4xl font-bold`
- Review count: `text-muted-foreground`
- Distribution bars: colored `bg-orange-400` bars, percentage-width via inline style
- "Would buy again": `WouldBuyBadge` — green pill if ≥ 70%, red if < 70%, gray if < 10 reviews
- `bg-muted/40 rounded-2xl p-5`

### 3.4 Write a Review CTA

**Unauthenticated:**
- Button label: "Sign In to Review"
- Click: triggers `signIn('google', { callbackUrl: '/review/new?variationId={id}' })`
- `<Button size="lg" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">`

**Authenticated, no existing review:**
- Button label: "Write a Review"
- Click: navigate to `/review/new?variationId={id}`

**Authenticated, user has reviewed this variation:**
- Button label: "Edit Your Review"
- Click: navigate to `/review/new?variationId={id}&reviewId={reviewId}`
- Secondary style: `<Button variant="outline" size="lg">`

### 3.5 Reviews Section

**Header:** `<h2>` "Reviews (88)" with sort select right-aligned

**Sort Select:**
- "Newest" (default)
- "Highest Rated"
- "Lowest Rated"
- URL param: `?sort=newest|highest|lowest`

**Pagination:** 10 reviews per page, URL param `?page=N`

**ReviewCard:**

```
┌─────────────────────────────────────────────────────────┐
│  [Avatar 40×40]  Jane D.              Jan 15, 2026      │
│                  ★★★★★                                   │
│                                                         │
│  "Best plain yogurt I've tried"                         │  ← title, font-semibold
│                                                         │
│  The texture is incredibly smooth and it's not too      │
│  sour. I've been buying this for 6 months...            │
│  [Read more]                                            │  ← shown if body > 300 chars
│                                                         │
│  [Yes, would buy again]        [🚩 Report]              │
└─────────────────────────────────────────────────────────┘
```

- Avatar: `<Image>` from user.image (Google), fallback initials circle
- Reviewer name: `<Link href="/profile/{userId}">` in `font-medium`
- Date: `text-sm text-muted-foreground` — formatted as "Jan 15, 2026"
- Stars: `StarRating` display-only, `size="sm"`
- Title: `text-base font-semibold`
- Body: collapsed to 300 chars with "Read more" toggle (`useState`) if longer
- Would Buy Again badge: `<Badge className="bg-green-100 text-green-700">Yes, would buy again</Badge>` or `<Badge className="bg-red-100 text-red-700">Would not buy again</Badge>`
- Report button: flag icon (`Flag` from lucide-react), `text-muted-foreground hover:text-red-500`, text "Report" on desktop, icon-only on mobile
  - Auth-gated: if not signed in, clicking prompts sign-in first
  - Opens `ReportDialog`

### 3.6 ReportDialog

```
┌─────────────────────────────────┐
│  Report this review         [×] │
│                                 │
│  Why are you reporting this?    │
│                                 │
│  ○ Spam or fake review          │
│  ○ Offensive content            │
│  ○ Incorrect product info       │
│  ○ Other                        │
│                                 │
│  [Additional comments...]       │  ← optional textarea
│                                 │
│         [Cancel] [Submit Report]│
└─────────────────────────────────┘
```

- shadcn `<Dialog>` component
- Radio group for reason (required)
- Textarea for additional comments (optional, max 500 chars)
- Submit: `POST /api/reports { reviewId, reason, comment }`
- On success: Dialog closes, toast "Report submitted. Thank you."
- On error: inline error within dialog

---

## 4. Component States

### Loading State

**Header skeleton:**
```
┌──────────────────────────────────────────┐
│ ████████████   ██████████████████████    │
│                ██████████████            │
│                ████████  ████            │
│                ████████████████████      │
└──────────────────────────────────────────┘
```

**RatingSummary skeleton:** 5 bar rows with `<Skeleton>`

**ReviewCard skeleton × 3:**
```
┌────────────────────────────────────────┐
│ ████  ██████████████     ████████      │
│       ██████                           │
│                                        │
│ ████████████████████████████████       │
│ ████████████████████                   │
└────────────────────────────────────────┘
```

### Empty State — No Reviews Yet

```
┌──────────────────────────────────────────────┐
│                                              │
│         [Star icon, 48px, text-yellow-400]   │
│                                              │
│         No reviews yet                       │
│         Be the first to share your           │
│         thoughts on this product!            │
│                                              │
│         [Write the First Review]             │
│                                              │
└──────────────────────────────────────────────┘
```

- CTA button follows same auth logic as main CTA

### 404 State

- `notFound()` in server component
- "Product not found" with back buttons

### Error State

- `ErrorBanner` component, retry button

---

## 5. Responsive Breakpoints

| Element | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---------|--------------|------------------|----------------|
| Page layout | Single column | Single column | Single column |
| Product header | Stacked | Side-by-side | Side-by-side |
| Image | 16:9 full-width | Square, ~40% | Square, ~40% |
| Rating block | Below image | Below info text | Below info text |
| CTA button | Full width | Auto width | Auto width |
| ReviewCard report | Icon only | Icon + "Report" | Icon + "Report" |
| Breadcrumb | Back link only | Full | Full |

---

## 6. SEO / Meta

```tsx
export async function generateMetadata({ params }) {
  const variation = await getVariation(params)
  return {
    title: `${variation.name} Reviews | ReviewWorld`,
    description: `Read ${variation.reviewCount} community reviews for ${variation.name} by ${variation.brand.name}. Average rating: ${variation.avgRating}/5.`,
    openGraph: {
      title: `${variation.name} | ReviewWorld`,
      description: variation.description,
      images: variation.imageUrl ? [{ url: variation.imageUrl }] : [],
    },
  }
}
```

---

## 7. shadcn/ui Components Used

- `Card` — ReviewCard wrapper
- `Badge` — tags, would-buy-again
- `Button` — Write Review CTA, pagination
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter` — ReportDialog
- `RadioGroup`, `RadioGroupItem` — report reason
- `Textarea` — report comment
- `Skeleton` — loading states
- `Breadcrumb` and sub-components
- `Select` — sort control
- `Pagination` and sub-components

---

## 8. Implementation Notes for FS

- Page: `app/brands/[brandSlug]/[lineSlug]/[varSlug]/page.tsx` — Server Component
- Reviews are paginated: fetch first page on server (`page=1, limit=10`), subsequent pages via client or full navigation
- CTA button auth state: check session server-side, pass `hasReviewed` boolean as prop to a thin client component wrapping just the button
- `Read more` toggle on review body: `'use client'` component (`ReviewBodyExpander`) wrapping just the text + button
- Report dialog: `'use client'` component, lazy-loaded (import dynamic)
- Distribution bar widths: `style={{ width: \`${pct}%\` }}` — safe (no user input)
- Aggregate stats: compute in DB query (avg, count, wouldBuyAgainPercent via `_count` + filter)
- `generateMetadata` + page share variation fetch via `cache()`
