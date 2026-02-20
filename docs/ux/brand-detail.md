# UX Spec: Brand Detail Page (`/brands/[brandSlug]`)

> Ticket: #11 — UX+FS: Brand detail page (/brands/[brandSlug])
> Status: UX Complete
> File: `docs/ux/brand-detail.md`

---

## 1. Page Purpose

Dedicated brand identity page. Communicates the brand's personality and gives users a clear entry point to browse product lines. Trust is established via aggregate ratings.

---

## 2. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │  ← AppHeader (sticky)
│  [Search ...]           │
├─────────────────────────┤
│  Home > Brands >        │  ← Breadcrumb (truncated, shows only parent)
│  Chobani                │
├─────────────────────────┤
│  ┌──────┐               │
│  │      │  Chobani      │  ← Brand logo (64×64) + name h1
│  │ Logo │               │
│  └──────┘               │
│  ★★★★☆ 4.1              │
│  523 reviews total       │
│                         │
│  Greek yogurt and dairy │  ← Full description (no truncation)
│  products...            │
├─────────────────────────┤
│  Product Lines          │  ← SectionHeading h2
│  ─────────────────────  │
│  [ProductLineCard]      │  ← 1-col stack
│  [ProductLineCard]      │
│  [ProductLineCard]      │
├─────────────────────────┤
│       AppFooter         │
└─────────────────────────┘
```

### Desktop (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search products, brands...]    [Sign In ▾] │
├─────────────────────────────────────────────────────────────────┤
│  Home > Brands > Chobani                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  Chobani                                          │
│  │          │  ★★★★☆ 4.1   523 total reviews                    │
│  │   Logo   │                                                   │
│  │  96×96   │  Greek yogurt and dairy products for everyday    │
│  └──────────┘  wellness. Founded in 2005...                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Product Lines                                                  │
│                                                                 │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐│
│  │  ProductLineCard │ │  ProductLineCard │ │  ProductLineCard ││  ← 3-col
│  └──────────────────┘ └──────────────────┘ └──────────────────┘│
│  ┌──────────────────┐ ┌──────────────────┐                     │
│  │  ProductLineCard │ │  ProductLineCard │                     │
│  └──────────────────┘ └──────────────────┘                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                          AppFooter                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Section Specs

### 3.1 Breadcrumb

```
Home > Brands > Chobani
```

- "Home" → `/`
- "Brands" → `/brands`
- "Chobani" — current page, `aria-current="page"`, not a link
- Mobile: Breadcrumb collapses to show "< Brands" (back link only) to save space

### 3.2 Brand Header

Two-column layout on desktop (logo left, info right); stacked on mobile.

**Logo:**
- `<Image src={brand.logoUrl} width={96} height={96} alt="{brand.name} logo" className="rounded-xl object-contain border border-border bg-white p-2">`
- Fallback: colored square with brand initial, same color derivation as BrandCard

**Brand Name:**
- `<h1 className="text-3xl font-bold">` on desktop, `text-2xl` on mobile

**Aggregate Rating:**
- `TrustBar` component inline: `★★★★☆ 4.1  (523 reviews total)`
- Stars: `StarRating` in display-only mode, size `sm`
- Review count: links to… (no separate reviews page in MVP — count is decorative)

**Description:**
- Full text, no truncation
- `text-base text-muted-foreground leading-relaxed`
- `max-w-prose` to keep line length readable on wide screens

**Header container:** `bg-muted/30 rounded-2xl p-6 mb-8`

### 3.3 Product Lines Section

- `<h2>` "Product Lines" — `text-2xl font-semibold`
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`

**ProductLineCard:**

```
┌───────────────────────────────┐
│  [Line Image — 16:9 ratio]    │  ← Next.js <Image>, object-cover
├───────────────────────────────┤
│  Greek Yogurt                 │  ← line name, h3 font-semibold
│  ★★★★☆ 4.3  (128 reviews)    │  ← TrustBar
│  8 variations                 │  ← text-sm text-muted-foreground
│                               │
│  Creamy, protein-packed greek │  ← description, line-clamp-2
│  yogurt in multiple flavors.  │
└───────────────────────────────┘
```

- Full card is `<Link href="/brands/{brandSlug}/{lineSlug}">` (no nested interactive elements)
- Hover: `hover:shadow-lg transition-shadow`
- Image placeholder: `bg-gradient-to-br from-orange-50 to-orange-200` when no image, with a ShoppingBasket icon centered
- `"8 variations"` — singular/plural handled: "1 variation" / "8 variations"

---

## 4. Component States

### Loading State

Page is SSR — skeleton shown only during client navigation.

**Brand Header Skeleton:**
```
┌──────────────────────────────────────┐
│ ████████   ██████████████████        │  ← logo + name
│            ██████████                │  ← rating
│            ████████████████████████  │  ← description line 1
│            ██████████████            │  ← description line 2
└──────────────────────────────────────┘
```

**Product Line Grid Skeleton:**
- 6 `SkeletonCard` components (image area + 3 text lines)

### Empty State — No Product Lines

```
┌────────────────────────────────────────────┐
│                                            │
│         [Package icon, 48px]               │
│                                            │
│         No products listed yet             │
│         Check back soon — Chobani's        │
│         products will appear here.         │
│                                            │
│         [← Back to all brands]             │
│                                            │
└────────────────────────────────────────────┘
```

- Brand name is interpolated into the message
- "Back to all brands" links to `/brands`
- Brand header still renders (logo, name, description) — empty state is only for the product lines section

### 404 State — Brand Slug Not Found

Rendered via Next.js `notFound()` → `app/not-found.tsx` (or a local `not-found.tsx` in the brands segment).

```
┌────────────────────────────────────────────┐
│                                            │
│         [SearchX icon, 64px]               │
│                                            │
│         Brand not found                    │
│         We couldn't find a brand at        │
│         this address.                      │
│                                            │
│         [Browse all brands]  [Go home]     │
│                                            │
└────────────────────────────────────────────┘
```

- HTTP 404 status (Next.js `notFound()` handles this)
- Two buttons: Browse → `/brands`, Home → `/`

### Error State

```
┌────────────────────────────────────────────┐
│  Something went wrong loading this brand.  │
│  [Try again]                               │
└────────────────────────────────────────────┘
```

- `ErrorBanner` component, `bg-red-50 border-red-200`

---

## 5. Responsive Breakpoints Summary

| Element | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---------|--------------|------------------|----------------|
| Brand header | Stacked (logo → name → rating → desc) | Side-by-side (logo left) | Side-by-side (logo left) |
| Logo size | 64×64 | 80×80 | 96×96 |
| Product line grid | 1 col | 2 col | 3 col |
| Breadcrumb | "< Brands" back link only | Full breadcrumb | Full breadcrumb |
| Description | Full text | Full text | Full text, max-w-prose |

---

## 6. SEO / Meta

```tsx
export async function generateMetadata({ params }) {
  const brand = await getBrand(params.brandSlug)
  return {
    title: `${brand.name} | ReviewWorld`,
    description: `Browse ${brand.name} products and read community reviews on ReviewWorld. ${brand.description?.slice(0, 120)}`,
    openGraph: {
      title: `${brand.name} | ReviewWorld`,
      description: brand.description,
      images: brand.logoUrl ? [{ url: brand.logoUrl }] : [],
    },
  }
}
```

---

## 7. shadcn/ui Components Used

- `Card` — ProductLineCard wrapper
- `Skeleton` — loading states for header + cards
- `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`
- `Button` — empty state CTAs, 404 CTAs
- `Badge` — could be used for variation count pill (optional)

---

## 8. Implementation Notes for FS

- Page: `app/brands/[brandSlug]/page.tsx` — Server Component
- Call `notFound()` from next/navigation when brand query returns null
- `generateMetadata` needs the same brand fetch — use React cache() to deduplicate the DB call
- `generateStaticParams` can pre-render popular brands at build time (optional optimization)
- `ProductLineCard` is a pure Server Component
- Image: use `next/image` with `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- Brand logo: use `unoptimized` prop if logos come from arbitrary external URLs (or configure `next.config.js` image domains)
- Aggregate rating: compute on the server (avg of all Review.rating across all Variations in all ProductLines of this Brand) — consider storing as a denormalized field if query is slow
