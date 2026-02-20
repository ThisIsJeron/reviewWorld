# UX Spec: Product Line Page (`/brands/[brandSlug]/[lineSlug]`)

> Ticket: #12 — UX+FS: Product line page
> Status: UX Complete
> File: `docs/ux/product-line.md`

---

## 1. Page Purpose

Mid-level browse page. Shows all variations (flavors, sizes, formats) within a product line, enabling users to drill down to the specific variation they want to review or read reviews for.

---

## 2. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │  ← AppHeader (sticky)
│  [Search ...]           │
├─────────────────────────┤
│  Home > Brands >        │  ← Breadcrumb (truncated to "< Greek Yogurt")
│  Chobani > Greek Yogurt │
├─────────────────────────┤
│  [Line Image — 16:9]    │  ← full-width image
│                         │
│  Greek Yogurt           │  ← h1
│  by Chobani             │  ← brand link, text-muted-foreground
│                         │
│  Creamy, protein-packed │  ← description, full text
│  yogurt in multiple...  │
├─────────────────────────┤
│  Variations             │  ← h2
│  Sort: [Highest Rated ▾]│
│                         │
│  [VariationCard]        │  ← 1-col stack
│  [VariationCard]        │
│  [VariationCard]        │
├─────────────────────────┤
│       AppFooter         │
└─────────────────────────┘
```

### Desktop (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search products, brands...]    [Sign In ▾] │
├─────────────────────────────────────────────────────────────────┤
│  Home > Brands > Chobani > Greek Yogurt                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────┐  Greek Yogurt                       │
│  │                        │  by Chobani           ← h1 + brand │
│  │   Line Image (4:3)     │                                     │
│  │                        │  Creamy, protein-packed yogurt in   │
│  └────────────────────────┘  multiple flavors for everyday...   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Variations                             Sort: [Highest Rated ▾] │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │VariationCard │ │VariationCard │ │VariationCard │  ← 3-col  │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│  ┌──────────────┐ ┌──────────────┐                             │
│  │VariationCard │ │VariationCard │                             │
│  └──────────────┘ └──────────────┘                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          AppFooter                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Section Specs

### 3.1 Breadcrumb

```
Home > Brands > Chobani > Greek Yogurt
```

- "Chobani" links to `/brands/chobani`
- "Greek Yogurt" is current page (`aria-current="page"`)
- Mobile: collapses to `< Chobani` (back link only)

### 3.2 Product Line Header

Two-column layout on desktop (image left ~40%, info right ~60%); stacked on mobile.

**Image:**
- Aspect ratio 4:3 on desktop sidebar, 16:9 full-width on mobile
- `<Image className="rounded-xl object-cover">`
- Placeholder: `bg-gradient-to-br from-orange-50 to-orange-200` with `ShoppingBasket` icon centered

**Line Name:**
- `<h1 className="text-3xl font-bold">` (desktop), `text-2xl` (mobile)

**Brand Byline:**
- "by [Brand Name]" — `<Link href="/brands/{brandSlug}">` in `text-muted-foreground text-base`

**Description:**
- Full text, `text-base leading-relaxed`
- `max-w-prose` on desktop

### 3.3 Variations Section

**Header row:** `<h2>` "Variations" (left) + Sort select (right), `flex items-center justify-between`

**Sort Select (shadcn `<Select>`):**
- "Highest Rated" (default)
- "Most Reviewed"
- "Newest"
- "A–Z"
- URL param: `?sort=rating|reviews|newest|alpha`

**Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`

**VariationCard (on this page):**

```
┌──────────────────────────────────┐
│  [Image — 4:3]                   │
├──────────────────────────────────┤
│  Plain (32oz)                    │  ← variation name, font-semibold
│  [Strawberry] [Low-Fat]          │  ← tag badges (pill, orange-100)
│  ★★★★☆ 4.3  (88 reviews)        │  ← TrustBar
│  79% would buy again             │  ← WouldBuyBadge
└──────────────────────────────────┘
```

- Entire card is `<Link href="/brands/{brandSlug}/{lineSlug}/{varSlug}">`
- Tags rendered as `<Badge variant="secondary">` pills, max 3 shown + "+N more" if overflow
- No description shown (save space for scanning multiple variations)
- Hover: `hover:shadow-md transition-shadow`

---

## 4. Component States

### Loading State

```
SkeletonCard × 6 in 3-col grid:
┌──────────────────────┐
│  ████████████████    │  ← image placeholder
│  ██████████████      │  ← name
│  ██████  ████        │  ← badges
│  ████████████        │  ← rating
└──────────────────────┘
```

### Empty State — No Variations

```
┌────────────────────────────────────────┐
│                                        │
│         [Package icon, 48px]           │
│                                        │
│         No variations listed yet       │
│         Check back soon — variations   │
│         will appear here as they're    │
│         added.                         │
│                                        │
│         [← Back to Chobani]            │
│                                        │
└────────────────────────────────────────┘
```

- Brand name interpolated into back link text
- Back link → `/brands/{brandSlug}`

### 404 State

- `notFound()` → `app/not-found.tsx`
- Message: "Product line not found"
- Buttons: "Back to [Brand]" + "Browse all brands"

### Error State

- `ErrorBanner` below section heading
- "Could not load variations. Try refreshing."

---

## 5. Responsive Breakpoints

| Element | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---------|--------------|------------------|----------------|
| Header layout | Stacked | Side-by-side | Side-by-side |
| Image | 16:9, full width | 4:3, ~40% width | 4:3, ~40% width |
| Variations grid | 1 col | 2 col | 3 col |
| Sort select | Full width below "Variations" heading | Right-aligned inline | Right-aligned inline |

---

## 6. SEO / Meta

```tsx
export async function generateMetadata({ params }) {
  const line = await getProductLine(params.brandSlug, params.lineSlug)
  return {
    title: `${line.name} by ${line.brand.name} | ReviewWorld`,
    description: `Browse ${line.name} variations and read community reviews. ${line.description?.slice(0, 100)}`,
    openGraph: {
      title: `${line.name} by ${line.brand.name}`,
      images: line.imageUrl ? [{ url: line.imageUrl }] : [],
    },
  }
}
```

---

## 7. shadcn/ui Components Used

- `Card` — VariationCard wrapper
- `Badge` — tag pills on variation cards
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` — sort control
- `Skeleton` — loading states
- `Breadcrumb` and sub-components
- `Button` — empty state CTA

---

## 8. Implementation Notes for FS

- Page: `app/brands/[brandSlug]/[lineSlug]/page.tsx` — Server Component
- Sort via URL `searchParams.sort` — pass to DB query `orderBy`
- `notFound()` when line query returns null
- Tags: stored as `String[]` on Variation model (Prisma `String[]` / JSON array)
- `generateMetadata` and page component share the same fetch — wrap in `cache()`
- VariationCard: pure Server Component, no client interactivity needed
