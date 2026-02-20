# ReviewWorld — Information Architecture

> Living document. Updated as tickets are designed.
> Last updated: 2026-02-19

---

## 1. Site Map

```
ReviewWorld
├── / (Home)
│   ├── Hero search bar
│   ├── Trending products (carousel/grid)
│   ├── Recently reviewed (feed)
│   └── Top brands (grid)
│
├── /brands (Brand Directory)
│   ├── Search/filter bar
│   ├── Category filters
│   └── Brand cards (grid)
│
├── /brands/[brandSlug] (Brand Page)
│   ├── Brand header (logo, name, about, stats)
│   ├── Product Lines (card grid)
│   └── Recent brand reviews (feed)
│
├── /brands/[brandSlug]/[lineSlug] (Product Line Page)
│   ├── Line header (breadcrumb, name, description)
│   ├── Variations (card grid or table)
│   └── Aggregated reviews across variations
│
├── /brands/[brandSlug]/[lineSlug]/[varSlug] (Variation Page)
│   ├── Variation header (image, name, breadcrumb)
│   ├── Rating summary (stars, "Would buy again" %)
│   ├── Review list (paginated)
│   └── Write review CTA
│
├── /review/new?variationId=... (Write Review)
│   ├── Product context header
│   ├── Star rating input
│   ├── "Would buy again" toggle
│   ├── Review textarea
│   └── Submit / cancel
│
├── /profile/[userId] (User Profile)
│   ├── Avatar, username, joined date
│   ├── Review count, helpfulness stats
│   └── User's reviews (feed)
│
├── /account (Account Settings)
│   ├── Profile info (name, avatar)
│   ├── Email / password
│   └── Notification preferences
│
└── /api/* (Next.js API routes — not user-facing)
```

---

## 2. Global Navigation

### Desktop Header (sticky)
```
┌─────────────────────────────────────────────────────────────────┐
│  ReviewWorld        [Search products, brands...]    [Sign In ▾] │
│                     ──────────────────────────                  │
│  Home  Brands  Trending                                         │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Header (sticky)
```
┌─────────────────────────┐
│  ReviewWorld        [≡] │
│  [Search ...]           │
└─────────────────────────┘
```
- Hamburger `[≡]` opens a `Sheet` (shadcn) from the right with full nav links
- Search bar always visible below the brand bar on mobile (not collapsed)

### Authenticated state — avatar replaces Sign In
```
[avatar ▾]  → My Reviews / Profile / Sign Out
```

---

## 3. Page Hierarchy & Breadcrumbs

Every page below Home shows a `Breadcrumb` component:

| Page | Breadcrumb |
|------|-----------|
| Brand | Home > Brands > {Brand Name} |
| Product Line | Home > Brands > {Brand} > {Line} |
| Variation | Home > Brands > {Brand} > {Line} > {Variation} |
| Write Review | Home > ... > {Variation} > Write Review |
| Profile | Home > Profile > {Username} |

---

## 4. Component Inventory

### Layout Components
| Component | Usage |
|-----------|-------|
| `AppHeader` | Global sticky header with nav + search |
| `AppFooter` | Links, copyright |
| `Breadcrumb` | shadcn Breadcrumb — all inner pages |
| `PageContainer` | Max-width wrapper, horizontal padding |
| `SectionHeading` | H2 + optional "See all" link |

### Data Display
| Component | Usage |
|-----------|-------|
| `BrandCard` | Logo, name, line count, top rating — used on Home + /brands |
| `ProductLineCard` | Line name, variation count, avg rating |
| `VariationCard` | Image, name, rating stars, review count, "Would buy again" % |
| `ReviewCard` | Avatar, username, stars, date, body, helpful votes |
| `RatingSummary` | Large star display, distribution bars (like Amazon) |
| `StarRating` | Interactive (review form) or display-only (cards) — custom component |
| `WouldBuyBadge` | Green/red badge showing % "Would buy again" |
| `TrustBar` | Inline: ★ 4.2  (128 reviews)  82% would buy again |

### Interactive
| Component | Usage |
|-----------|-------|
| `SearchBar` | Global header + hero — debounced, shows product + brand results |
| `SearchResults` | Dropdown/panel: grouped by Brands / Products |
| `ReviewForm` | Star picker, toggle, textarea, submit |
| `CategoryFilter` | Chip-style filter buttons for brand directory |
| `SortSelect` | shadcn Select — sort reviews (Most Recent, Highest, Lowest, Most Helpful) |
| `ReportDialog` | shadcn Dialog — flag a review |
| `HelpfulButton` | Thumbs up count on reviews |

### Feedback / State
| Component | Usage |
|-----------|-------|
| `SkeletonCard` | shadcn Skeleton — loading placeholder for cards |
| `EmptyState` | Icon + heading + body + optional CTA |
| `ErrorBanner` | Inline error with retry action |
| `Toast` | shadcn Toast — success/error for review submit, report |

---

## 5. Key User Flows

### A. Discover → Review
1. Home → search or browse trending
2. Brand page → select product line
3. Product line page → select variation
4. Variation page → read reviews → click "Write a Review"
5. Auth gate: if not signed in → sign in with Google → redirect back
6. Review form → submit → toast confirmation → back to variation page

### B. Direct Search
1. Type in global search bar
2. See grouped results (Brands / Products) in dropdown
3. Click result → navigate to brand or variation page

### C. Browse by Brand
1. /brands → filter by category or search brands
2. Select brand → brand page
3. Browse product lines → select line → see variations

---

## 6. Mobile-First Notes

- Cards stack to 1-column grid on mobile (< 640px), 2-col on sm, 3-col on md+
- Review form is full-screen on mobile (no modal — direct route `/review/new`)
- Navigation uses Sheet (slide-in drawer) on mobile
- Breadcrumbs collapse to "< Back" on mobile (show only parent)
- Star rating input uses large tap targets (min 44×44px)
- "Would buy again" uses a large toggle/pill, not a small checkbox

---

## 7. Trust & Safety UX Patterns

- Report button visible on every review (flag icon, opens `ReportDialog`)
- Reviews from new accounts get a "New reviewer" badge for transparency
- "Verified purchase" badge reserved for future integration
- Rating distribution chart on variation page prevents gaming perception

---

## 8. Empty States

| Context | Message | CTA |
|---------|---------|-----|
| Brand has no product lines | "No products listed yet." | "Suggest a product" |
| Product line has no variations | "No variations found." | "Add one" |
| Variation has no reviews | "Be the first to review this!" | "Write a Review" |
| User has no reviews | "No reviews yet." | "Find something to review" |
| Search returns nothing | "No results for '{query}'" | "Browse all brands" |

---

## 9. Color & Typography Conventions (Tailwind)

- **Primary action**: `bg-orange-500 hover:bg-orange-600` (brand color)
- **Stars**: `text-yellow-400` filled, `text-gray-300` empty
- **Would buy again — Yes**: `bg-green-100 text-green-700`
- **Would buy again — No**: `bg-red-100 text-red-700`
- **Muted text**: `text-muted-foreground` (shadcn token)
- **Card border**: `border border-border rounded-xl`
- **Font**: System font stack via Tailwind default (or Inter via next/font)

---

## 10. Accessibility Notes

- All interactive elements have visible focus rings (`focus-visible:ring-2`)
- Star rating component keyboard-navigable (arrow keys)
- Images have descriptive alt text
- Color is never the only trust signal (always paired with text)
- Skip-to-content link in header for keyboard users
