# UX Spec: Home Page (`/`)

> Ticket: #9 — UX+FS: Home page — hero, trending, search
> Status: UX Complete
> File: `docs/ux/home-page.md`

---

## 1. Page Purpose

Primary discovery and landing surface. Converts new visitors into browsers; authenticated users into reviewers. First impression — must communicate what ReviewWorld is within 3 seconds.

---

## 2. Full Page Layout

### Mobile (< 640px)

```
┌─────────────────────────┐
│  ReviewWorld        [≡] │  ← AppHeader (sticky)
│  [Search ...]           │
├─────────────────────────┤
│                         │
│   ReviewWorld           │  ← Hero section (bg-orange-500)
│   The community review  │
│   platform for food     │
│   products.             │
│                         │
│  ┌─────────────────┐    │
│  │ 🔍 Search...    │    │  ← SearchBar (large, white bg)
│  └─────────────────┘    │
│                         │
├─────────────────────────┤
│  Trending This Month    │  ← SectionHeading
│  ─────────────────────  │
│  [VariationCard]        │  ← 1-col stack on mobile
│  [VariationCard]        │
│  [VariationCard]        │
│  [VariationCard]        │
│  [VariationCard]        │
│  [VariationCard]        │
│  [ See all trending → ] │
├─────────────────────────┤
│  Recently Reviewed      │
│  ─────────────────────  │
│  ← [card][card][card] → │  ← Horizontal scroll strip
├─────────────────────────┤
│  ┌─────────────────┐    │  ← CTA Banner (unauthenticated only)
│  │ Sign in to leave │   │
│  │ your own reviews │   │
│  │  [Sign In]       │   │
│  └─────────────────┘    │
├─────────────────────────┤
│       AppFooter         │
└─────────────────────────┘
```

### Desktop (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search products, brands...]    [Sign In ▾] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│         ReviewWorld                                             │
│         The community review platform for food products.        │
│                                                                 │
│         ┌──────────────────────────────────┐                   │
│         │ 🔍  Search products or brands... │                   │
│         └──────────────────────────────────┘                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Trending This Month                            See all →       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                        │
│  │Var. Card │ │Var. Card │ │Var. Card │   ← 3-col grid         │
│  └──────────┘ └──────────┘ └──────────┘
│  ┌──────────┐ ┌──────────┐ ┌──────────┐
│  │Var. Card │ │Var. Card │ │Var. Card │
│  └──────────┘ └──────────┘ └──────────┘
├─────────────────────────────────────────────────────────────────┤
│  Recently Reviewed                              See all →       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Var. Card │ │Var. Card │ │Var. Card │ │Var. Card │  ← 4-col  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Join ReviewWorld — sign in to write reviews. [Sign In] │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                          AppFooter                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Section Specs

### 3.1 Hero Section

- **Background**: `bg-orange-500` (full bleed)
- **Text color**: `text-white`
- **Padding**: `py-16 px-4` mobile, `py-24 px-8` desktop
- **Heading**: `<h1>` "ReviewWorld" — `text-4xl font-bold` (mobile), `text-6xl` (desktop)
- **Tagline**: `<p>` "The community review platform for food products." — `text-xl text-orange-100`
- **SearchBar**: centered below tagline, max-width 600px, white background, `rounded-full`, large size with magnifier icon left and "Search" button right
  - On submit: navigates to `/api/search?q={query}` or shows inline dropdown (see SearchBar spec below)
  - Autofocus on desktop

### 3.2 SearchBar Component (Global + Hero)

Both the hero search and the header search share the same `SearchBar` component, styled differently:

| Property | Hero variant | Header variant |
|----------|-------------|----------------|
| Size | Large (`h-14`) | Medium (`h-10`) |
| Shape | `rounded-full` | `rounded-lg` |
| Background | `bg-white` | `bg-muted` |
| Width | max-w-[600px] centered | flex-1 |

**Behavior:**
- Debounce: 300ms after last keystroke fires `GET /api/search?q=`
- Dropdown appears below input showing grouped results:
  ```
  ┌──────────────────────────────────┐
  │ Brands                           │
  │  🏷 Chobani                      │
  │  🏷 Oatly                        │
  │ Products                         │
  │  🥛 Chobani Plain Greek Yogurt   │
  │  🥛 Oatly Oat Milk Original      │
  │ [ See all results for "cho" → ]  │
  └──────────────────────────────────┘
  ```
- Max 3 brands + 5 products in dropdown
- Keyboard nav: arrow keys move selection, Enter navigates, Escape closes
- Empty state in dropdown: "No results for '{query}'"
- On submit (Enter or "Search" click): navigate to full search results page (future ticket) or variation page if single exact match

### 3.3 Trending This Month Section

- **Heading**: `<h2>` "Trending This Month" with "See all →" link right-aligned
- **Grid**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- **Count**: Show 6 cards (3×2 on desktop, 2×3 on tablet, 1×6 on mobile)
- **Data**: Variations sorted by review count in last 30 days, joined with avg rating
- **Loading state**: 6 `SkeletonCard` components in same grid
- **Empty state** (< 6 products exist): Fill available slots with real cards, no placeholders shown to user — section hidden entirely if 0 products exist

### 3.4 Recently Reviewed Section

- **Heading**: `<h2>` "Recently Reviewed" with "See all →" link
- **Mobile**: Horizontal scroll strip (`flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory`) — each card `snap-start min-w-[260px]`
- **Desktop**: `grid grid-cols-4 gap-4` (first 4 most recent)
- **Data**: Variations ordered by most recent `Review.createdAt`
- **Loading**: 4 skeleton cards
- **Empty**: Section hidden if no reviews exist yet

### 3.5 CTA Banner (Unauthenticated Only)

- Rendered only when `session === null`
- `bg-orange-50 border border-orange-200 rounded-xl p-6`
- Text: "Join ReviewWorld — sign in to share your opinion on the foods you love."
- Button: `<Button variant="default">` "Sign In with Google" → triggers NextAuth `signIn('google')`
- Hidden entirely for authenticated users (not just visually — don't render)

---

## 4. VariationCard Component Spec

Used in both Trending and Recently Reviewed sections.

```
┌─────────────────────────┐
│  [Product Image 16:9]   │  ← Next.js <Image>, object-cover
├─────────────────────────┤
│  Chobani                │  ← brand name, text-sm text-muted-foreground
│  Plain Greek Yogurt     │  ← variation name, text-base font-semibold
│  Original (32oz)        │  ← line + variation, text-sm text-muted-foreground
│  ★★★★☆ 4.2  (128)      │  ← StarRating display + count
│  82% would buy again    │  ← WouldBuyBadge (green if ≥ 70%, red if < 70%)
│  [View Product →]       │  ← text-orange-500, links to /brands/.../...
└─────────────────────────┘
```

- Card component: `<Card className="overflow-hidden hover:shadow-md transition-shadow">`
- Image placeholder: orange-tinted gradient `bg-gradient-to-br from-orange-100 to-orange-200` when no image
- Full card is clickable (wrap in `<Link>`) — "View Product" is a visual affordance only
- `aria-label` = "{variation name} by {brand name}"

---

## 5. Component States

### Loading State
- Replace each card grid with `SkeletonCard` components
- `SkeletonCard`: matches VariationCard dimensions, uses `<Skeleton>` for image, text lines
- Hero SearchBar renders immediately (no skeleton needed)

### Empty State (no data in DB)
```
┌───────────────────────────────────┐
│         🍕                        │
│   Nothing here yet!               │
│   Be the first to review a        │
│   food product.                   │
│   [Browse Brands]                 │
└───────────────────────────────────┘
```
- Shown in place of both section grids
- Icon: use a `ShoppingBasket` icon from lucide-react (not emoji in production)
- Button links to `/brands`

### Error State
- `ErrorBanner` component below section heading
- "Could not load trending products. Try refreshing."
- Retry button calls the data fetch again

---

## 6. Responsive Breakpoints Summary

| Section | Mobile (<640) | Tablet (640–1023) | Desktop (≥1024) |
|---------|--------------|------------------|----------------|
| Hero search width | 100% | 80% centered | max-w-[600px] centered |
| Trending grid | 1 col | 2 col | 3 col |
| Recent grid | horizontal scroll | horizontal scroll | 4 col grid |
| CTA banner | stacked | stacked | inline (text left, button right) |

---

## 7. SEO / Meta

```tsx
export const metadata = {
  title: 'ReviewWorld — Community Reviews for Food Products',
  description: 'Discover and review food products. Real opinions from real people on yogurt, snacks, beverages, and more.',
  openGraph: {
    title: 'ReviewWorld',
    description: 'Community food product reviews',
    type: 'website',
  },
}
```

---

## 8. shadcn/ui Components Used

- `Card`, `CardContent` — VariationCard wrapper
- `Skeleton` — loading states
- `Button` — CTA banner, search button
- `Input` — search bar base
- `Badge` — "Would Buy Again" percentage badge
- `Sheet` — mobile nav (in AppHeader)

---

## 9. Implementation Notes for FS

- Page is a Next.js **Server Component** (`app/page.tsx`) — fetch trending + recent on server
- Pass data down to client `SearchBar` component (needs interactivity)
- `SearchBar` is a `'use client'` component with its own state
- Use `Promise.all` to fetch trending and recent in parallel on the server
- Trending + Recent sections: wrap in `<Suspense fallback={<SkeletonGrid />}>` for streaming
- CTA banner: check session server-side via `getServerSession()`, conditionally render
